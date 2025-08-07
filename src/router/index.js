import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
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
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/config',
    name: 'ServerConfig',
    component: ServerConfig
  },
  {
    path: '/players',
    name: 'PlayerManagement',
    component: PlayerManagement
  },
  {
    path: '/permissions',
    name: 'PermissionManagement',
    component: PermissionManagement
  },
  {
    path: '/worlds',
    name: 'WorldManagement',
    component: WorldManagement
  },
  {
    path: '/resource-packs',
    name: 'ResourcePackManagement',
    component: ResourcePackManagement
  },
  {
    path: '/versions',
    name: 'ServerVersions',
    component: ServerVersions
  },
  {
    path: '/commands',
    name: 'CommandConsole',
    component: CommandConsole
  },
  {
    path: '/logs',
    name: 'LogViewer',
    component: LogViewer
  },
  {
    path: '/performance',
    name: 'PerformanceMonitor',
    component: PerformanceMonitor
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;