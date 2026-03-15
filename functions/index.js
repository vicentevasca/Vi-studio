/**
 * VI-CORE SYSTEM - MASTER BACKEND (Versión Ejecutora Multi-Agente)
 * Seguridad Blindada, Callbacks de Telegram y Automatización de Negocios.
 */

const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// --- CONFIGURACIÓN ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const MASTER_PASSWORD = process.env.MASTER_PASSWORD;
const DASHBOARD_URL = "https://vi-studio-core.web.app"; 

/**
 * 🛡️ SEGURIDAD Y HERRAMIENTAS TELEGRAM
 */
const verifyAccess = (req) => req.body.password === MASTER_PASSWORD || req.query.token === MASTER_PASSWORD;

const getAdminChatIds = async () => {
    const snap = await admin.firestore().collection('config').doc('telegram').get();
    return snap.exists ? snap.data().adminChatIds || [] : [];
};

const sendTelegramMsg = async (chatId, text, replyMarkup = null) => {
    try {
        const payload = { chat_id: chatId, text: text, parse_mode: "HTML" };
        if (replyMarkup) payload.reply_markup = replyMarkup;
        await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
    } catch (error) { console.error("Error enviando msg:", error.message); }
};

// Nueva función para editar mensajes (cuando presionas un botón)
const editTelegramMsg = async (chatId, messageId, newText) => {
    try {
        await axios.post(`${TELEGRAM_API}/editMessageText`, {
            chat_id: chatId,
            message_id: messageId,
            text: newText,
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: [] } // Borra los botones para evitar doble clic
        });
    } catch (error) { console.error("Error editando msg:", error.message); }
};

/**
 * 🚀 1. API CENTRAL Y ENRUTADOR DE WEBHOOKS
 */
exports.api = onRequest({ cors: true }, async (req, res) => {
    try {
        if (!verifyAccess(req)) return res.status(401).send({ error: "Firma inválida." });

        // Detectar si es una acción del panel, un mensaje de texto de Telegram, o un clic de botón (callback_query)
        const action = req.body.action || 
                       (req.body.message ? 'telegram_webhook' : 
                       (req.body.callback_query ? 'telegram_callback' : null));
        
        const payload = req.body.payload;
        const admins = await getAdminChatIds();

        switch (action) {
            case 'system_alert':
                const alertMsg = `<b>⚡ SISTEMA VI-CORE</b>\n\n🔹 <b>Evento:</b> ${payload.title}\n📝 <b>Detalle:</b> ${payload.message}`;
                await Promise.all(admins.map(id => sendTelegramMsg(id, alertMsg)));
                return res.status(200).send({ success: true });

            case 'telegram_webhook':
                return await handleBotCommands(req.body.message, res);

            case 'telegram_callback':
                return await handleBotCallbacks(req.body.callback_query, res);

            default:
                return res.status(400).send({ error: "Acción no reconocida." });
        }
    } catch (error) {
        console.error("🔥 Error en API:", error);
        return res.status(500).send({ error: error.message });
    }
});

/**
 * 🎯 2. EJECUTOR DE BOTONES (TELEGRAM CALLBACKS)
 * Esta es la magia: Atrapa los clics en los botones de Telegram
 */
