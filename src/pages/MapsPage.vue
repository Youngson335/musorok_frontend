<template>
  <div id="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapComponent",
  setup() {
    const map = ref(null);

    onMounted(() => {
      map.value = L.map("map").setView([51.501046, 46.12405], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map.value);

      loadPointsFromAPI();
    });

    async function loadPointsFromAPI() {
      // Пример запроса к вашему бэкенду
      const response = await fetch(
        `https://musorok.online:8000/delivery_agent_orders/${id}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_date: date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных");
      }

      const data = await response.json();
      console.log("Данные отправлены!", data);
      // .then((response) => {
      //   // Пример обработки данных
      //   // Здесь предполагается, что данные содержат массив объектов с полями latitude и longitude
      //   const data = [
      //     { latitude: 51.404817, longitude: 128.152302, title: "Point 1" },
      //     { latitude: 51.405817, longitude: 128.153302, title: "Point 2" },
      //   ];

      //   data.forEach((point) => {
      //     L.marker([point.latitude, point.longitude])
      //       .addTo(map.value)
      //       .bindPopup(point.title);
      //   });
    }

    return {};
  },
};
</script>

<style scoped>
#map-container {
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}
</style>
