import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

import CaseForm from './components/CaseForm.vue';
import CaseDetailView from './views/CaseDetailView.vue';
import CasesListView from './views/CasesListView.vue';
import OfficerDashboardView from './views/OfficerDashboardView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: CaseForm },
    { path: '/cases', component: CasesListView },
    { path: '/cases/:id', component: CaseDetailView },
    { path: '/officer', component: OfficerDashboardView },
  ],
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');

