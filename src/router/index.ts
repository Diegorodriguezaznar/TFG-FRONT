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
import PeticionProfesorPage from '../views/PeticionProfesorPage.vue';

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/cursos", component: HomePage },
  { path: "/peticion-profesor", component: PeticionProfesorPage },
  
  // NUEVA: Ruta con idCurso siguiendo tu patrón
  {
    path: "/subir-video/:idCurso",
    component: SubirVideos,
    props: true,
    meta: { requiresAuth: true, allowRoles: [1,2, 3] }
  },
  
  // OPCIONAL: Ruta antigua redirige a cursos
  {
    path: "/subir-video",
    redirect: "/cursos"
  },
  
  {
    path: "/crear-curso",
    component: () => import("@/views/CrearCurso.vue"),
    meta: { requiresAuth: true, allowRoles: [1,2, 3] }
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

// Limpiar consola al cambiar de ruta
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

  if (!to.meta.requiresAuth) {
    next(); // Ruta pública
    return;
  }

  if (!usuarioLogeadoStore.estaAutenticado) {
    next("/login"); // Ruta privada pero no logueado
    return;
  }

  if (to.meta.allowRoles && !to.meta.allowRoles.includes(idRol)) {
    next("/cursos"); // No tiene permiso por rol
    return;
  }

  if (to.meta.requiresAdmin && idRol == 3) {
    next("/cursos"); // No es admin
    return;
  }

  next(); // Todo bien
});

export default router;