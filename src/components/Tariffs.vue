<template>
  <div class="tariffs" v-if="tariffStatus !== 500">
    <div class="tariffs__text">
      <h4>Выберите тариф</h4>
    </div>
    <div
      @click="showTariffDurationByType(tariff.type)"
      class="tariffs__item"
      v-for="tariff of tariffs"
      :class="{ activeTariffs: isActiveByType === tariff.type }"
    >
      <div class="item__name">
        <p>{{ tariff.name }}</p>
        <div class="item__icon">
          <img src="../assets/icons/subscription__icon.svg" />
        </div>
      </div>
      <div class="item__description">
        <p>{{ tariff.description }}</p>
      </div>
    </div>
  </div>
  <div v-show="showDuration" class="duration__information" id="duration">
    <div class="tariffs__text">
      <h4>Выберите срок подписки</h4>
    </div>
    <div
      @click="showTotalSubscription(duration)"
      :class="{ activeTariffs: isActiveById === duration.tariff_id }"
      :key="duration.tariff_id"
      class="tariff__duration"
      v-for="duration of tariffsDuration"
    >
      <div class="duration__info">
        <p>{{ duration.duration_info.duration_name }}</p>
      </div>
      <div class="duration__price">
        <p>{{ duration.duration_info.score }} руб.</p>
      </div>
    </div>
  </div>
  <div id="price" class="payment" v-show="showPayment">
    <div class="payment__info">
      <p>
        Вы выбрали тариф <span>"{{ tariffsName }}"</span>, длительностью на
        {{ durationName }}
      </p>
      <p class="payment__description">
        Стоимость подписки составляет <span>{{ tariffPrice }}</span> рублей
      </p>
    </div>
    <div class="payment__btn">
      <el-button type="success" @click="createPayment"
        >Перейти к оплате</el-button
      >
    </div>
  </div>
  <div v-if="tariffStatus === 500" class="tariffs__error">
    <p>{{ errorText }}</p>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      tariffs: null,
      tariffsDuration: null,
      showDuration: false,
      tariffsName: null,
      showPayment: false,
      tariffPrice: null,
      isActiveByType: null,
      isActiveById: null,
      durationName: null,
      tariffId: null,
      paymentID: null,
      tariffStatus: null,
      errorText:
        "К сожалению, ваш адрес находится вне зоны нашего обслуживания, в связи с чем мы не можем вам предложить выбрать тариф. Если вы уверены, что это ошибка или хотите изменить адрес, вы можете обратиться в чат поддержки",
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
    userID() {
      return this.getUserId;
    },
  },
  methods: {
    successPayment() {
      ElNotification({
        title: `Оплата прошла успешно! `,
        type: "success",
      });
    },
    errorPayment() {
      ElNotification({
        title: `Оплата не была произведена. Повторите платёж повторно.`,
        type: "error",
      });
    },
    async getTariffsByUserId(id) {
      console.log(id);
      let response = await fetch(
        `https://musorok.online:8000/client_tariffs/${id}`
      );
      let data = await response.json();
      this.tariffs = data.tariffs;
      this.tariffStatus = response.status;
      console.table(this.tariffs);
    },
    showTariffDurationByType(type) {
      this.showDuration = true;
      location.href = "#duration";
      let tariffs = this.tariffs;
      let result = tariffs.find((item) => item.type === type);
      this.tariffsName = result.name;
      this.isActiveByType = result.type;
      let duration = result.tariff_duration;
      this.tariffsDuration = duration;
      console.log(this.tariffsName);
      this.showPayment = false;
    },
    showTotalSubscription(subscription) {
      location.href = "#price";
      this.showPayment = true;
      this.isActiveById = subscription.tariff_id;
      this.durationName = subscription.duration_info.duration_name;
      console.log("тут цена", subscription);
      this.tariffPrice = subscription.duration_info.score;
      this.tariffId = subscription.tariff_id;
    },
    async createPayment() {
      await fetch(`https://musorok.online:8000/payment/create_payment/`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.userID,
          tariff_id: this.tariffId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка отправки тарифа");
          } else return response;
        })
        .then((data) => {
          return data.json();
        })
        .then((jsonData) => {
          console.log(jsonData);
          this.paymentID = jsonData.payment_id;
          console.log(this.paymentID);

          window.location.href = jsonData.confirmation_url;
        })
        .catch((err) => {
          console.error("Ошибка запроса:", err);
        });
    },
  },
  mounted() {
    this.getTariffsByUserId(this.userID);

    function getUrlParameter(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Проверяем наличие параметра 'm' в URL
    var mParameter = getUrlParameter("m");

    // Если параметр 'm' присутствует, делаем GET запрос
    if (mParameter) {
      let id = this.userID;
      fetch(`https://musorok.online:8000/payment/status_by_client/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка получения информации о платеже");
          } else {
            return response;
          }
        })
        .then((data) => {
          return data.json();
        })
        .then((jsonData) => {
          console.log("Получен ответ платежа", jsonData);
          if (jsonData.status === "succeeded") {
            this.successPayment();
          } else {
            this.errorPayment();
          }
        });
    }
  },
};
</script>
<style>
html {
  scroll-behavior: smooth;
}
.tariffs__title {
  margin-bottom: 5px;
  color: #54ba6c;
}
.tariffs__title h2 {
  font-size: 20px;
}
.tariffs__item {
  margin-bottom: 10px;
  border: 1px solid #c5c5c5;
  padding: 5px;
  border-radius: 5px;
  background: #cdcdcd75;
  cursor: pointer;
}

.item__name {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item__name p {
  font-weight: 600;
}
.item__description {
  font-size: 12px;
}
.item__icon {
  display: flex;
  justify-content: end;
  align-items: center;
}
.item__icon img {
  display: block;
}

.tariff__duration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  border: 1px solid #c5c5c5;
  padding: 10px;
  border-radius: 5px;
  background: #cdcdcd75;
  cursor: pointer;
  animation: showTariffBlock 0.4s ease;
}
.duration__price {
  color: #01b201;
}

.payment__info {
  margin-bottom: 10px;
}
.payment__info span {
  font-weight: 600;
}
.payment__description {
  font-size: 13px;
}
.payment {
  background-color: #f0f9eb;
  padding: 10px;
  border-radius: 5px;
  animation: showTariffBlock 0.5s ease;
}
.payment__btn {
  display: flex;
  justify-content: end;
  align-items: center;
}
@keyframes showTariffBlock {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
.activeTariffs {
  background-color: white;
}
.tariffs__text {
  margin-bottom: 5px;
}
.tariffs__error {
  text-align: center;
  text-wrap: balance;
  margin: 0 auto;
  font-weight: 600;
  font-size: 17px;
}
</style>
