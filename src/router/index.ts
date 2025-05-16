import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "@/views/HomePage.vue";
import Historial from "@/views/Historial.vue";
import PerfilPage from "../views/PerfilPage.vue";
import HomePage from "../views/CursosPage.vue";
import ReproductorVideo from "@/views/ReproductorVideo.vue";
import Quizzes from "../views/Quizzes.vue";
import QuizDetalle from "../views/QuizDetalle.vue";
import Videos from "@/views/Home.vue";
import SubirVideos from "../views/SubirVideoPage.vue";

//ADMIN
import AdminPage from "../views/AdminPage.vue";



import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
 
const routes = [
  { path: "/", component: HomePage },
  { path: "/subir-video", component: SubirVideos },
  { path: "/curso/:id", component: Videos, props: true },
  { path: "/reproductor-video", component: ReproductorVideo },
  { path: "/historial", component: Historial }, 
  { path: "/perfil", component: PerfilPage },
  { path: "/quizz-time!", component: Quizzes},
  // Mantenemos la ruta actual para no romper nada
  { path: "/quizz-detail", component: QuizDetalle},
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