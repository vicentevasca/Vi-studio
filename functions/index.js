/**
 * VI-CORE SYSTEM - OFFICIAL BACKEND (V3.5 Enterprise CRM)
 * Motor de Inteligencia de Negocios, Automatización de PDFs, Gestión de Pipeline,
 * Alertas de Tiempo Real y Control Remoto Telegram.
 */

const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const v1 = require("firebase-functions/v1");
const admin = require("firebase-admin");
const axios = require("axios");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const FormData = require('form-data');

// Inicialización
admin.initializeApp();
setGlobalOptions({ region: "us-central1" });

// --- CONFIGURACIÓN DINÁMICA ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const DASHBOARD_URL = process.env.DASHBOARD_URL;
const MASTER_PASSWORD = process.env.MASTER_PASSWORD; 

// --- DICCIONARIO DEL PIPELINE (Fácilmente adaptable a cualquier negocio) ---
const PIPELINE_STAGES = [
    { id: 'radar', title: 'Radar', icon: '📡', next: 'auditoria' },
    { id: 'auditoria', title: 'Auditoría', icon: '🗓️', next: 'laboratorio' },
    { id: 'laboratorio', title: 'Laboratorio', icon: '🧪', next: 'negociacion' },
    { id: 'negociacion', title: 'Negociación', icon: '📄', next: 'despliegue' },
    { id: 'despliegue', title: 'Despliegue', icon: '🚀', next: 'archivo' },
    { id: 'archivo', title: 'Archivo', icon: '🗄️', next: null }
];

// --- HELPER: OBTENER ADMINS AUTORIZADOS ---
async function getAdminChatIds() {
    const snapshot = await admin.firestore().collection('bot_auth')
        .where('isAuthenticated', '==', true).get();
    return snapshot.docs.map(doc => doc.id);
}

// ============================================================================
// MÓDULO 1: ALERTAS DE NUEVOS PROSPECTOS (LEAD RESPONSE)
// ============================================================================
exports.onNewLead = v1.firestore
    .document('leads/{leadId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const admins = await getAdminChatIds();
        if (admins.length === 0) return null;

        const cleanPhone = String(data.telefono || '').replace(/[^0-9]/g, '');

        let msg = `🚨 <b>NUEVO PROSPECTO DETECTADO</b> 🚨\n\n`;
        msg += `👤 <b>Director:</b> ${data.nombre}\n`;
        msg += `🏢 <b>Firma:</b> ${data.empresa || 'No especificada'}\n`;
        msg += `🔥 <b>Desafío:</b>\n<i>"${data.desafio || 'Sin información'}"</i>\n\n`;
        msg += `⚙️ <b>Estado:</b> Ingresado a 📡 RADAR.`;

        const keyboard = {
            inline_keyboard: [
                [{ text: "💬 Iniciar Contacto WhatsApp", url: `https://wa.me/${cleanPhone}` }]
            ]
        };

        const sendPromises = admins.map(chatId => 
            axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: msg, parse_mode: "HTML", reply_markup: keyboard })
        );
        await Promise.all(sendPromises);
        return null;
    });

