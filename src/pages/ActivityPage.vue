<template>
  <div class="activity__page" v-loading="loading">
    <SelectedDate @loadingPage="editLoading" />
  </div>
</template>
<script>
import SelectedDate from "../components/SelectedDate.vue";
import { mapGetters } from "vuex";
export default {
  components: { SelectedDate },
  data() {
    return {
      loading: true,
      reload: null,
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
    userID() {
      return this.getUserId;
    },
  },
  methods: {
    editLoading(value) {
      this.loading = value;
    },
    postCourierLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const prob = {
          courier_id: this.userID,
          latitude: userLat,
          longitude: userLng,
        };

        fetch(`https://musorok.online:8000/courier_locations/`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prob),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Не удалось получить локацию курьера");
            } else return response;
          })
          .then((data) => {
            console.log("отправил локацию в активности", data);
          })
          .catch((err) => {
            console.error("Произошла ошибка отправки локации:", err);
          });
      });
    },
  },
  mounted() {
    this.postCourierLocation();
  },
};
</script>
<style scoped>
h1 {
  color: black;
  padding: 20px;
}
.activity__page {
  padding: 20px;
  max-height: 600px;
  overflow: scroll;
}
</style>
