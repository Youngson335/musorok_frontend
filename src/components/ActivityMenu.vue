<template>
  <section class="activity__options">
    <div class="options" v-for="block in menu" :key="block.id">
      <button class="options-button" @click="selectedOptions(block.id)">
        {{ block.title }} ({{ block.delivery ? block.delivery.counter : 0 }})
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          id: 0,
          title: "Новое",
          progress: "Warning",
          delivery: { counter: 0 },
        },
        {
          id: 1,
          title: "В работе",
          progress: "inProgress",
          delivery: { counter: 0 },
        },
        {
          id: 2,
          title: "Выполнено",
          progress: "Done",
          delivery: { counter: 0 },
        },
      ],
      deliveryInfoWaiting: null,
    };
  },
  props: {
    newDeliveryWaiting: {
      type: Object,
    },
    newDeliveryInProgress: {
      type: Object,
    },
    newDeliveryDone: {
      type: Object,
    },
  },
  watch: {
    newDeliveryWaiting() {
      this.updateMenuData();
    },
    newDeliveryInProgress() {
      this.updateMenuData();
    },
    newDeliveryDone() {
      this.updateMenuData();
    },
  },
  methods: {
    updateMenuData() {
      if (this.newDeliveryWaiting) {
        this.menu[0].delivery = this.newDeliveryWaiting;
      }
      if (this.newDeliveryInProgress) {
        this.menu[1].delivery = this.newDeliveryInProgress;
      }
      if (this.newDeliveryDone) {
        this.menu[2].delivery = this.newDeliveryDone;
      }
      this.selectedOptions(0);
    },
    selectedOptions(id) {
      const options = document.querySelectorAll(".options-button");
      options.forEach((btn, i) => {
        if (i === id) {
          btn.classList.add("active__options");
        } else {
          btn.classList.remove("active__options");
        }
      });
      this.$emit("postTitleDelivery", this.menu[id].progress);

      this.$nextTick(() => {
        let activeMenu = this.menu[id];
        if (activeMenu && activeMenu.delivery) {
          let postDelivery = activeMenu.delivery.value;
          console.log(postDelivery);
          this.$emit("updateDelivery", postDelivery);
        } else {
          console.log("Доставка не найдена", id);
        }
      });
      console.log(this.menu[id]);
    },
  },
  mounted() {
    this.updateMenuData();
  },
};
</script>

<style scoped>
.activity__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.options button {
  padding: 5px 10px;
  font-family: "Montserrat", sans-serif;
  background: none;
  border: 1px solid #cbcbcb;
  border-radius: 10px;
}
.active__options {
  background-color: #66a0d4 !important;
  color: white;
  border: 1px #66a0d4 solid !important;
}
</style>
