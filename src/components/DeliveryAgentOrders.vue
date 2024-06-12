<template>
  <div class="load" v-loading="loading">
    <div
      class="orders__block"
      v-show="showInfoDelivery"
      v-for="day of reDelivery"
    >
      <div
        class="block__order"
        :class="{
          done: day.meeting_status === 'Done',
          canceling: day.meeting_status === 'Canceling',
        }"
        @click="getValueFromProxy(day.id)"
      >
        <div class="order__interval">
          <div class="interval__start">{{ day.start_time }}</div>
          <div class="interval__end">{{ day.end_time }}</div>
        </div>
        <div class="order__client">
          <div class="client__name">
            <p>{{ day.client_name }}</p>
          </div>
          <div class="client__address">
            <p>{{ day.full_adress }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="showWarning" v-show="showWarning">
    <p>Нет заказов</p>
  </div>
  <ModalInfoDeliveryAgent
    :clickedInfoUser="clickedInfoUser"
    :stateModal="stateModal"
    @editStateModal="editStateModal"
    @updateData="updateData"
    @updateStateModal="updateStateModal"
  />
  <ModalCompleteDelivery
    :clickedInfoUser="clickedInfoUser"
    :stateModalComplete="stateModalComplete"
    @resetModals="resetModals"
    @editStateModal="editStateModal"
    @updateData="updateData"
    @updateStateModal="updateStateModal"
  />
</template>
<script>
import { mapGetters } from "vuex";
import ModalInfoDeliveryAgent from "./ModalInfoDeliveryAgent.vue";
import ModalCompleteDelivery from "./ModalCompleteDelivery.vue";
import { ref } from "vue";
export default {
  components: {
    ModalInfoDeliveryAgent,
    ModalCompleteDelivery,
  },
  data() {
    return {
      date: null,
      infoDelivery: null,
      showInfoDelivery: true,
      clickedInfoUser: {},
      stateModal: false,
      loading: true,
      showWarning: false,
      statusDelivery: null,
      stateModalComplete: false,
    };
  },
  props: {
    selectedDate: {
      type: String,
    },
    reDelivery: {
      type: Object,
    },
    titleDelivery: {
      type: String,
    },
  },
  watch: {
    selectedDate(newDate) {
      this.date = newDate;
      this.checkUserId();
    },
    reDelivery() {
      if (this.reDelivery[0]) {
        this.showWarning = false;
      } else {
        this.showWarning = true;
      }
    },
    titleDelivery(newVal) {
      this.statusDelivery = newVal;
    },
  },
  computed: {
    ...mapGetters(["getUserId"]),
  },
  methods: {
    resetModals(value) {
      this.stateModalComplete = value;
      this.getDeliveryAgentOrdersById(this.getUserId, this.date);
    },
    updateStateModal(value) {
      this.stateModal = value;
      this.stateModalComplete = value;
      this.getDeliveryAgentOrdersById(this.getUserId, this.date);
    },
    updateData(value) {
      if (value === true) {
        console.log("обновил");
        this.getDeliveryAgentOrdersById(this.getUserId, this.date);
      } else {
        console.log("не обновил");
      }
    },
    editStateModal(value) {
      this.stateModal = value;
      this.stateModalComplete = value;
    },
    getValueFromProxy(id) {
      if (this.statusDelivery === "Warning") {
        this.stateModal = true;
      } else if (this.statusDelivery === "inProgress") {
        this.stateModalComplete = true;
      }
      const targetArray = this.infoDelivery;

      const result = targetArray.find((item) => item.id === id);
      this.clickedInfoUser.clickedInfo = result;
      console.log(this.clickedInfoUser);
    },
    checkUserId() {
      if (this.date !== "") {
        console.log("получил", this.date);
        this.getDeliveryAgentOrdersById(this.getUserId, this.date);
      } else {
        console.log("ничего не отправил!");
      }
    },
    async getDeliveryAgentOrdersById(id, date) {
      let probnay = {
        newDate: date,
        newId: id,
      };
      console.log(probnay);
      this.loading = true;

      try {
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

        let infoInProgress = data.filter(
          (item) => item.meeting_status === "In progress"
        );
        let infoWaiting = data.filter(
          (item) => item.meeting_status === "Waiting"
        );
        let infoDone = data.filter(
          (item) =>
            item.meeting_status === "Done" ||
            item.meeting_status === "Canceling"
        );

        this.deliveryInProgress = infoInProgress;
        this.$emit("deliveryWaiting", infoWaiting);
        this.$emit("deliveryInProgress", infoInProgress);
        this.$emit("deliveryInfoDone", infoDone);

        this.infoDelivery = data;
        this.showInfoDelivery = true;

        this.loading = false;

        this.infoDelivery.forEach((day, index) => {
          setTimeout(() => {
            const blocks = document.querySelectorAll(".block__order");
            blocks[index].style.animationDelay = `${index * 0.1}s`;
          }, index * 100);
        });
      } catch (error) {
        console.error("Произошла ошибка: ", error);
      }
    },
  },
  mounted() {
    this.date = this.selectedDate;
    this.checkUserId;
  },
};
</script>
<style scoped>
.block__order {
  margin-bottom: 8px;
  display: flex;
  width: 100%;
  border: 1px solid #cbcbcb;
  border-radius: 10px;
  padding: 10px;
  animation: showInfoDelivery 0.5s ease;
  animation-fill-mode: both;
}
.order__interval {
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: start;
  margin-right: 10px;
}
.client__address p {
  font-size: 12px;
  max-width: 240px;
  animation-delay: 2s;
  animation: showTextInfo 1s ease;
}
@keyframes showInfoDelivery {
  0% {
    opacity: 0;
    transform: translateY(29px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
@keyframes showTextInfo {
  0% {
    display: none;
    opacity: 0;
  }
  100% {
    display: block;
    opacity: 1;
  }
}
.load {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: scroll;
}
.showWarning {
  text-align: center;
  color: red;
  font-size: 18px;
}
.done {
  background-color: #77cd6d;
  border: 1px solid #62ab5a;
}
.canceling {
  background-color: #ff6969;
  border: 1px solid #c85151;
}
</style>
