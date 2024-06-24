import { createStore } from "vuex";
import tg from "./telegram.js";

const store = createStore({
  state() {
    return {
      count: 0,
      userName: "",
      userLastName: "",
      userId: 370078330,
      userTgName: "young_son335",
      user: null,
      ivanID: 370078330,
      myId: 1491570929,
      registerdID: 568831746,
      subscribeDay: null,
      subscribeEnd_dttm: null,
      subscribeStart_dttm: null,
      userEmail: null,
      status: null,
      disabledSwitch: true,
      clientFlag: null,
      tokenTG: null,
    };
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setUserLastName(state, lastName) {
      state.userLastName = lastName;
    },
    updateEmail(state, status) {
      state.status = status;
    },
    setNotificationStatus(state, value) {
      state.disabledSwitch = value;
    },
    setClientFlag(state, value) {
      state.clientFlag = value;
    },
    setTokenTG(state, token) {
      state.tokenTG = token;
    },
    setUserTgName(state, userName) {
      state.userTgName = userName;
    },
  },
  actions: {
    // получение id пользователя
    async fetchUserId({ commit }) {
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const id = tg.initDataUnsafe.user.id;
        const userName = tg.initDataUnsafe.user.username;
        console.log(JSON.stringify(tg.initDataUnsafe));
        commit("setUserId", id);
        commit("setUserTgName", userName);
      }
    },
    async fetchTokenTG({ commit }) {
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const token = tg.initDataUnsafe.hash;
        commit("setTokenTG", token);
      }
    },
    async getUserInfoById({ commit, state, dispatch }) {
      try {
        await dispatch("fetchUserId");
        await dispatch("fetchTokenTG");
        let response = await fetch(
          `https://musorok.online:8000/client_info/${state.userId}`
        );
        let data = await response.json();

        if (data.client_flg === 0) {
          state.clientFlag = false;
        } else {
          state.clientFlag = true;
        }
        commit("setUserName", data.first_name);
        commit("setUserLastName", data.last_name);
      } catch (error) {
        console.error("Error fetching user info:", error);
        //дописать обработку ошибок
      }
    },
    async getStatus({ commit, state }) {
      let response = await fetch(
        `https://musorok.online:8000/client_detail_info/${state.userId}`
      );
      let data = await response.json();
      state.status = data.notifications_email;
      let email = data.email;
      if (email) {
        if (email.trim() === "") {
          // state.disabledSwitch = true;
          commit("setNotificationStatus", true);
        } else {
          commit("setNotificationStatus", false);
          // state.disabledSwitch = false;
        }
      }
    },
    async getStateNav({ dispatch, state }) {
      let response = await fetch(
        `https://musorok.online:8000/client_info/${state.userId}`
      );
      let data = await response.json();
      if (data.client_flg === 0) {
        state.clientFlag = false;
      } else {
        state.clientFlag = true;
      }
    },
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getUserToken(state) {
      return state.tokenTG;
    },
    getUserTgName(state) {
      return state.userTgName;
    },
    getUserName(state) {
      return state.userName;
    },
    getUserLastName(state) {
      return state.userLastName;
    },
    getUserAddress(state) {
      return state.userAddress;
    },
    getSubscribeDay(state) {
      return state.subscribeDay;
    },
    getSubscribeEndDttm(state) {
      return state.subscribeEnd_dttm;
    },
    getSubscribeStartDttm(state) {
      return state.subscribeStart_dttm;
    },
    getUpdateUserEmail(state) {
      return state.userEmail;
    },
    getNotificationDisabled(state) {
      return state.disabledSwitch;
    },
    getClientFlag(state) {
      return state.clientFlag;
    },
  },
});
store.dispatch("getUserInfoById");
store.dispatch("getStatus");
store.dispatch("fetchTokenTG");

export default store;