async function handleBotCallbacks(callbackQuery, res) {
    const chatId = callbackQuery.message.chat.id.toString();
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data; // Ej: LEAD_AUD_12345
    const originalText = callbackQuery.message.text;
    
    const admins = await getAdminChatIds();
    if (!admins.includes(chatId)) return res.sendStatus(200);

    try {
        const parts = data.split('_');
        const actionType = `${parts[0]}_${parts[1]}`; // Extrae "LEAD_AUD"
        const docId = parts[2]; // Extrae el ID de Firebase

        // A. ACCIONES SOBRE LEADS (Nuevos Prospectos)
        if (actionType === 'LEAD_AUD') {
            await admin.firestore().collection('leads').doc(docId).update({ clientStatus: 'auditoria' });
            await editTelegramMsg(chatId, messageId, `<b>${originalText}</b>\n\n✅ <i>ACCIÓN EJECUTADA: Movido a Auditoría exitosamente.</i>`);
        } 
        else if (actionType === 'LEAD_DEL') {
            await admin.firestore().collection('leads').doc(docId).delete();
            await editTelegramMsg(chatId, messageId, `<b>${originalText}</b>\n\n🗑️ <i>ACCIÓN EJECUTADA: Lead descartado y eliminado de la base de datos.</i>`);
        }
        
        // B. ACCIONES SOBRE TICKETS DE SOPORTE
        else if (actionType === 'TKT_PROG') {
            await admin.firestore().collection('tickets').doc(docId).update({ status: 'progreso' });
            // Crea la tarea urgente en el Backlog automáticamente
            await admin.firestore().collection('tasks').add({
                leadId: 'Sistema Interno',
                title: `SOPORTE CRÍTICO: Revisar Ticket #${docId.slice(0,4)}`,
                priority: 'high',
                status: 'pending',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                isAutoGenerated: true
            });
            await editTelegramMsg(chatId, messageId, `<b>${originalText}</b>\n\n⚡ <i>ACCIÓN EJECUTADA: Ticket en revisión y Tarea Urgente inyectada al Backlog.</i>`);
        }
        else if (actionType === 'TKT_RES') {
            await admin.firestore().collection('tickets').doc(docId).update({ status: 'resuelto' });
            await editTelegramMsg(chatId, messageId, `<b>${originalText}</b>\n\n✅ <i>ACCIÓN EJECUTADA: Ticket marcado como resuelto.</i>`);
        }

        // Responde a Telegram para quitar el icono de "cargando" del botón
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, { callback_query_id: callbackQuery.id, text: "Orden ejecutada en VI-CORE" });

    } catch (error) {
        console.error("Error en Callback:", error);
        await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, { callback_query_id: callbackQuery.id, text: "Error ejecutando orden" });
    }
    return res.sendStatus(200);
}

/**
 * 🌟 3. TRIGGER: NUEVO PROSPECTO CON ASISTENTE DE WHATSAPP
 */
exports.notifyNewLead = onDocumentCreated("leads/{leadId}", async (event) => {
    const newLead = event.data.data();
    const leadId = event.params.leadId;
    const admins = await getAdminChatIds();

    const msg = `🌟 <b>NUEVO PROSPECTO EN RADAR</b>\n\n` +
                `👤 <b>Nombre:</b> ${newLead.nombre || 'No registrado'}\n` +
                `🏢 <b>Empresa:</b> ${newLead.empresa || 'No registrada'}\n` +
                `📧 <b>Email:</b> ${newLead.email || 'No registrado'}\n` +
                `📱 <b>Teléfono:</b> ${newLead.telefono || 'No registrado'}`;

    // Magia WhatsApp: Limpia el número (quita +, espacios, guiones) para armar el link profundo
    const phoneClean = newLead.telefono ? newLead.telefono.replace(/\D/g, '') : '';
    const textWa = encodeURIComponent(`Hola ${newLead.nombre || ''}, he recibido tu solicitud en VI-CORE. ¿En qué te puedo ayudar?`);
    const waLink = `https://wa.me/${phoneClean}?text=${textWa}`;

    const inlineMenu = {
        inline_keyboard: [
            // Fila 1: Hablar directo (Solo si hay teléfono)
            ...(phoneClean ? [[{ text: "💬 Hablar por WhatsApp ahora", url: waLink }]] : []),
            // Fila 2: Decisiones ejecutivas
            [
                { text: "✅ Aceptar (Auditoría)", callback_data: `LEAD_AUD_${leadId}` },
                { text: "🗑️ Descartar", callback_data: `LEAD_DEL_${leadId}` }
            ],
            // Fila 3: Ir al panel web
            [{ text: "📂 Abrir Expediente Web", url: `${DASHBOARD_URL}/admin/expediente/${leadId}` }]
        ]
    };

    await Promise.all(admins.map(id => sendTelegramMsg(id, msg, inlineMenu)));
});

/**
 * 🆘 4. TRIGGER: NUEVO TICKET DE SOPORTE
 */
exports.notifyNewTicket = onDocumentCreated("tickets/{ticketId}", async (event) => {
    const ticket = event.data.data();
    const ticketId = event.params.ticketId;
    const admins = await getAdminChatIds();

    const msg = `🆘 <b>NUEVO TICKET DE CLIENTE</b>\n\n` +
                `🏢 <b>Firma:</b> ${ticket.clientName || 'Desconocido'}\n` +
                `⚠️ <b>Asunto:</b> ${ticket.issue}\n` +
                `🚨 <b>Prioridad:</b> ${ticket.priority || 'Normal'}`;

    const inlineMenu = {
        inline_keyboard: [
            [
                { text: "⚡ Tomar Ticket y Crear Tarea", callback_data: `TKT_PROG_${ticketId}` },
                { text: "✅ Cerrar Rápido", callback_data: `TKT_RES_${ticketId}` }
            ]
        ]
    };

    await Promise.all(admins.map(id => sendTelegramMsg(id, msg, inlineMenu)));
});

