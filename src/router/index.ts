import { createRouter, createWebHistory } from "vue-router";
import Historial from "@/views/Historial.vue";
import PerfilPage from "../views/PerfilPage.vue";
import HomePage from "../views/CursosPage.vue";
import ReproductorVideo from "@/views/ReproductorVideo.vue";
import Quizzes from "../views/Quizzes.vue";
import QuizDetalle from "../views/QuizDetalle.vue";
import Videos from "@/views/Home.vue";
import SubirVideos from "../views/SubirVideoPage.vue";
import AdminPage from "../views/AdminPage.vue";
import Login from '../views/Login.vue';

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/cursos", component: HomePage },
  {
    path: "/subir-video",
    component: SubirVideos,
    meta: { requiresAuth: true, allowRoles: [2, 3] }
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
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

//  Limpiar consola al cambiar de ruta
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    console.clear();
    console.log(`%c Estas en: ${to.path}`, 'color: #42b883; font-weight: bold;');
  }
  next();
});

// Protección por autenticación y roles
router.beforeEach((to, from, next) => {
  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  const usuario = usuarioLogeadoStore.usuarioActual;
  const idRol = usuario?.idRol;

  // Rutas públicas
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  // Requiere autenticación
  if (!usuarioLogeadoStore.estaAutenticado) {
    next("/login");
    return;
  }

  // Requiere rol específico (por ejemplo, [2, 3])
  if (to.meta.allowRoles && !to.meta.allowRoles.includes(idRol)) {
    next("/cursos");
    return;
  }

  // Requiere ser admin
  if (to.meta.requiresAdmin && idRol == 3) {
    next("/cursos");
    return;
  }

  next();
});

export default router;
