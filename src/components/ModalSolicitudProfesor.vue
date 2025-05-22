<template>
  <v-dialog 
    :model-value="dialog" 
    @update:model-value="$emit('close')"
    max-width="600" 
    persistent
    class="modal-solicitud"
  >
    <v-card class="modal-card" elevation="24">
      <!-- Header -->
      <v-card-title class="modal-header">
        <div class="d-flex align-center">
          <v-avatar color="primary" class="mr-3" size="40">
            <v-icon color="white">mdi-account-star</v-icon>
          </v-avatar>
          <div>
            <h3 class="modal-title">Solicitud de Profesor</h3>
            <p class="modal-subtitle">Completa los datos para enviar tu solicitud</p>
          </div>
        </div>
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          @click="closeModal"
          class="ml-auto"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Content -->
      <v-card-text class="modal-content">
        <!-- Authentication Check -->
        <v-alert 
          v-if="!usuarioLogeadoStore.estaAutenticado" 
          type="warning" 
          variant="tonal" 
          class="mb-4"
          border="start"
        >
          <template v-slot:prepend>
            <v-icon>mdi-alert</v-icon>
          </template>
          <strong>Sesión requerida:</strong> Debes iniciar sesión para poder enviar una solicitud de profesor.
          <template v-slot:append>
            <v-btn 
              color="warning" 
              variant="outlined" 
              size="small"
              @click="redirectToLogin"
            >
              Iniciar Sesión
            </v-btn>
          </template>
        </v-alert>

        <v-form 
          ref="form" 
          v-model="valid" 
          @submit.prevent="submitForm"
          :disabled="!usuarioLogeadoStore.estaAutenticado"
        >
          <!-- Upload Section -->
          <div class="upload-section mb-6">
            <h4 class="section-title mb-3">
              <v-icon class="mr-2" color="primary">mdi-file-upload</v-icon>
              Documentación Certificante
            </h4>
            <p class="section-description mb-4">
              Sube una imagen que certifique tu experiencia o formación como profesor (diploma, certificado, etc.)
            </p>
            
            <div 
              class="upload-area" 
              @click="triggerFileInput" 
              :class="{ 'has-file': selectedFile, 'disabled': !usuarioLogeadoStore.estaAutenticado }"
            >
              <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                @change="handleFileSelect" 
                style="display: none"
                :disabled="!usuarioLogeadoStore.estaAutenticado"
              >
              
              <div v-if="!selectedFile" class="upload-placeholder">
                <v-icon size="48" color="primary" class="mb-2">mdi-cloud-upload</v-icon>
                <p class="upload-text">Haz clic para subir tu certificación</p>
                <p class="upload-hint">PNG, JPG, JPEG hasta 5MB</p>
              </div>
              
              <div v-else class="file-preview">
                <v-img 
                  :src="imagePreview" 
                  class="preview-image"
                  cover
                ></v-img>
                <div class="file-info">
                  <p class="file-name">{{ selectedFile.name }}</p>
                  <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <v-btn 
                  icon="mdi-delete" 
                  variant="text" 
                  color="error" 
                  size="small"
                  @click.stop="removeFile"
                  class="remove-btn"
                ></v-btn>
              </div>
            </div>
            
            <v-alert 
              v-if="fileError" 
              type="error" 
              class="mt-3"
              variant="tonal"
            >
              {{ fileError }}
            </v-alert>
          </div>

          <!-- Text Section -->
          <div class="text-section mb-6">
            <h4 class="section-title mb-3">
              <v-icon class="mr-2" color="primary">mdi-message-text</v-icon>
              Motivación
            </h4>
            <v-textarea
              v-model="motivacion"
              label="¿Por qué quieres ser profesor en nuestra plataforma?"
              placeholder="Cuéntanos sobre tu experiencia, motivaciones y qué puedes aportar como profesor..."
              rows="5"
              variant="outlined"
              :rules="motivacionRules"
              counter="500"
              maxlength="500"
              class="custom-textarea"
              :disabled="!usuarioLogeadoStore.estaAutenticado"
            ></v-textarea>
          </div>

          <!-- Info Alert -->
          <v-alert 
            type="info" 
            variant="tonal" 
            class="mb-4"
            border="start"
          >
            <template v-slot:prepend>
              <v-icon>mdi-information</v-icon>
            </template>
            <strong>Proceso de revisión:</strong> Tu solicitud será revisada por nuestro equipo en un plazo de 3-5 días hábiles. Te notificaremos por email sobre el estado de tu solicitud.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Actions -->
      <v-card-actions class="modal-actions pa-4">
        <v-btn 
          variant="outlined" 
          @click="closeModal"
          :disabled="loading"
        >
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          @click="submitForm"
          :loading="loading"
          :disabled="!canSubmit"
          size="large"
        >
          <v-icon left>mdi-send</v-icon>
          Enviar Solicitud
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePeticionProfesorStore } from '@/stores/PeticionProfesor'
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'

// Props y emits
const props = defineProps<{
  dialog: boolean
}>()

const emit = defineEmits<{
  close: []
  success: []
  loginRequired: []
}>()

// Stores
const peticionStore = usePeticionProfesorStore()
const usuarioLogeadoStore = useUsuarioLogeadoStore()

// Form refs
const form = ref()
const fileInput = ref()
const valid = ref(false)

// Form data
const selectedFile = ref<File | null>(null)
const imagePreview = ref('')
const motivacion = ref('')
const fileError = ref('')
const loading = ref(false)