// ============================================================================
// MÓDULO 2: FÁBRICA DE PROPUESTAS PDF (GASTO CERO)
// ============================================================================
async function generateProposalPDF(leadData, leadId) {
    try {
        const bucket = admin.storage().bucket();
        const templateFile = await bucket.file('templates/propuesta_base.pdf').download();
        
        const pdfDoc = await PDFDocument.load(templateFile[0]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const firstPage = pdfDoc.getPages()[0];

        const name = leadData.nombre || "Cliente Estratégico";
        const company = leadData.empresa || "Firma Privada";
        const budget = leadData.budgetNum || "A convenir"; 

        firstPage.drawText(name.toUpperCase(), { x: 150, y: 645, size: 14, font: boldFont, color: rgb(1, 1, 1) });
        firstPage.drawText(company, { x: 150, y: 625, size: 12, font: font, color: rgb(0.6, 0.6, 0.6) });
        
        const desafio = leadData.desafio || "Consultoría técnica a medida.";
        firstPage.drawText(desafio, { x: 50, y: 500, size: 11, font: font, maxWidth: 500, lineHeight: 15 });

        if (leadData.budgetNum) {
            firstPage.drawText(`$${budget} USD`, { x: 400, y: 150, size: 20, font: boldFont, color: rgb(0.85, 0.7, 0.99) });
        }

        const pdfBytes = await pdfDoc.save();
        const fileName = `proposals/Propuesta_${leadId}_${Date.now()}.pdf`;
        const file = bucket.file(fileName);
        
        await file.save(pdfBytes, { contentType: 'application/pdf' });
        const [url] = await file.getSignedUrl({ action: 'read', expires: '03-01-2030' });
        
        return { url, pdfBytes, fileName };
    } catch (error) {
        console.error("Error PDF Engine:", error);
        return null;
    }
}

// ============================================================================
// MÓDULO 3: CEREBRO DEL PIPELINE (Notificador)
// ============================================================================
exports.onPipelineMove = v1.firestore
    .document('leads/{leadId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();
        const leadId = context.params.leadId;

        if (newData.stage === oldData.stage) return null;

        const admins = await getAdminChatIds();
        const oldStage = PIPELINE_STAGES.find(s => s.id === oldData.stage) || {};
        const newStage = PIPELINE_STAGES.find(s => s.id === newData.stage) || {};

        let msg = `🔄 <b>MOVIMIENTO EN PIPELINE</b>\n`;
        msg += `Firma: <b>${newData.empresa || newData.nombre}</b>\n`;
        msg += `Transición: ${oldStage.icon || '⚪'} ➔ <b>${newStage.icon || '⚪'} ${newStage.title?.toUpperCase()}</b>`;

        if (newData.stage === 'negociacion') {
            const proposal = await generateProposalPDF(newData, leadId);
            if (proposal) {
                for (const chatId of admins) {
                    const form = new FormData();
                    form.append('chat_id', chatId);
                    form.append('document', Buffer.from(proposal.pdfBytes), { filename: `Propuesta_${newData.empresa || 'VI_Studio'}.pdf` });
                    form.append('caption', `📄 <b>Arquitectura Documental Lista</b>\nAquí tienes la propuesta generada.`);
                    form.append('parse_mode', 'HTML');
                    await axios.post(`${TELEGRAM_API}/sendDocument`, form, { headers: form.getHeaders() });
                }
                return change.after.ref.update({ proposalUrl: proposal.url, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
            }
        } else {
            for (const chatId of admins) {
                await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: msg, parse_mode: "HTML" });
            }
        }
        return null;
    });

