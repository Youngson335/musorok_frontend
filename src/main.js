import { createApp } from "vue";
import "./style.css";
import router from "./router";
import { courierRouter } from "./router";
import App from "./App.vue";
import tg from "./telegram.js";
import store from "./store.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import RegisteredPage from "./pages/RegisteredPage.vue";

const id = store.state.userId;
let registerUser;
let clientFlg;

async function getInfoRegistered() {
  const response = await fetch(`https://musorok.online:8000/client_info/${id}`);
  const data = await response.json();
  return data;
}

async function initializeApp() {
  const info = getInfoRegistered(); // Запрос информации о пользователе

  const appPromise = (async () => {
    const app = createApp(App);
    app.use(ElementPlus);
    app.use(L);
    app.use(store);
    app.config.globalProperties.$tg = tg;
    return app;
  })();

  const data = await info;
  registerUser = data.registered;
  clientFlg = data.client_flg;

  if (registerUser === 0 || !registerUser) {
    const app = createApp(RegisteredPage);
    app.use(L);
    app.use(ElementPlus);
    app.use(store);
    app.config.globalProperties.$tg = tg;
    app.mount("#notUser");
  } else {
    const app = await appPromise;
    if (clientFlg === 0) {
      app.use(courierRouter);
    } else {
      app.use(router);
    }
    app.mount("#app");
  }
}

initializeApp();