// Validation rules
const motivacionRules = [
  (v: string) => !!v || 'La motivación es requerida',
  (v: string) => v.length >= 50 || 'Mínimo 50 caracteres',
  (v: string) => v.length <= 500 || 'Máximo 500 caracteres'
]

// Computed
const canSubmit = computed(() => {
  return usuarioLogeadoStore.estaAutenticado && 
         valid.value && 
         selectedFile.value && 
         motivacion.value.length >= 50
})

// Methods
const triggerFileInput = () => {
  if (!usuarioLogeadoStore.estaAutenticado) return
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  if (!usuarioLogeadoStore.estaAutenticado) return
  
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  fileError.value = ''
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    fileError.value = 'Por favor selecciona una imagen válida'
    return
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    fileError.value = 'La imagen no puede ser mayor a 5MB'
    return
  }
  
  selectedFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeFile = () => {
  selectedFile.value = null
  imagePreview.value = ''
  fileError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFile = async (file: File): Promise<string> => {
  // Simular upload - aquí deberías implementar la lógica real de upload
  // Por ejemplo, usando FormData y enviando a tu API de upload
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular URL de respuesta del servidor
      resolve(`https://tu-servidor.com/uploads/${file.name}`)
    }, 1000)
  })
}

const submitForm = async () => {
  // Verificar autenticación antes de proceder
  if (!usuarioLogeadoStore.estaAutenticado) {
    console.error('Usuario no autenticado')
    emit('loginRequired')
    return
  }

  // Verificar que el usuario tenga ID
  if (!usuarioLogeadoStore.usuarioActual?.idUsuario) {
    console.error('Usuario sin ID válido')
    fileError.value = 'Error de autenticación. Por favor, inicia sesión nuevamente.'
    return
  }

  if (!form.value?.validate() || !selectedFile.value) return
  
  loading.value = true
  
  try {
    // Upload file first
    const documentacionUrl = await uploadFile(selectedFile.value)
    
    // Create petition
    const success = await peticionStore.createPeticion({
      documentacionUrl,
      texto: motivacion.value
    })
    
    if (success) {
      emit('success')
      resetForm()
    }
  } catch (error) {
    console.error('Error al enviar solicitud:', error)
    
    // Mostrar error específico al usuario
    if (error instanceof Error) {
      fileError.value = `Error al enviar solicitud: ${error.message}`
    } else {
      fileError.value = 'Error al enviar solicitud. Por favor, inténtalo de nuevo.'
    }
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  if (!loading.value) {
    emit('close')
    resetForm()
  }
}

const resetForm = () => {
  motivacion.value = ''
  removeFile()
  fileError.value = ''
  form.value?.reset()
}

const redirectToLogin = () => {
  emit('loginRequired')
  closeModal()
}

// Watch dialog prop to reset form when modal opens
watch(() => props.dialog, (newVal) => {
  if (newVal) {
    resetForm()
    
    // Verificar autenticación al abrir el modal
    if (!usuarioLogeadoStore.estaAutenticado) {
      console.warn('Modal abierto sin usuario autenticado')
    }
  }
})

// Watch authentication status
watch(() => usuarioLogeadoStore.estaAutenticado, (isAuth) => {
  if (!isAuth && props.dialog) {
    // Si el usuario se desautentica mientras el modal está abierto
    resetForm()
  }
})
</script>

<style lang="scss" scoped>
.modal-solicitud {
  .modal-card {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    
    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    
    .modal-subtitle {
      font-size: 0.875rem;
      opacity: 0.9;
      margin: 0;
    }
  }
  
  .modal-content {
    padding: 2rem;
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
    }
    
    .section-description {
      color: #666;
      font-size: 0.875rem;
      line-height: 1.4;
    }
  }
  
  .upload-section {
    .upload-area {
      border: 2px dashed #ddd;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fafafa;
      
      &:hover:not(.disabled) {
        border-color: #667eea;
        background: #f5f7ff;
      }
      
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f5f5f5;
      }
      
      &.has-file {
        border-color: #4caf50;
        background: #f1f8e9;
        padding: 1rem;
      }
      
      .upload-placeholder {
        .upload-text {
          font-size: 1rem;
          font-weight: 500;
          color: #333;
          margin: 0;
        }
        
        .upload-hint {
          font-size: 0.875rem;
          color: #666;
          margin: 0.5rem 0 0 0;
        }
      }
      
      .file-preview {
        display: flex;
        align-items: center;
        gap: 1rem;
        text-align: left;
        position: relative;
        
        .preview-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          flex-shrink: 0;
        }
        
        .file-info {
          flex: 1;
          
          .file-name {
            font-weight: 500;
            color: #333;
            margin: 0;
            word-break: break-word;
          }
          
          .file-size {
            font-size: 0.875rem;
            color: #666;
            margin: 0.25rem 0 0 0;
          }
        }
        
        .remove-btn {
          position: absolute;
          top: -8px;
          right: -8px;
        }
      }
    }
  }
  
  .text-section {
    .custom-textarea {
      :deep(.v-field) {
        border-radius: 12px;
      }
    }
  }
  
  .modal-actions {
    background: #f8f9fa;
  }
}

// Responsive adjustments
@media (max-width: 600px) {
  .modal-solicitud {
    .modal-content {
      padding: 1rem;
    }
    
    .upload-section {
      .upload-area {
        padding: 1.5rem 1rem;
      }
    }
  }
}
</style>