// ============================================================================
// MÓDULO 4: TELEGRAM WEBHOOK (INTERACTIVIDAD AVANZADA)
// ============================================================================
exports.telegramWebhook = onRequest(async (req, res) => {
    try {
        const { message, callback_query } = req.body;
        const chat = message ? message.chat : callback_query.message.chat;
        const chatId = String(chat.id);
        const text = message?.text;

        const authRef = admin.firestore().collection('bot_auth').doc(chatId);
        const authDoc = await authRef.get();
        const isAuth = authDoc.exists && authDoc.data().isAuthenticated;

        if (text === "/start") {
            if (isAuth) return await sendMainMenu(chatId, "✅ Terminal Conectada.");
            return await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: "🔒 Ingresa la Master Key." });
        }

        if (!isAuth) {
            if (text === MASTER_PASSWORD) {
                await authRef.set({ isAuthenticated: true, linkedAt: new Date().toISOString() });
                return await sendMainMenu(chatId, "🔓 <b>Acceso Concedido</b>\nBienvenido a la red privada, Director.");
            }
            return res.sendStatus(200);
        }

        // --- MANEJO DE BOTONES INTERACTIVOS (CALLBACK QUERIES) ---
        if (callback_query && callback_query.data) {
            const data = callback_query.data;

            // Acción 1: Ver leads de una fase específica
            if (data.startsWith("VIEW_STAGE:")) {
                const stageId = data.split(":")[1];
                const stageInfo = PIPELINE_STAGES.find(s => s.id === stageId);
                const snap = await admin.firestore().collection('leads').where('stage', '==', stageId).get();

                if (snap.empty) {
                    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: `📭 No hay expedientes en ${stageInfo.title}.` });
                } else {
                    for (const doc of snap.docs) {
                        const lead = doc.data();
                        let leadMsg = `${stageInfo.icon} <b>${lead.empresa || lead.nombre}</b>\n👤 ${lead.nombre}\n🔥 Desafío: ${lead.desafio || 'N/A'}`;
                        
                        // Si hay una fase siguiente, creamos el botón "Avanzar"
                        let inlineKeyboard = [];
                        if (stageInfo.next) {
                            const nextInfo = PIPELINE_STAGES.find(s => s.id === stageInfo.next);
                            inlineKeyboard.push([{ text: `⏭ Avanzar a ${nextInfo.title}`, callback_data: `MOVE_LEAD:${doc.id}:${stageInfo.next}` }]);
                        }

                        await axios.post(`${TELEGRAM_API}/sendMessage`, { 
                            chat_id: chatId, 
                            text: leadMsg, 
                            parse_mode: "HTML", 
                            reply_markup: { inline_keyboard: inlineKeyboard } 
                        });
                    }
                }
            }

            // Acción 2: Mover un Lead a la siguiente fase
            if (data.startsWith("MOVE_LEAD:")) {
                const [_, leadId, nextStageId] = data.split(":");
                
                // Actualiza Firestore (Esto disparará el onPipelineMove automáticamente)
                await admin.firestore().collection('leads').doc(leadId).update({ 
                    stage: nextStageId, 
                    updatedAt: admin.firestore.FieldValue.serverTimestamp() 
                });

                // Borra el botón del mensaje para que no se pueda clickear 2 veces
                await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
                    chat_id: chatId,
                    message_id: callback_query.message.message_id,
                    reply_markup: { inline_keyboard: [] }
                });
            }

            // Responder a Telegram para apagar el icono de "Cargando" del botón
            await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, { callback_query_id: callback_query.id });
            return res.sendStatus(200);
        }

        // --- COMANDOS DEL MENÚ PRINCIPAL ---
        if (isAuth && text) {
            if (text === "⏳ Ver Pipeline") {
                let pipeMsg = `📊 <b>TELEMETRÍA DEL PIPELINE</b>\n\n`;
                let stageButtons = [];

                for (const s of PIPELINE_STAGES) {
                    const snap = await admin.firestore().collection('leads').where('stage', '==', s.id).get();
                    pipeMsg += `${s.icon} [ ${snap.size} ] - ${s.title.toUpperCase()}\n`;
                    
                    // Solo mostramos botones para abrir fases que tengan prospectos (y no archivo)
                    if (snap.size > 0 && s.id !== 'archivo') {
                        stageButtons.push([{ text: `🔎 Ver prospectos en ${s.title}`, callback_data: `VIEW_STAGE:${s.id}` }]);
                    }
                }
                return await axios.post(`${TELEGRAM_API}/sendMessage`, { 
                    chat_id: chatId, 
                    text: pipeMsg, 
                    parse_mode: "HTML",
                    reply_markup: { inline_keyboard: stageButtons }
                });
            }
            
            if (text === "📋 Seguimientos Hoy") {
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                const staleSnap = await admin.firestore().collection('leads')
                    .where('stage', '==', 'negociacion')
                    .where('updatedAt', '<', threeDaysAgo).get();

                let msg = `⚠️ <b>PROTOCOLOS DE SEGUIMIENTO</b>\n\n`;
                if (staleSnap.empty) msg += "✅ No hay prospectos estancados.";
                else staleSnap.forEach(doc => msg += `• <b>${doc.data().empresa || doc.data().nombre}</b> (+3 días)\n`);
                
                return await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: msg, parse_mode: "HTML" });
            }
        }
    } catch (error) {
        console.error("Webhook Error:", error);
    }
    res.sendStatus(200);
});

