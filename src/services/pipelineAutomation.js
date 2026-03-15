// src/services/pipelineAutomation.js
import { createAutoTask, logSystemEvent } from './automationUtils'

export const handlePipelineTransition = async (lead, newStage) => {
  const { id, empresa, nombre } = lead

  if (newStage === 'despliegue') {
    // Tareas técnicas
    await createAutoTask(id, `Verificar SSL y DNS de ${empresa || nombre}`, 'high', 'devops')
    await createAutoTask(id, `Configurar Webhooks de Producción`, 'medium', 'devops')
    
    await logSystemEvent('REVENUE_IN', `Proyecto ${empresa} entra en fase de facturación mensual.`);
  }

  if (newStage === 'laboratorio') {
    await createAutoTask(id, `Preparar entorno de pruebas (Staging)`, 'low', 'devops')
  }
}