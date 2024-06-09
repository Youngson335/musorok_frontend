import { createStore } from "vuex";
import tg from "./telegram.js";

const store = createStore({
  state() {
    return {
      count: 0,
      userName: "",
      userLastName: "",
      userId: null,
      user: null,
      ivanID: 7173408228,
      myId: 1491570929,
      subscribeDay: null,
      subscribeEnd_dttm: null,
      subscribeStart_dttm: null,
      userEmail: null,
      status: null,
      disabledSwitch: true,
      clientFlag: null,
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
  },
  actions: {
    // получение id пользователя
    async fetchUserId({ commit }) {
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const id = tg.initDataUnsafe.user.id;
        commit("setUserId", id);
      }
    },
    async getUserInfoById({ commit, state, dispatch }) {
      try {
        await dispatch("fetchUserId");
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

export default store;
