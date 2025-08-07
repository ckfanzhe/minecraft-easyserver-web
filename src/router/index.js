import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import ServerConfig from '../views/ServerConfig.vue';
import PlayerManagement from '../views/PlayerManagement.vue';
import PermissionManagement from '../views/PermissionManagement.vue';
import WorldManagement from '../views/WorldManagement.vue';
import ResourcePackManagement from '../views/ResourcePackManagement.vue';
import ServerVersions from '../views/ServerVersions.vue';
import CommandConsole from '../views/CommandConsole.vue';
import LogViewer from '../views/LogViewer.vue';
import PerformanceMonitor from '../views/PerformanceMonitor.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/config',
    name: 'ServerConfig',
    component: ServerConfig,
    meta: { requiresAuth: true }
  },
  {
    path: '/players',
    name: 'PlayerManagement',
    component: PlayerManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/permissions',
    name: 'PermissionManagement',
    component: PermissionManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/worlds',
    name: 'WorldManagement',
    component: WorldManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/resource-packs',
    name: 'ResourcePackManagement',
    component: ResourcePackManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/versions',
    name: 'ServerVersions',
    component: ServerVersions,
    meta: { requiresAuth: true }
  },
  {
    path: '/commands',
    name: 'CommandConsole',
    component: CommandConsole,
    meta: { requiresAuth: true }
  },
  {
    path: '/logs',
    name: 'LogViewer',
    component: LogViewer,
    meta: { requiresAuth: true }
  },
  {
    path: '/performance',
    name: 'PerformanceMonitor',
    component: PerformanceMonitor,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false);
  
  if (requiresAuth && !token) {
    // Redirect to login if authentication is required but no token exists
    next('/login');
  } else if (to.path === '/login' && token) {
    // Redirect to home if already logged in and trying to access login
    next('/');
  } else {
    next();
  }
});

export default router;