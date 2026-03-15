import { createAutoTask } from './automationUtils'

export const handleTicketTriage = async (ticket) => {
  // Si el ticket es urgente, creamos tarea inmediata
  if (ticket.priority === 'urgent' || ticket.status === 'progreso') {
    await createAutoTask(
      ticket.leadId, 
      `SOPORTE CRÍTICO: ${ticket.issue} (Ticket #${ticket.id.slice(0,4)})`, 
      'high'
    )
  }
}