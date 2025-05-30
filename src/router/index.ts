// src/router/index.ts - ARCHIVO COMPLETO ACTUALIZADO
import { createRouter, createWebHistory } from "vue-router";
import PerfilPage from "../views/PerfilPage.vue";
import HomePage from "../views/HomePage.vue"; // NUEVA PÁGINA PRINCIPAL
import CursosPage from "../views/CursosPage.vue"; // RENOMBRADA
import ExplorarPage from "../views/ExplorarPage.vue"; // 🆕 NUEVA PÁGINA DE EXPLORACIÓN
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

// ADMIN Y OTRAS PÁGINAS
import PeticionProfesorPage from '../views/PeticionProfesorPage.vue';
import CrearAsignaturas from '../views/CrearAsignaturas.vue';
import MisCursosPage from '../views/MisCursosPage.vue';

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const routes = [
  // === AUTENTICACIÓN ===
  { 
    path: "/", 
    component: Login,
    name: 'login-root'
  },
  { 
    path: '/login', 
    component: Login,
    name: 'login'
  },
  
  // === NUEVA PÁGINA PRINCIPAL DESPUÉS DEL LOGIN ===
  { 
    path: "/home", 
    component: HomePage, 
    meta: { requiresAuth: true },
    name: 'home'
  },
  
  // === PÁGINAS PRINCIPALES ===
  { 
    path: "/cursos", 
    component: CursosPage,
    meta: { requiresAuth: true },
    name: 'cursos'
  },
  
  // === 🆕 NUEVA PÁGINA DE EXPLORACIÓN DE VIDEOS ===
  { 
    path: "/explorar", 
    component: ExplorarPage, 
    meta: { requiresAuth: true },
    name: 'explorar'
  },
  
  // === PÁGINAS DE CURSOS Y VIDEOS ===
  { 
    path: "/curso/:id", 
    component: Videos, 
    props: true, 
    meta: { requiresAuth: true },
    name: 'curso-detalle'
  },
  { 
    path: "/subir-video", 
    component: SubirVideos, 
    meta: { requiresAuth: true },
    name: 'subir-video'
  },
  { 
    path: "/subir-video/:idCurso",
    component: SubirVideos,
    props: true,
    meta: { requiresAuth: true, allowRoles: [2, 3] },
    name: 'subir-video-curso'
  },
  { 
    path: "/reproductor-video", 
    component: ReproductorVideo, 
    meta: { requiresAuth: true },
    name: 'reproductor-video'
  },
  
  // === PÁGINAS DE USUARIOS ===
  { 
    path: "/perfil", 
    component: PerfilPage, 
    meta: { requiresAuth: true },
    name: 'perfil'
  },
  { 
    path: "/usuarios", 
    component: UsuariosPage, 
    meta: { requiresAuth: true },
    name: 'usuarios'
  },
  { 
    path: "/usuario/:id", 
    component: PerfilUsuario, 
    props: true, 
    meta: { requiresAuth: true },
    name: 'perfil-usuario'
  },
  
  // === MIS CURSOS ===
  { 
    path: "/mis-cursos", 
    component: MisCursosPage, 
    meta: { requiresAuth: true },
    name: 'mis-cursos'
  },
  
  // === FAVORITOS ===
  {
    path: '/favoritos',
    component: VideosFavoritos,
    meta: { requiresAuth: true },
    name: 'favoritos'
  },
  
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
  
  // === RUTAS LEGACY DE QUIZZES (mantener por compatibilidad) ===
  { 
    path: "/quizz-detail", 
    component: QuizDetalle, 
    meta: { requiresAuth: true },
    name: 'quiz-detalle-legacy'
  },
  { 
    path: "/quizz-detail/:id", 
    component: QuizDetalle, 
    props: true, 
    meta: { requiresAuth: true },
    name: 'quiz-detalle-legacy-id'
  },

  // === PÁGINAS ESPECIALES ===
  {
    path: "/peticion-profesor",
    component: PeticionProfesorPage,
    meta: { requiresAuth: true, allowRoles: [1] },
    name: 'peticion-profesor'
  },
  { 
    path: "/curso/:idCurso/asignaturas", 
    component: CrearAsignaturas,
    props: true,
    meta: { requiresAuth: true, allowRoles: [2, 3] },
    name: 'crear-asignaturas'
  },
  {
    path: '/ia',
    name: 'ChatIA',
    component: () => import('@/views/ChatIA.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/crear-curso",
    component: () => import("@/views/CrearCurso.vue"),
    meta: { requiresAuth: true, allowRoles: [2, 3] },
    name: 'crear-curso'
  },
  {
    path: '/ranking',
    name: 'RankingAportaciones',
    component: () => import('@/views/RankingAportaciones.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  },
  
  // === PANEL DE ADMINISTRACIÓN ===
  {
    path: "/admin",
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
    name: 'admin',
    children: [
      {
        path: "",
        redirect: "/admin/usuarios"
      },
      {
        path: "usuarios",
        component: () => import("@/components/Private/PrivateUsuarios/AdminUsuarios.vue"),
        meta: { requiresAdmin: true },
        name: 'admin-usuarios'
      },
      {
        path: "cursos",
        component: () => import("@/components/Private/PrivateCursos/AdminCursos.vue"),
        meta: { requiresAdmin: true },
        name: 'admin-cursos'
      },
      {
        path: "reportes",
        component: () => import("@/components/Private/PrivateVideosR/AdminVideosReportados.vue"),
        meta: { requiresAdmin: true },
        name: 'admin-reportes'
      },
      {
        path: "peticiones-profesor",
        component: () => import("@/components/Private/PrivatePeticionProfesor/AdminPeticionesProfesor.vue"),
        meta: { requiresAdmin: true },
        name: 'admin-peticiones'
      },
      {
        path: "estadisticas",
        component: () => import("@/components/Private/PrivateEstadisticas/AdminEstadisticas.vue"),
        meta: { requiresAdmin: true },
        name: 'admin-estadisticas'
      },
      {
        path: "comentarios-reportados",
        component: () => import("@/components/Private/PrivateComentariosR/AdminComentariosReportados.vue"),
        meta: { requiresAdmin: true },
        name: 'admin-comentarios'
      }
    ]
  },
  
  // === REDIRECCIONES ===
  {
    path: "/subir-video",
    redirect: "/cursos",
    name: 'subir-video-redirect'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    console.clear();
    console.log(`%c 🚀 Navegando a: ${to.path}`, 'color: #F44336; font-weight: bold; font-size: 14px;');
  }
  next();
});

// Protección por autenticación y roles
router.beforeEach((to, from, next) => {
  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  const usuario = usuarioLogeadoStore.usuarioActual;
  const idRol = usuario?.idRol || usuario?.rol?.idRol || usuario?.rol?.id;

  // 🟢 Ruta pública - permitir acceso
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  // 🔴 No autenticado - redirigir al login  
  if (!usuarioLogeadoStore.estaAutenticado || !usuario) {
    console.log('❌ Usuario no autenticado, redirigiendo a login');
    next("/login");
    return;
  }

  // 🔴 Requiere admin (rol 3)
  if (to.meta.requiresAdmin && idRol !== 3) {
    console.log('❌ Acceso denegado: requiere permisos de administrador');
    alert("❌ No tienes permisos de administrador");
    next("/home");
    return;
  }

  // 🔴 Requiere creador de quizzes (roles 2 y 3)
  if (to.meta.requiresQuizCreator && !(idRol === 2 || idRol === 3)) {
    console.log('❌ Acceso denegado: requiere permisos para crear quizzes');
    alert("❌ No tienes permisos para crear quizzes. Solo profesores y administradores pueden crear quizzes.");
    next("/quizz-time!");
    return;
  }

  // 🔴 Permisos por rol específico
  if (to.meta.allowRoles && !to.meta.allowRoles.includes(idRol)) {
    console.log('❌ Acceso denegado: rol no permitido para esta ruta');
    next("/peticion-profesor");
    return;
  }

  console.log(` Acceso permitido a ${to.path} (Rol: ${idRol})`);
  next();
});

router.onError((error) => {
  console.error('❌ Error de navegación:', error);
});

export default router;