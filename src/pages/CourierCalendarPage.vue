<template>
  <div class="delivery">
    <div class="delivery__title">
      <h1>Календарь оказания услуг</h1>
    </div>
    <CourierCalendar />
  </div>
</template>
<script>
import CourierCalendar from "../components/CourierCalendar.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    CourierCalendar,
  },
  computed: {
    ...mapGetters(["getUserId"]),
    userID() {
      return this.getUserId;
    },
  },
  methods: {
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
            console.log("отправил локацию в курьерском календаре", data);
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
<style lang="css" scoped>
.delivery {
  padding: 20px;
}
h1 {
  color: black;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>
