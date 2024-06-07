import { createRouter, createWebHistory } from "vue-router";

const PrivateOffice = () => import("/src/pages/PrivateOfficePage.vue");
const Delivery = () => import("/src/pages/DeliveryPage.vue");
const Settings = () => import("/src/pages/SettingsPage.vue");
const CourierCalendar = () => import("/src/pages/CourierCalendarPage.vue");
const MapsPage = () => import("/src/pages/MapsPage.vue");
const ActivityPage = () => import("/src/pages/ActivityPage.vue");
const MorePage = () => import("/src/pages/MorePage.vue");

const routes = [
  {
    path: "/",
    component: PrivateOffice,
  },
  {
    path: "/delivery",
    component: Delivery,
  },
  {
    path: "/settings",
    component: Settings,
  },
];

const courierRoutes = [
  {
    path: "/courier/calendar",
    component: CourierCalendar,
  },
  {
    path: "/maps",
    component: MapsPage,
  },
  {
    path: "/",
    component: ActivityPage,
  },
  {
    path: "/more",
    component: MorePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const courierRouter = createRouter({
  history: createWebHistory(),
  routes: courierRoutes,
});

export { courierRouter };
export default router;
