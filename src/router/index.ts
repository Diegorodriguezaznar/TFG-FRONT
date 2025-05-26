// src/router/index.ts - ARCHIVO COMPLETO PARA COPIAR
import { createRouter, createWebHistory } from "vue-router";
import Historial from "@/views/Historial.vue";
import PerfilPage from "../views/PerfilPage.vue";
import HomePage from "../views/CursosPage.vue";
import ReproductorVideo from "@/views/ReproductorVideo.vue";
import Videos from "@/views/Home.vue";
import SubirVideos from "../views/SubirVideoPage.vue";
import UsuariosPage from "../views/UsuariosPage.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import Login from '../views/Login.vue';
import AdminPage from "@/views/AdminPage.vue";
import VideosFavoritos from '../views/FavoritosPage.vue'


// === PÁGINAS DE QUIZZES NUEVAS ===
import HacerQuizzesPage from "../views/HacerQuizzesPage.vue";
import RealizarQuizPage from "../views/RealizarQuizPage.vue";
import ResultadoQuizPage from "../views/ResultadoQuizPage.vue";
import CrearQuizPage from "../views/CrearQuizPage.vue";

// PÁGINAS LEGACY (mantener por compatibilidad)
import Quizzes from "../views/Quizzes.vue";
import QuizDetalle from "../views/QuizDetalle.vue";