/**
 * 🎮 5. COMANDOS DE TEXTO (Menú persistente)
 */
async function handleBotCommands(message, res) {
    if (!message || !message.text) return res.sendStatus(200);
    const chatId = message.chat.id.toString();
    const text = message.text;
    const admins = await getAdminChatIds();

    if (!admins.includes(chatId)) {
        await sendTelegramMsg(chatId, "🚫 <b>No autorizado.</b>");
        return res.sendStatus(200);
    }

    const mainMenu = {
        keyboard: [
            [{ text: "💎 Ver Finanzas" }, { text: "📊 Estado Pipeline" }],
            [{ text: "🖥️ Abrir Panel Web" }]
        ],
        resize_keyboard: true,
        is_persistent: true
    };

    if (text === '💎 Ver Finanzas') {
        const snap = await admin.firestore().collection('leads').where('clientStatus', '==', 'despliegue').get();
        let total = 0;
        snap.forEach(doc => total += (Number(doc.data().amountPaid) || 0));
        await sendTelegramMsg(chatId, `💎 <b>FINANZAS</b>\nRecaudación: $${total.toLocaleString('es-CL')}\nActivos: ${snap.size}`, mainMenu);
    }
    else if (text === '📊 Estado Pipeline') {
        const snap = await admin.firestore().collection('leads').get();
        const counts = { radar: 0, auditoria: 0, laboratorio: 0, negociacion: 0, despliegue: 0 };
        snap.forEach(doc => { if (counts[doc.data().clientStatus] !== undefined) counts[doc.data().clientStatus]++; });
        const msg = `📊 <b>PIPELINE CRM</b>\n📡 Radar: ${counts.radar}\n🗓️ Auditor: ${counts.auditoria}\n🧪 Lab: ${counts.laboratorio}\n📄 Negoc: ${counts.negociacion}\n🚀 Deploy: ${counts.despliegue}`;
        await sendTelegramMsg(chatId, msg, mainMenu);
    }
    else if (text === '🖥️ Abrir Panel Web') {
        const inlineMenu = { inline_keyboard: [[{ text: "Acceder a VI-CORE", url: DASHBOARD_URL }]] };
        await sendTelegramMsg(chatId, "🌐 Enlace directo al sistema:", inlineMenu);
    }
    else {
        await sendTelegramMsg(chatId, `🤖 <b>Asistente VI-CORE a tus órdenes.</b>`, mainMenu);
    }

    return res.sendStatus(200);
}

/**
 * 🛡️ 6. EL GUARDIÁN NOCTURNO (Tarea Programada cada 24h)
 * Revisa si hay clientes olvidados o estancados en el Pipeline
 */
exports.systemGuardian = onSchedule("every 24 hours", async (event) => {
    const snap = await admin.firestore().collection('leads').get();
    const admins = await getAdminChatIds();
    const now = Date.now();
    let warnings = [];

    snap.forEach(doc => {
        const data = doc.data();
        // Obtiene la última fecha de actualización, creación, o fallback a hoy
        const lastUpd = data.updatedAt?.toMillis() || data.createdAt?.toMillis() || now;
        
        // Calcula la diferencia en días
        const diff = (now - lastUpd) / (1000 * 60 * 60 * 24);

        // Si pasaron más de 7 días y no está archivado, genera alerta
        if (diff > 7 && data.clientStatus !== 'archivo') {
            warnings.push(`⚠️ <b>${data.empresa || data.nombre}</b> (${Math.floor(diff)} días sin mover en ${data.clientStatus})`);
        }
    });

    // Si hay advertencias, dispara el mensaje a Telegram
    if (warnings.length > 0) {
        const msg = `🛡️ <b>REPORTE DE SALUD MATUTINO</b>\n\nTienes prospectos que se están enfriando y requieren tu atención:\n\n${warnings.join('\n')}`;
        await Promise.all(admins.map(id => sendTelegramMsg(id, msg)));
    }
});