<template>
  <div class="notifications">
    <div class="notifications__block">
      <div class="block__text">
        <p>Уведомления в боте</p>
      </div>
      <div class="block__switch">
        <SwitchTG :notifications_tg="notifications_tg" :tgUserId="tgUserId" />
      </div>
    </div>
    <div class="notifications__block">
      <div class="block__text">
        <p>Уведомления на email</p>
      </div>
      <div class="block__switch">
        <SwitchMail
          :notifications_email="notifications_email"
          :tgUserId="tgUserId"
          :userEmail="userEmail"
          :stateEditInfo="stateEditInfo"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SwitchMail from "../components/SwitchMail.vue";
import SwitchTG from "../components/SwitchTG.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    SwitchMail,
    SwitchTG,
  },
  data() {
    return {
      notifications_tg: "",
      notifications_email: "",
      userEmail: this.email,
      stateEditInfo: this.editInfo,
    };
  },
  props: {
    email: {
      type: String,
    },
    editInfo: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters(["getUserId"]),
    tgUserId() {
      return this.getUserId;
    },
  },
};
</script>
<style>
.notifications {
  width: calc(100% - 60px);
  margin: 0 auto;
}
.notifications__block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
