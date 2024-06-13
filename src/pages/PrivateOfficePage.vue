<template>
  <StopModal />
  <div class="content">
    <UserPhoto :linkToPhoto="linkToPhoto" class="user__photo" />
    <div class="user__info">
      <UserName :userName="userName" :userLastName="userLastName" />
      <div class="info__id">
        <p v-if="userId">{{ userId }}</p>
        <p class="text-error" v-else-if="!userId">id is not defined</p>
      </div>
      <div class="user_token">
        <p>Ваш токен: {{ userTokenTG }}</p>
      </div>
    </div>
    <Subscription />
    <div v-if="freeDelivery === 0" style="width: 100%">
      <BtnAddFreeDelivery />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import UserPhoto from "../components/UserPhoto.vue";
import UserName from "../components/UserName.vue";

import Subscription from "../components/Subscription.vue";

import BtnAddFreeDelivery from "../components/BtnAddFreeDelivery.vue";

export default {
  components: {
    UserPhoto,
    UserName,

    Subscription,
    BtnAddFreeDelivery,
  },
  data() {
    return {
      userId: null,
      freeDelivery: null,
      linkToPhoto: null,
    };
  },
  methods: {
    async getStateBtnById() {
      let response = await fetch(
        `https://musorok.online:8000/client_info/${this.getUserId}`
      );
      let data = await response.json();
      console.log(data);
      this.freeDelivery = data.free_delivery;
      this.linkToPhoto = data.photo_url;
    },
  },
  computed: {
    ...mapGetters([
      "getUserId",
      "getUserName",
      "getUserLastName",
      "getUserToken",
    ]),
    userId() {
      return this.getUserId;
    },
    userName() {
      return this.getUserName;
    },
    userLastName() {
      return this.getUserLastName;
    },
    userTokenTG() {
      return this.getUserToken;
    },
  },
  created() {
    this.$store.dispatch("fetchUserId");
    this.getStateBtnById();
  },
};
</script>
<style>
:root {
  --fontcolor: #317abb;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}

.user__photo {
  margin-bottom: 10px;
}
.info__id {
  color: var(--fontcolor);
  margin-bottom: 15px;
  text-align: center;
}
.text-error {
  color: red;
}
</style>
