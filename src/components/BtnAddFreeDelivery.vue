<template>
  <div v-show="hiddenBtn" class="button" @click="showModal">
    <button>Тестовый вынос</button>
  </div>
  <div class="position__modal">
    <CalendarFreeDelivery
      @updateShowBtn="onUpdateShowBtn"
      :hiddenBtn="hiddenBtn"
      class="calendar"
    />
  </div>
</template>

<script>
import CalendarFreeDelivery from "./CalendarFreeDelivery.vue";
export default {
  components: {
    CalendarFreeDelivery,
  },
  data() {
    return {
      hiddenBtn: true,
    };
  },
  methods: {
    showModal() {
      const modalPosition = document.querySelector(".position__modal");
      const modal = document.querySelector(".calendar");
      console.log("working");
      modal.classList.add("active__modal");
      modal.style.display = "block";
      modalPosition.style.display = "block";
    },
    onUpdateShowBtn(value) {
      this.hiddenBtn = value;
    },
  },
};
</script>
<style scoped>
.button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  background-color: #54ba6c;
  color: white;
  border: none;
  padding: 5px 18px;
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  font-size: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.position__modal {
  display: none;
}
.active__modal {
  animation: showModal 0.5s;
}
@keyframes showModal {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
