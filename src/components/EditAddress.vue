<template>
  <div class="edit__address">
    <div class="address__title">
      <h4>Ваш адрес:</h4>
    </div>
    <p :class="{ noEdit: !editAddress }">{{ userAddress }}</p>
  </div>
  <p>Чтобы изменить адрес, обратитесь в тех. поддержку!</p>
</template>
<script>
import { mapGetters } from "vuex";
import ButtonEditAddress from "../components/ButtonEditAddress.vue";

export default {
  components: {
    ButtonEditAddress,
  },
  data() {
    return {
      userAddress: this.fullAddress,
    };
  },
  props: {
    fullAddress: {
      type: String,
    },
  },
  watch: {
    fullAddress(newVal) {
      this.userAddress = newVal;
    },
  },
};
</script>
<style>
.edit__address {
  margin: 20px 0;
  margin-bottom: 10px;
}
.noEdit {
  color: #abb2ac;
}
</style>
