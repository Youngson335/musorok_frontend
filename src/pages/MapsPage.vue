<template>
  <div id="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

import waitingIconUrl from "../assets/icons/new_delivery-icon.png";
import newIconUrl from "../assets/icons/in_progress-icon.png";
import myGeoposIconUrl from "../assets/icons/me_geoposition.png";

export default {
  name: "MapComponent",
  setup() {
    const map = ref(null);
    const store = useStore();
    const userID = computed(() => store.getters.getUserId);

    const d = new Date();
    const fullDate = `${d.getFullYear()}-${`0${d.getMonth() + 1}`.slice(
      -2
    )}-${`0${d.getDate()}`.slice(-2)}`;

    async function postCourierLocation() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const prob = {
          courier_id: userID.value,
          latitude: userLat,
          longitude: userLng,
        };

        try {
          const response = await fetch(
            `https://musorok.online:8000/courier_locations/`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(prob),
            }
          );
          if (!response.ok)
            throw new Error("Не удалось получить локацию курьера");
          console.log("отправил локацию", await response.json());
        } catch (err) {
          console.error("Произошла ошибка отправки локации:", err);
        }
      });
    }

    onMounted(() => {
      loadPointsFromAPI();
      setUserPosition();
      postCourierLocation();
    });

    function setUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const userIcon = L.icon({
              iconUrl: myGeoposIconUrl,
              iconSize: [40],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            if (map.value) {
              const userMarker = L.marker([userLat, userLng], {
                icon: userIcon,
              })
                .addTo(map.value)
                .bindPopup("Вы здесь");

              map.value.setView([userLat, userLng], 13);
            } else {
              console.error("Карта не инициализирована");
            }
          },
          (error) => {
            console.error("Error getting user position:", error);
          }
        );
      } else {
        console.error("Геолокация не поддерживается этим браузером.");
      }
    }

    async function loadPointsFromAPI() {
      console.log("User ID:", userID.value); // Логирование ID пользователя
      try {
        const response = await fetch(
          `https://musorok.online:8000/delivery_agent_orders/${userID.value}`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_date: fullDate }),
          }
        );

        if (!response.ok) {
          console.warn("Ошибка при отправке данных, код:", response.status);
          // Если запрос не удался, можно инициализировать карту с координатами по умолчанию
          initializeMapWithDefaultCoordinates();
          return; // Выход из функции, чтобы не продолжать обработку
        }

        const data = await response.json();
        console.log("Данные из API:", data); // Логирование полученных данных

        let initialPoint =
          data.find(
            (point) =>
              point.latitude &&
              point.longitude &&
              point.meeting_status === "Waiting"
          ) || data.find((point) => point.latitude && point.longitude);

        if (initialPoint) {
          // Инициализация карты
          map.value = L.map("map").setView(
            [initialPoint.latitude, initialPoint.longitude],
            11
          );
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
          }).addTo(map.value);
          addMarkers(data);
        } else {
          console.error("Нет доступных координат для инициализации карты");
          initializeMapWithDefaultCoordinates(); // Инициализация карты с координатами по умолчанию
        }
      } catch (error) {
        console.error("Error loading points from API:", error);
        initializeMapWithDefaultCoordinates(); // Инициализация карты с координатами по умолчанию
      }
    }

    function initializeMapWithDefaultCoordinates() {
      const defaultLatitude = 55.7558; // Широта (пример: Москва)
      const defaultLongitude = 37.6173; // Долгота (пример: Москва)

      map.value = L.map("map").setView([defaultLatitude, defaultLongitude], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map.value);

      console.log("Карта инициализирована с координатами по умолчанию");
    }

    function addMarkers(data) {
      const waitingIcon = L.icon({
        iconUrl: waitingIconUrl,
        iconSize: [32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const newIcon = L.icon({
        iconUrl: newIconUrl,
        iconSize: [32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      data.forEach((point) => {
        if (point.latitude && point.longitude) {
          let icon =
            point.meeting_status === "In progress" ? waitingIcon : newIcon;

          const markerHtml = `<div style="position: relative; display: inline-block;">
                                <img src="${icon.options.iconUrl}" style="width: 32px;">
                                <div style="position: absolute; top: 6px; left: 39px; background-color: white; padding: 2px 5px; border: 1px solid white; border-radius: 5px; width: 90px; font-size: 14px; text-align: center;">
                                  ${point.interval}
                                  <div style="position: absolute; top: 9px; left: -8px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white; transform: rotate(90deg);"></div>
                                </div>
                              </div>`;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: "custom-marker",
            iconSize: [32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const popupContent =
            point.meeting_status === "Waiting"
              ? `<p>${point.full_adress}</p><button :plain='true' class='add__delivery-btn' onclick="handleOrder('${point.id}', this)">взять в работу</button>`
              : `<p>${point.full_adress}</p>`;

          if (map.value) {
            const marker = L.marker([point.latitude, point.longitude], {
              icon: customIcon,
            })
              .addTo(map.value)
              .bindPopup(popupContent);

            marker.on("popupopen", function () {
              window.handleOrder = async function (orderId) {
                try {
                  const response = await fetch(
                    `https://musorok.online:8000/update_delivery_in_progress/`,
                    {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: String(orderId) }),
                    }
                  );
                  if (!response.ok)
                    throw new Error("Ошибка при отправке данных");
                  console.log("Обновил статус: ", await response.json());
                  open2();
                  marker.setIcon(waitingIcon);
                  map.value.closePopup();
                } catch (error) {
                  console.error("Произошла ошибка: ", error);
                }
              };
            });
          } else {
            console.error("Карта не инициализирована");
          }
        }
      });
    }

    function open2() {
      ElMessage({
        message: "Вы взялись за заказ!",
        type: "success",
      });
    }

    return {
      map,
    };
  },
};
</script>

<style>
#map-container {
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}

.leaflet-popup-content p {
  margin: 0;
  margin-bottom: 5px !important;
  font-family: "Montserrat", sans-serif;
}

.add__delivery-btn {
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  background-color: #c4ecffa1;
  color: #3e3c3c;
}
</style>
