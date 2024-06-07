<template>
  <div class="demo-date-picker">
    <div class="block">
      <el-date-picker
        v-model="value1"
        type="date"
        placeholder="Выберите дату!"
        :size="size"
        :disabled-date="disabledDate"
      />
    </div>
  </div>
  <ActivityMenu
    :newDeliveryWaiting="newDeliveryWaiting"
    :newDeliveryInProgress="newDeliveryInProgress"
    :newDeliveryDone="newDeliveryDone"
    @updateDelivery="updateValueDelivery"
    @postTitleDelivery="getTitleDelivery"
  />
  <DeliveryAgentOrders
    @deliveryWaiting="addDeliveryWaiting"
    @deliveryInProgress="addDeliveryInProgress"
    @deliveryInfoDone="addDeliveryDone"
    :selectedDate="formattedDate"
    :reDelivery="reDelivery"
    :titleDelivery="titleDelivery"
  />
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from "vue";

const size = ref("default");
const value1 = ref("");
const formattedDate = ref("");

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const day = `0${d.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

const isWithinAllowedRange = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const endOfTomorrow = new Date(tomorrow);
  endOfTomorrow.setHours(23, 59, 59, 999);
  return date <= endOfTomorrow;
};

watch(value1, (newValue) => {
  const selectedDate = new Date(newValue);

  if (isWithinAllowedRange(selectedDate)) {
    formattedDate.value = formatDate(newValue);
    console.log(formattedDate.value);
  } else {
    console.error("Выбранная дата за пределами допустимого диапазона.");
    value1.value = ""; // Сбрасываем выбранную дату, если она недопустима
  }
});

const shortcuts = [
  {
    text: "Сегодня",
    value: new Date(),
  },
  {
    text: "Вчера",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: "Неделю назад",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];

const disabledDate = (time) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return time.getTime() > tomorrow.getTime();
};

const loadPage = () => {
  const { emit } = getCurrentInstance();
  emit("loadingPage", false);
};

onMounted(() => {
  loadPage();
});

onMounted(() => {
  const today = new Date();
  value1.value = formatDate(today);
});
</script>

<script>
import ActivityMenu from "./ActivityMenu.vue";
import DeliveryAgentOrders from "./DeliveryAgentOrders.vue";

export default {
  data() {
    return {
      loadPage: false,
      newDeliveryWaiting: null,
      newDeliveryInProgress: null,
      newDeliveryDone: null,
      reDelivery: null,
      titleDelivery: null,
    };
  },
  components: {
    ActivityMenu,
    DeliveryAgentOrders,
  },
  methods: {
    getTitleDelivery(title) {
      this.titleDelivery = title;
    },
    updateValueDelivery(value) {
      this.reDelivery = value;
    },
    loadPage() {
      console.log("отработал");
      this.$emit("loadingPage", false);
    },
    addDeliveryWaiting(value) {
      const wait = {
        status: "Ожидание",
        value: value,
        counter: value.length,
      };
      this.newDeliveryWaiting = wait;
      console.log(wait);
    },
    addDeliveryInProgress(value) {
      const inProg = {
        status: "В процессе",
        value: value,
        counter: value.length,
      };
      this.newDeliveryInProgress = inProg;
      console.log(inProg);
    },
    addDeliveryDone(value) {
      const done = {
        status: "Завершил",
        value: value,
        counter: value.length,
      };
      this.newDeliveryDone = done;
      console.log(done);
    },
  },
  mounted() {
    const thSunday = document.querySelector('th[aria-label="Sunday"]');
    const thMonday = document.querySelector('th[aria-label="Monday"]');
    const thTuesday = document.querySelector('th[aria-label="Tuesday"]');
    const thWednesday = document.querySelector('th[aria-label="Wednesday"]');
    const thThursday = document.querySelector('th[aria-label="Thursday"]');
    const thFriday = document.querySelector('th[aria-label="Friday"]');
    const thSaturday = document.querySelector('th[aria-label="Saturday"]');

    if (thSunday) {
      thSunday.textContent = "Пн";
      thMonday.textContent = "Вт";
      thTuesday.textContent = "Ср";
      thWednesday.textContent = "Чт";
      thThursday.textContent = "Птн";
      thFriday.textContent = "Сб";
      thSaturday.textContent = "Вс";
    } else {
      console.error('Элемент с aria-label="Sunday" не найден.');
    }
    // this.loadPage();
  },
};
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.demo-date-picker .block {
  padding: 10px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