// ADMIN
import PeticionProfesorPage from '../views/PeticionProfesorPage.vue';
import CrearAsignaturas from '../views/CrearAsignaturas.vue';

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const routes = [
  // === AUTENTICACIÓN ===
  { path: "/", component: Login },
  { path: '/login', component: Login },
  
  // === PÁGINAS PRINCIPALES ===
  { path: "/cursos", component: HomePage },
  { path: "/curso/:id", component: Videos, props: true, meta: { requiresAuth: true } },
  { path: "/subir-video", component: SubirVideos, meta: { requiresAuth: true } },
  { path: "/reproductor-video", component: ReproductorVideo, meta: { requiresAuth: true } },
  { path: "/historial", component: Historial, meta: { requiresAuth: true } },
  { path: "/perfil", component: PerfilPage, meta: { requiresAuth: true } },
  { path: "/usuarios", component: UsuariosPage, meta: { requiresAuth: true } },
  { path: "/usuario/:id", component: PerfilUsuario, props: true, meta: { requiresAuth: true } },
  
  // === SISTEMA DE QUIZZES COMPLETO ===
  { 
    path: "/quizz-time!", 
    component: HacerQuizzesPage, 
    meta: { requiresAuth: true },
    name: 'quizzes-main'
  },
  { 
    path: "/quiz/:id", 
    component: RealizarQuizPage, 
    props: true, 
    meta: { requiresAuth: true },
    name: 'realizar-quiz'
  },
  { 
    path: "/quiz/:id/resultado", 
    component: ResultadoQuizPage, 
    props: true, 
    meta: { requiresAuth: true },
    name: 'resultado-quiz'
  },
  { 
    path: "/admin/crear-quiz", 
    component: CrearQuizPage, 
    meta: { requiresAuth: true, requiresQuizCreator: true },
    name: 'crear-quiz'
  },
  
  // === RUTAS LEGACY (mantener por compatibilidad) ===
  { path: "/quizz-detail", component: QuizDetalle, meta: { requiresAuth: true } },
  { path: "/quizz-detail/:id", component: QuizDetalle, props: true, meta: { requiresAuth: true } },

  // === PANEL DE ADMINISTRACIÓN ===

  { path: "/login", component: Login },
  { path: "/cursos", component: HomePage },
  { path: "/peticion-profesor", component: PeticionProfesorPage },
  { path: "/curso/:idCurso/asignaturas", component: CrearAsignaturas },
  {
    path: "/subir-video/:idCurso",
    component: SubirVideos,
    props: true,
    meta: { requiresAuth: true, allowRoles: [2, 3] }
  },
    {
    path: "/subir-video",
    redirect: "/cursos"
  },
  {
    path: '/ia',
    name: 'ChatIA',
    component: () => import('@/views/ChatIA.vue') 
  },

  
  {
    path: "/crear-curso",
    component: () => import("@/views/CrearCurso.vue"),
    meta: { requiresAuth: true, allowRoles: [2, 3] }
  },
  {
    path: "/curso/:id",
    component: Videos,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: "/reproductor-video",
    component: ReproductorVideo,
    meta: { requiresAuth: true }
  },
  {
    path: "/historial",
    component: Historial,
    meta: { requiresAuth: true }
  },
  {
    path: "/perfil",
    component: PerfilPage,
    meta: { requiresAuth: true }
  },
  {
    path: "/quizz-time!",
    component: Quizzes,
    meta: { requiresAuth: true }
  },
  {
    path: "/quizz-detail",
    component: QuizDetalle,
    meta: { requiresAuth: true }
  },
  {
    path: "/quizz-detail/:id",
    component: QuizDetalle,
    props: true
  },
  {
    path: '/favoritos',
    component: VideosFavoritos,
    name: 'VideosFavoritos', 
  },
  {
    path: '/ranking',
    name: 'RankingAportaciones',
    component: () => import('@/views/RankingAportaciones.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },

  {
    path: "/admin",
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: "/admin/usuarios"
      },
      {
        path: "usuarios",
        component: () => import("@/components/Private/PrivateUsuarios/AdminUsuarios.vue"),
        meta: { requiresAdmin: true }
      },
      {
        path: "cursos",
        component: () => import("@/components/Private/PrivateCursos/AdminCursos.vue"),
        meta: { requiresAdmin: true }
      },
      {
        path: "reportes",
        component: () => import("@/components/Private/PrivateVideosR/AdminVideosReportados.vue"),
        meta: { requiresAdmin: true }
      },
      {
        path: "peticiones-profesor",
        component: () => import("@/components/Private/PrivatePeticionProfesor/AdminPeticionesProfesor.vue"),
        meta: { requiresAdmin: true }
      },
      {
        path: "estadisticas",
        component: () => import("@/components/Private/PrivateEstadisticas/AdminEstadisticas.vue"),
        meta: { requiresAdmin: true }
      },
      {
        path: "comentarios-reportados",
        component: () => import("@/components/Private/PrivateComentariosR/AdminComentariosReportados.vue"),
        meta: { requiresAdmin: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});



router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    console.clear();
    console.log(`%c Estas en: ${to.path}`, 'color: #42b883; font-weight: bold;');
  }
  next();
});

// Protección por autenticación y roles
router.beforeEach((to, from, next) => {
  console.clear();
  console.log(`%c Estas en: ${to.path}`, 'color: #42b883; font-weight: bold;');

  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  const usuario = usuarioLogeadoStore.usuarioActual;
  const idRol = usuario?.idRol || usuario?.rol?.idRol || usuario?.rol?.id;

  // Ruta pública
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  // No autenticado
  if (!usuarioLogeadoStore.estaAutenticado || !usuario) {
    next("/login");
    return;
  }

  // Requiere admin
  if (to.meta.requiresAdmin && idRol !== 1) {
    alert("No tienes permisos de administrador");
    next("/peticion-profesor");
    return;
  }

  // Requiere creador de quizzes (roles 2 y 3)
  if (to.meta.requiresQuizCreator && !(idRol === 2 || idRol === 3)) {
    alert("No tienes permisos para crear quizzes. Solo profesores y gestores pueden crear quizzes.");
    next("/quizz-time!");
    return;
  }

  // Permisos por rol específico
  if (to.meta.allowRoles && !to.meta.allowRoles.includes(idRol)) {
    next("/peticion-profesor");
    return;
  }

  next();
});

export default router;