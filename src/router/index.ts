// src/router/index.ts - Rutas actualizadas para quizzes
import { createRouter, createWebHistory } from "vue-router";
import Historial from "@/views/Historial.vue";
import PerfilPage from "../views/PerfilPage.vue";
import HomePage from "../views/CursosPage.vue";
import ReproductorVideo from "@/views/ReproductorVideo.vue";
import Quizzes from "../views/Quizzes.vue";
import QuizDetalle from "../views/QuizDetalle.vue";
import Videos from "@/views/Home.vue";
import SubirVideos from "../views/SubirVideoPage.vue";
import UsuariosPage from "../views/UsuariosPage.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";

// NUEVAS PÁGINAS DE QUIZZES
import MisQuizzesPage from "../views/MisQuizzesPage.vue";
import HacerQuizzesPage from "../views/HacerQuizzesPage.vue";

//ADMIN
import AdminPage from "../views/AdminPage.vue";

import Login from '../views/Login.vue';

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const routes = [
  { path: "/", component: Login },
  { path: '/login', component: Login },
  { path: "/cursos", component: HomePage },
  { path: "/subir-video", component: SubirVideos, meta: { requiresAuth: true } },
  { path: "/curso/:id", component: Videos, props: true, meta: { requiresAuth: true } },
  { path: "/reproductor-video", component: ReproductorVideo, meta: { requiresAuth: true } },
  { path: "/historial", component: Historial, meta: { requiresAuth: true } },
  { path: "/perfil", component: PerfilPage, meta: { requiresAuth: true } },
  
  // RUTAS DE QUIZZES ACTUALIZADAS
  { path: "/quizz-time!", component: HacerQuizzesPage, meta: { requiresAuth: true } }, // Zona pública
  
  { path: "/usuarios", component: UsuariosPage, meta: { requiresAuth: true } },
  { path: "/usuario/:id", component: PerfilUsuario, props: true, meta: { requiresAuth: true } },
  { path: "/quizz-detail", component: QuizDetalle, meta: { requiresAuth: true } },
  { path: "/quizz-detail/:id", component: QuizDetalle, props: true},

  {
    path: "/admin",
    component: AdminPage,
    // meta: { requiresAuth: true, requiresAdmin: true },
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

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  
  if (!usuarioLogeadoStore.estaAutenticado) {
    next("/login");
    return;
  }
  
  if (to.meta.requiresAdmin) {
    const usuario = usuarioLogeadoStore.usuarioActual;
    
    if (!usuario) {
      next("/login");
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