<template>
  <div class="settings">
    <div class="settings__title">
      <h2>Настройки профиля</h2>
    </div>
    <div class="settings__content">
      <EditInfo
        :editInfo="editInfo"
        :firstName="firstName"
        :lastName="lastName"
        :email="email"
        @updateParent="handleUpdateParent"
      />
      <Notifications
        :editInfo="editInfo"
        :email="email"
        class="content__notifications"
      />
      <!-- <ButtonEdit :editInfo="editInfo" @updateParent="editInfo = $event" /> -->
      <EditAddress :fullAddress="fullAddress" />
    </div>
  </div>
  <!-- <NavigationMenu /> -->
</template>
<script>
import { mapGetters } from "vuex";
import NavigationMenu from "../components/NavigationMenu.vue";
import EditInfo from "../components/EditInfo.vue";
import Notifications from "../components/Notifications.vue";
import ButtonEdit from "../components/ButtonEdit.vue";
import EditAddress from "../components/EditAddress.vue";

export default {
  components: {
    NavigationMenu,
    EditInfo,
    Notifications,
    ButtonEdit,
    EditAddress,
  },
  data() {
    return {
      editInfo: true,
      firstName: null,
      lastName: null,
      fullAddress: null,
      email: null,
    };
  },
  computed: {
    editInfoUpdate() {
      return this.editInfo;
    },
    ...mapGetters(["getUserId"]),
    userId() {
      let id = this.getUserId;
      this.getUserDetailInfoById(id);
    },
  },
  methods: {
    async getUserDetailInfoById(id) {
      //изменить id!!!
      let response = await fetch(
        `https://musorok.online:8000/client_detail_info/${id}`
      );
      let data = await response.json();
      this.firstName = data.first_name;
      this.lastName = data.last_name;
      this.email = data.email;
      this.fullAddress = data.full_adress;

      console.log(data);
    },
    handleUpdateParent(value) {
      this.editInfo = value;
    },
  },
  mounted() {
    this.userId;
    this.editInfoUpdate;
  },
};
</script>
<style lang="css">
.settings {
  padding: 20px;
  margin-top: 20px;
}
.settings__title h2 {
  text-align: center;
  margin-bottom: 20px;
}
.settings__content {
  display: flex;
  justify-content: start;
  align-items: start;
  flex-direction: column;
}
.content__notifications {
  margin-bottom: 15px;
}
</style>
