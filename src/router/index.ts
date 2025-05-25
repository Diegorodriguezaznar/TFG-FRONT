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

// === PÁGINAS DE QUIZZES NUEVAS ===
import HacerQuizzesPage from "../views/HacerQuizzesPage.vue";
import RealizarQuizPage from "../views/RealizarQuizPage.vue";
import ResultadoQuizPage from "../views/ResultadoQuizPage.vue";
import CrearQuizPage from "../views/CrearQuizPage.vue";

// PÁGINAS LEGACY (mantener por compatibilidad)
import Quizzes from "../views/Quizzes.vue";
import QuizDetalle from "../views/QuizDetalle.vue";

// ADMIN
import AdminPage from "../views/AdminPage.vue";

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
        component: () => import("@/components/Private/AdminUsuarios.vue")
      },
      {
        path: "cursos",
        component: () => import("@/components/Private/AdminCursos.vue")
      },
      {
        path: "reportes",
        component: () => import("@/components/Private/AdminVideosReportados.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// === GUARDS DE NAVEGACIÓN ===
router.beforeEach((to, from, next) => {
  // Si la ruta no requiere autenticación, permitir acceso
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  
  // Verificar si el usuario está autenticado
  if (!usuarioLogeadoStore.estaAutenticado) {
    next("/login");
    return;
  }
  
  const usuario = usuarioLogeadoStore.usuarioActual;
  
  if (!usuario) {
    next("/login");
    return;
  }
  
  // === VERIFICAR PERMISOS DE ADMINISTRADOR ===
  if (to.meta.requiresAdmin) {
    const idRol = usuario.idRol || 
                (usuario.rol && usuario.rol.idRol) || 
                (usuario.rol && usuario.rol.id);
    
    if (idRol !== 1) {
      alert('No tienes permisos de administrador');
      next("/cursos");
      return;
    }
  }
  
  // === VERIFICAR PERMISOS PARA CREAR QUIZZES (ROLES 2 Y 3) ===
  if (to.meta.requiresQuizCreator) {
    const idRol = usuario.idRol || 
                (usuario.rol && usuario.rol.idRol) || 
                (usuario.rol && usuario.rol.id);
    
    if (idRol !== 2 && idRol !== 3) {
      alert('No tienes permisos para crear quizzes. Solo profesores y gestores pueden crear quizzes.');
      next("/quizz-time!");
      return;
    }
  }
  
  // Si todas las verificaciones pasan, permitir acceso
  next();
});

export default router;