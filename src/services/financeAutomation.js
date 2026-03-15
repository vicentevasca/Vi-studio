import { db } from '../firebase'
import { addDoc, collection, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { logSystemEvent } from './automationUtils'

export const financeAutomation = {
  /**
   * Registra un nuevo pago y actualiza la proyección del cliente
   */
  async processNewPayment(lead, amount) {
    try {
      const leadRef = doc(db, 'leads', lead.id);
      const newTotal = (Number(lead.amountPaid) || 0) + Number(amount);

      // 1. Actualizar el expediente del cliente
      await updateDoc(leadRef, {
        amountPaid: newTotal,
        lastPaymentDate: serverTimestamp(),
        paymentHistory: [...(lead.paymentHistory || []), { amount, date: new Date() }]
      });

      // 2. Log de auditoría
      await logSystemEvent('REVENUE_IN', `Pago recibido: $${amount} de ${lead.empresa || lead.nombre}`);

      // 3. Retornar datos para notificación
      return {
        success: true,
        newTotal,
        msg: `💰 Ingreso registrado: +$${amount} | Total: $${newTotal}`
      };
    } catch (error) {
      console.error("Error en FinanceAutomation:", error);
      return { success: false, error };
    }
  }
}