// ============================================================================
// MÓDULO 5: REPORTE DIARIO MATUTINO (Cron Job)
// ============================================================================
exports.dailyBriefing = onSchedule({
    schedule: "0 8 * * 1-5", 
    timeZone: "America/Santiago"
}, async (event) => {
    const admins = await getAdminChatIds();
    if (admins.length === 0) return;
    
    const radarSnap = await admin.firestore().collection('leads').where('stage', '==', 'radar').get();
    const negSnap = await admin.firestore().collection('leads').where('stage', '==', 'negociacion').get();
    let totalPotential = 0;
    negSnap.forEach(doc => totalPotential += (doc.data().budgetNum || 0));

    let msg = `☀️ <b>REPORTE MATUTINO VI-CORE</b>\n\n💰 Valor Est. en Negociación: <b>$${totalPotential.toLocaleString()} USD</b>\n📡 Nuevos en Radar: <b>${radarSnap.size}</b>`;
    for (const chatId of admins) await sendMainMenu(chatId, msg);
});

async function sendMainMenu(chatId, text) {
    const keyboard = {
        keyboard: [ [{ text: "⏳ Ver Pipeline" }, { text: "📋 Seguimientos Hoy" }] ],
        resize_keyboard: true
    };
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text, parse_mode: "HTML", reply_markup: keyboard });
}

// ============================================================================
// MÓDULO 6: API DE TELEMETRÍA, TICKETING Y KILL-SWITCH (ERP)
// ============================================================================
exports.clientApi = onRequest(async (req, res) => {
    // Configuración CORS para permitir que cualquier app web/móvil se conecte
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(204).send('');

    const { action, clientId, payload } = req.body;

    if (!clientId) return res.status(400).send({ error: "Falta identificador de cliente (clientId)." });

    try {
        // 🛑 EL KILL-SWITCH: El software del cliente pregunta "Puedo funcionar?"
        if (action === 'check_status') {
            const doc = await admin.firestore().collection('leads').doc(clientId).get();
            if (!doc.exists) return res.status(404).send({ status: 'unauthorized', message: 'Sistema no registrado en VI-CORE.' });
            
            const data = doc.data();
            // Retorna el estado exacto al sistema del cliente
            return res.status(200).send({ 
                status: data.systemStatus || 'active', // active, suspended_payment, maintenance
                message: data.systemMessage || 'Operación Normal.' 
            });
        }

        // 🆘 TICKETING: El sistema del cliente envía un reporte de error a tu CRM
        if (action === 'submit_ticket') {
            const ticket = {
                clientId,
                issue: payload.issue || 'Error general no especificado',
                severity: payload.severity || 'normal', // normal, high, critical
                contactEmail: payload.contactEmail || '',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'open'
            };
            
            // Guardar en la base de datos
            await admin.firestore().collection('tickets').add(ticket);

            // 🚨 Alerta Inmediata a Telegram
            const admins = await getAdminChatIds();
            const doc = await admin.firestore().collection('leads').doc(clientId).get();
            const clientName = doc.exists ? (doc.data().empresa || doc.data().nombre) : clientId;
            
            let msg = `🆘 <b>NUEVO TICKET DE SOPORTE</b> 🆘\n\n`;
            msg += `🏢 <b>Firma:</b> ${clientName}\n`;
            msg += `🔴 <b>Severidad:</b> ${ticket.severity.toUpperCase()}\n`;
            msg += `⚠️ <b>Reporte:</b> <i>"${ticket.issue}"</i>\n\n`;
            msg += `Puedes gestionar este incidente en tu Dashboard Web.`;

            const sendPromises = admins.map(chatId => 
                axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: msg, parse_mode: "HTML" })
            );
            await Promise.all(sendPromises);

            return res.status(200).send({ success: true, message: "Ticket recibido en Central VI-CORE." });
        }

        return res.status(400).send({ error: "Acción no reconocida." });
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).send({ error: "Error interno del servidor VI-CORE." });
    }
});