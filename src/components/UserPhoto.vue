<template>
  <div class="user__photo">
    <img v-if="image" :src="getPhoto" alt="" />
    <div v-else>
      <p>{{ userNameFirstLetter }}</p>
      <p>{{ userLastNameFirstLetter }}</p>
    </div>
  </div>
</template>
<script>
import tg from "../telegram.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      image: false,
      userNameFirstLetter: "",
      userLastNameFirstLetter: "",
    };
  },
  props: {
    linkToPhoto: {
      type: String,
    },
  },
  computed: {
    ...mapGetters(["getUserName", "getUserLastName"]),
    getPhoto() {
      if (this.linkToPhoto !== null) {
        this.image = true;
        return this.linkToPhoto;
      } else {
        this.image = false;
      }
    },
  },
  methods: {
    async updateFirstLetters() {
      await this.$store.dispatch("getUserInfoById");
      this.updateUserNameFirstLetter();
      this.updateUserLastNameFirstLetter();
    },
    updateUserNameFirstLetter() {
      const userName = this.getUserName;
      this.userNameFirstLetter = userName.charAt(0);
    },
    updateUserLastNameFirstLetter() {
      const userLastName = this.getUserLastName;
      this.userLastNameFirstLetter = userLastName.charAt(0);
    },
  },
  mounted() {
    this.updateFirstLetters();
  },
};
</script>
<style>
.user__photo img {
  width: clamp(120px, 15vw, 160px);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.user__photo div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: clamp(120px, 15vw, 160px);
  height: clamp(120px, 15vw, 160px);
  border-radius: 50%;
  box-shadow: 0 0 10px #a19595;
  font-size: 27px;
  background-color: #a19595;
  color: white;
  font-weight: 500;
}

.user__photo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
