<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Sección principal -->
      <div class="footer__content">
        <!-- Logo y descripción -->
        <div class="footer__brand">
          <h3 class="footer__brand-title">AcademIQ</h3>
          <p class="footer__brand-description">
            La plataforma que no querias, pero necesitabas.
          </p>
        </div>

        <!-- Enlaces rápidos -->
        <div class="footer__links">
          <div class="footer__links-column">
            <h4 class="footer__links-title">Redes Sociales</h4>
            <ul class="footer__links-list">
              <li><a href="https://www.instagram.com/" class="footer__links-item">Instagram</a></li>
              <li><a href="https://x.com/?lang=es" class="footer__links-item">Twitter</a></li>
              <li><a href="https://www.linkedin.com/feed/" class="footer__links-item">Linkedin</a></li>
              <li><a href="https://www.facebook.com/?locale=es_ES" class="footer__links-item">FaceBook</a></li>
            </ul>
          </div>

          <div class="footer__links-column">
            <h4 class="footer__links-title">Descubre</h4>
            <ul class="footer__links-list">
          <p class="footer__brand-description">
            Un monton de contenido informativo academico en base a videos y quizes, te esperamos.
          </p>
            </ul>
          </div>
        </div>

        <!-- Logo SVG -->
        <div class="footer__logo">
          <AcademIQFooter class="footer__logo-svg" />
        </div>
      </div>

      <!-- Línea divisoria -->
      <div class="footer__divider"></div>

      <!-- Pie del footer -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          &copy; 2025 Plataforma de Aprendizaje. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/Footer";
</style>

<script>
import AcademIQFooter from '@/components/Common/AcademIQFooter.vue'

export default {
  name: 'Footer',
  components: {
    AcademIQFooter
  }
}
</script>