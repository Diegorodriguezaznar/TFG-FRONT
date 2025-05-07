import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "@/views/HomePage.vue";
import AsignaturasPage from "@/views/AsignaturasPage.vue";
import TemariosPage from "@/views/TemariosPage.vue";
import CursosPage from "@/views/CursosPage.vue";
import PerfilPage from "@/views/PerfilPage.vue";
import MisCursosPage from "@/views/MisCursosPage.vue";
import MisArchivosPage from "@/views/MisArchivosPage.vue";
import ArchivosyTestPage from "@/views/ArchivosyTestPage.vue";
import HomePage from "@/views/Home.vue";
import AdminPage from "@/views/AdminPage.vue";
import Quizzes from "@/views/Quizzes.vue";
import QuizDetalle from "@/views/QuizDetalle.vue";

// Importar store de usuario para proteger rutas
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const routes = [
  { path: "/", component: QuizDetalle },
  { path: "/asignaturas/:idCurso", component: AsignaturasPage, props: true },
  { path: "/temarios/:idAsignatura", component: TemariosPage, props: true },
  { path: "/temarios/:idTemario/archivos-test", component: ArchivosyTestPage, props: true },
  { path: "/cursos", component: CursosPage },
  { path: "/perfil", component: PerfilPage },
  { path: "/mis-cursos", component: MisCursosPage },
  { path: "/mis-archivos", component: MisArchivosPage },
  { path: "/quizz-time!", component: Quizzes},
  { path: "/quizz-detail", component: QuizDetalle},
  { 
    path: "/admin", component: AdminPage,
    //nos aseguramos de que solo los usuarios admin puedan 
    // entrar filtrando por su id rol
    meta: { requiresAuth: true, requiresAdmin: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  
  if (!usuarioLogeadoStore.estaAutenticado) {
    next("/"); 
    return;
  }
  
  if (to.meta.requiresAdmin) {
    const usuario = usuarioLogeadoStore.usuarioActual;
    
    if (!usuario) {
      next("/");
      return;
    }
    
    const idRol = usuario.idRol || 
                (usuario.rol && usuario.rol.idRol) || 
                (usuario.rol && usuario.rol.id);
    
    if (idRol !== 1) {
      next("/cursos"); 
      return;
    }
  }
  
  next();
});

export default router;