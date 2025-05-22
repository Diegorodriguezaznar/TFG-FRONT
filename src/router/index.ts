
// src/router/index.ts - Sección actualizada
import { createRouter, createWebHistory } from "vue-router";
import Historial from "@/views/Historial.vue";
import PerfilPage from "../views/PerfilPage.vue";
import HomePage from "../views/CursosPage.vue";
import ReproductorVideo from "@/views/ReproductorVideo.vue";
import Quizzes from "../views/Quizzes.vue";
import QuizDetalle from "../views/QuizDetalle.vue";
import Videos from "@/views/Home.vue";
import SubirVideos from "../views/SubirVideoPage.vue";
import UsuariosPage from "../views/UsuariosPage.vue"; // Nueva importación

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
  { path: "/quizz-time!", component: Quizzes, meta: { requiresAuth: true } },
  // Nueva ruta para usuarios
  { path: "/usuarios", component: UsuariosPage, meta: { requiresAuth: true } },
  // Mantenemos la ruta actual para no romper nada
  { path: "/quizz-detail", component: QuizDetalle, meta: { requiresAuth: true } },
  // Agregamos una ruta opcional con ID en los parámetros (para futura implementación)
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