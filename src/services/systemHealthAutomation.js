import { createAutoTask, logSystemEvent } from './automationUtils'

export const systemHealthAutomation = {
  /**
   * Revisa si un lead está "estancado" (sin cambios por muchos días)
   */
  async checkLeadStagnation(lead, daysLimit = 7) {
    const lastUpdate = lead.updatedAt?.toDate() || lead.createdAt?.toDate();
    const now = new Date();
    const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    if (diffDays >= daysLimit && lead.clientStatus !== 'archivo') {
      // 1. Crear tarea de alerta inmediata
      await createAutoTask(
        lead.id, 
        `ALERTA: Cliente estancado en ${lead.clientStatus} por ${diffDays} días`, 
        'high',
        'sistema'
      );

      // 2. Registrar evento de salud
      await logSystemEvent('HEALTH_WARNING', `Cliente ${lead.empresa} requiere atención inmediata por inactividad.`);
      
      return true; // Indica que se disparó una alerta
    }
    return false;
  }
}