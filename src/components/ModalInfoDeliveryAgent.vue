<template>
  <div class="modal__delivery" v-show="stateModal">
    <div class="all__info" v-for="client in checkInfoUser" :key="client.id">
      <div class="info__id">
        <div class="exit">
          <button @click="toHome">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"
                ></path>
              </svg>
            </span>
          </button>
        </div>
        <p>ID: {{ client.id }}</p>
      </div>

      <div class="info__comment">
        <p>{{ client.comment }}</p>
      </div>
      <div class="detail__info">
        <div class="time__info">
          <p>
            Интервал:
            <span>{{ `${client.delivery_dt} ${client.interval}` }}</span>
          </p>
        </div>
        <div class="info__task">
          <p>
            Задание: <span>{{ client.meeting_name }}</span>
          </p>
        </div>
        <div class="info__address">
          <p>
            Адрес: <span>{{ client.full_adress }}</span>
          </p>
        </div>
        <div class="info__name">
          <p>
            Клиент: <span>{{ client.client_name }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="in__working">
      <button :plain="true" @click="changeStatus(checkId)">
        Взять в работу!
      </button>
    </div>
  </div>
</template>
<script>
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      infoDelivery: this.clickedInfoUser,
      activeId: null,
    };
  },
  props: {
    clickedInfoUser: {
      type: Object,
      required: true,
    },
    stateModal: {
      type: Boolean,
    },
  },
  computed: {
    checkInfoUser() {
      return this.clickedInfoUser;
    },
    checkId() {
      return this.clickedInfoUser.clickedInfo.id;
    },
  },
  methods: {
    open2() {
      ElMessage({
        message: "Вы взялись за заказ!",
        type: "success",
      });
    },
    toHome() {
      this.$emit("editStateModal", false);
      this.$emit("updateData", true);
    },

    async changeStatus(id) {
      let clientId = String(id);
      let prob = {
        id: clientId,
      };
      console.log("итоговый id", prob);

      console.log(id);
      await fetch(`https://musorok.online:8000/update_delivery_in_progress/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: clientId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при отправке данных");
          } else return response;
        })
        .then((data) => {
          console.log("Обновил статус: ", data);
          this.$emit("updateStateModal", false);
          this.open2();
        })
        .catch((error) => {
          console.error("Произошла ошибка: ", error);
        });
    },
  },
};
</script>
<style scoped>
.modal__delivery {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  color: black;
  height: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  z-index: 3000;
}
.all__info {
  height: 80%;
}
.info__id {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.info__id p {
  padding-top: 3px;
}
.info__comment {
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #9a9898;
  background-color: #eeeeee;
  padding: 5px;
  border-radius: 5px;
}
.info__task {
  margin-bottom: 5px;
}
.info__address {
  margin-bottom: 5px;
}
.in__working button {
  font-family: "Montserrat", sans-serif;
  border: none;
  padding: 10px 25px;
  font-size: 17px;
  border-radius: 7px;
  background-color: rgb(158, 121, 55);
  color: white;
}
.exit {
  display: flex;
  justify-content: start;
  align-items: start;
  width: 100%;
}
.exit button {
  background: none;
  border: none;
  position: absolute;
}
.exit svg {
  width: 25px;
  color: black;
}
.detail__info {
  border: 1px solid #9a9898;
  background-color: #eeeeee;
  padding: 10px;
  border-radius: 5px;
}
.detail__info p {
  font-weight: 700;
}
.detail__info span {
  font-weight: 400;
}
</style>
