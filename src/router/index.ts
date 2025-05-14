import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/CursosPage.vue';
import AsignaturasPage from '../views/AsignaturasPage.vue';
import Historial from '@/views/Historial.vue';
import CursosPage from '../views/CursosPage.vue';
import PerfilPage from '../views/PerfilPage.vue';
import ReproductorVideo from '@/views/ReproductorVideo.vue';
import Quizzes from '../views/Quizzes.vue';
import QuizDetalle from '../views/QuizDetalle.vue';
import Videos from '@/views/Home.vue';
import Login from '../views/LoginView.vue';
import Registro from '../views/RegistroView.vue';
import AdminPage from '../views/AdminPage.vue';

import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

const routes = [
  { path: '/', component: HomePage },
  { path: '/curso/:id', component: Videos, props: true },
  { path: '/reproductor-video', component: ReproductorVideo },
  { path: '/historial', component: Historial },
  { path: '/asignaturas/:idCurso', component: AsignaturasPage, props: true },
  { path: '/cursos', component: CursosPage },
  { path: '/perfil', component: PerfilPage },
  { path: '/quizz-time!', component: Quizzes },
  { path: '/quizz-detail', component: QuizDetalle },
  { path: '/quizz-detail/:id', component: QuizDetalle, props: true },
  { 
    path: '/admin', 
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/login', component: Login },
  { path: '/registro', component: Registro },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/registro'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  if (to.meta.requiresAuth) {
    const usuarioLogeadoStore = useUsuarioLogeadoStore();

    if (!usuarioLogeadoStore.estaAutenticado) {
      return next('/login');
    }

    if (to.meta.requiresAdmin) {
      const usuario = usuarioLogeadoStore.usuarioActual;
      if (!usuario) {
        return next('/login');
      }
      const idRol = usuario.idRol || (usuario.rol && usuario.rol.idRol) || (usuario.rol && usuario.rol.id);
      if (idRol !== 1) {
        return next('/cursos');
      }
    }
  }

  next();
});

export default router;
