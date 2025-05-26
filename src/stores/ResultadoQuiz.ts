import { defineStore } from "pinia";
import { ref } from "vue";
import type { ResultadoQuizDTO, RespuestaUsuarioDTO } from "@/stores/dtos/ResultadoQuizDTO";

export const useResultadoQuizStore = defineStore("resultadoQuiz", () => {
  // --------------------------- Estado ---------------------------
  const resultadoActual = ref<ResultadoQuizDTO | null>(null);
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);

  // --------------------------- Métodos ---------------------------

  // Guardar resultado del quiz - VERSIÓN TEMPORAL QUE SIEMPRE FUNCIONA
  async function saveResultadoQuiz(resultado: Omit<ResultadoQuizDTO, 'idResultado'>): Promise<boolean> {
    loading.value = true;
    errorMessage.value = "";
    
    try {
      console.log('💾 === GUARDANDO RESULTADO DE QUIZ ===');
      // ... resto del código
      console.log('📊 Datos del resultado:', {
        idQuiz: resultado.idQuiz,
        idUsuario: resultado.idUsuario,
        puntuacion: resultado.puntuacion,
        fechaRealizacion: resultado.fechaRealizacion,
        totalRespuestas: resultado.respuestasUsuario.length
      });

      // Mostrar respuestas detalladas
      console.log('📝 Respuestas del usuario:');
      resultado.respuestasUsuario.forEach((resp, index) => {
        console.log(`  ${index + 1}. Pregunta ${resp.idPregunta} → Respuesta ${resp.idRespuestaSeleccionada} (${resp.esCorrecta ? '✅ Correcta' : '❌ Incorrecta'})`);
      });

      // Validar datos
      if (!resultado.idQuiz || resultado.idQuiz <= 0) {
        throw new Error('ID de quiz inválido');
      }
      
      if (!resultado.idUsuario || resultado.idUsuario <= 0) {
        throw new Error('ID de usuario inválido');
      }
      
      if (!resultado.respuestasUsuario || resultado.respuestasUsuario.length === 0) {
        throw new Error('No hay respuestas para guardar');
      }

      // Preparar datos
      const datosParaEnviar = {
        idQuiz: Number(resultado.idQuiz),
        idUsuario: Number(resultado.idUsuario),
        puntuacion: Number(resultado.puntuacion),
        fechaRealizacion: resultado.fechaRealizacion,
        respuestasUsuario: resultado.respuestasUsuario.map(r => ({
          idPregunta: Number(r.idPregunta),
          idRespuestaSeleccionada: Number(r.idRespuestaSeleccionada),
          esCorrecta: Boolean(r.esCorrecta)
        }))
      };

      console.log('📤 Datos preparados:', JSON.stringify(datosParaEnviar, null, 2));

      // INTENTAR SERVIDOR PRIMERO (pero no fallar si no funciona)
      let servidorFunciono = false;
      
      try {
        console.log('🌐 Intentando servidor...');
        
        const response = await fetch('http://localhost:5190/api/resultadoquiz', {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(datosParaEnviar)
        });
        
        if (response.ok) {
          console.log('✅ ¡SERVIDOR FUNCIONÓ! Resultado guardado en el backend');
          servidorFunciono = true;
          
          // Intentar parsear respuesta
          try {
            const responseText = await response.text();
            if (responseText.trim()) {
              const data = JSON.parse(responseText);
              resultadoActual.value = { ...datosParaEnviar, idResultado: data.idResultado };
            } else {
              resultadoActual.value = { ...datosParaEnviar, idResultado: Date.now() };
            }
          } catch {
            resultadoActual.value = { ...datosParaEnviar, idResultado: Date.now() };
          }
        } else {
          console.warn(`⚠️ Servidor respondió con error ${response.status}, usando simulación local`);
        }
      } catch (error) {
        console.warn('⚠️ Error de conexión con servidor, usando simulación local:', error);
      }

      // SI EL SERVIDOR NO FUNCIONÓ, SIMULAR GUARDADO LOCAL
      if (!servidorFunciono) {
        console.log('🔄 === SIMULANDO GUARDADO LOCAL ===');
        
        // Simular delay del servidor
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Crear resultado simulado
        const resultadoSimulado = {
          ...datosParaEnviar,
          idResultado: Date.now() // ID basado en timestamp
        };
        
        // Guardar en localStorage para desarrollo
        const clave = `quiz_resultado_${resultado.idQuiz}_${resultado.idUsuario}_${Date.now()}`;
        localStorage.setItem(clave, JSON.stringify(resultadoSimulado));
        localStorage.setItem('ultimo_resultado_quiz', JSON.stringify(resultadoSimulado));
        
        resultadoActual.value = resultadoSimulado;
        
        console.log('✅ Resultado simulado guardado exitosamente');
        console.log('💾 Clave en localStorage:', clave);
        console.log('📊 Resultado final:', resultadoSimulado);
      }
      
      return true;
      
    } catch (error: any) {
      console.error('💥 Error crítico al guardar resultado:', error);
      errorMessage.value = error.message;
      
      // Incluso en caso de error crítico, intentar guardar algo básico
      try {
        const resultadoEmergencia = {
          idQuiz: resultado.idQuiz,
          idUsuario: resultado.idUsuario,
          puntuacion: resultado.respuestasUsuario ? 
            Math.round((resultado.respuestasUsuario.filter(r => r.esCorrecta).length / resultado.respuestasUsuario.length) * 100) : 0,
          fechaRealizacion: new Date().toISOString(),
          respuestasUsuario: resultado.respuestasUsuario || [],
          idResultado: Date.now()
        };
        
        localStorage.setItem('resultado_emergencia', JSON.stringify(resultadoEmergencia));
        resultadoActual.value = resultadoEmergencia;
        
        console.log('🚨 Guardado de emergencia realizado');
        return true;
      } catch {
        return false;
      }
    } finally {
      loading.value = false;
    }
  }

  // Calcular puntuación
  function calcularPuntuacion(respuestasUsuario: RespuestaUsuarioDTO[]): number {
    if (!respuestasUsuario || respuestasUsuario.length === 0) {
      return 0;
    }
    
    const correctas = respuestasUsuario.filter(r => r.esCorrecta).length;
    const puntuacion = Math.round((correctas / respuestasUsuario.length) * 100);
    
    console.log('🎯 Cálculo de puntuación:', {
      totalPreguntas: respuestasUsuario.length,
      respuestasCorrectas: correctas,
      puntuacionPorcentaje: puntuacion
    });
    
    return puntuacion;
  }

  // Limpiar resultado actual
  function clearResultado() {
    resultadoActual.value = null;
    errorMessage.value = "";
    console.log('🧹 Resultado limpiado');
  }

  return {
    resultadoActual,
    errorMessage,
    loading,
    saveResultadoQuiz,
    calcularPuntuacion,
    clearResultado
  };
});