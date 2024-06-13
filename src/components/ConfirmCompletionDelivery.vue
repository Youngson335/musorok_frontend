<template>
  <transition name="showConfirm">
    <div class="confirm__completion" v-show="showModal">
      <div class="completion__title">
        <h2>
          Завершить активность? Внимание! Данное действие нельзя будет отменить
        </h2>
      </div>
      <div class="completion__btns">
        <div class="btns__cancel" @click="editStateModalConfirm">
          <button>Отменить</button>
        </div>
        <div class="btns__save">
          <button :plain="true" @click="postDataQuestionnaire(getId)">
            Завершить
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ElMessage } from "element-plus";

export default {
  props: {
    showConfirmDelivery: {
      type: Boolean,
    },
    saveID: {
      type: Number,
    },
    questions: {
      type: Array,
    },
  },

  computed: {
    getQuestions() {
      return this.questions;
    },
    showModal() {
      return this.showConfirmDelivery;
    },
    getId() {
      return this.saveID;
    },
  },
  methods: {
    open2() {
      ElMessage({
        message: "Заказ завершен!",
        type: "success",
      });
    },
    editStateModalConfirm() {
      this.$emit("updateStateModalConfirm", false);
    },
    hiddenAllModal() {
      this.$emit("resetModal", false);
    },
    async postDataQuestionnaire(id) {
      let clientId = String(id);
      console.log(id);

      await fetch(`https://musorok.online:8000/save_meeting_questions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: this.getQuestions,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при отправке данных");
          } else return response;
        })
        .then((data) => {
          console.log("Загрузил данные!: ", data);
          this.completeDelivery(clientId);
        })
        .catch((error) => {
          console.error("Произошла ошибка: ", error);
        });
    },
    async completeDelivery(id) {
      await fetch(`https://musorok.online:8000/update_delivery_done/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка при отправке данных");
          } else return response;
        })
        .then((data) => {
          console.log("Обновил статус: ", data);
          this.open2();
        })
        .catch((error) => {
          console.error("Произошла ошибка: ", error);
        });
      this.editStateModalConfirm();
      this.hiddenAllModal();
    },
  },
};
</script>

<style scoped>
.confirm__completion {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 100%;
  height: 30%;
  padding: 20px;
  background: #f3f3f3;
  border: 1px solid #dadada;
  border-radius: 30px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 0 10px 5px rgba(221, 221, 221, 1);
}
.completion__title {
  margin-bottom: 20px;
}
.completion__title h2 {
  font-size: 20px;
  text-align: center;
  line-height: 19px;
}
.completion__btns {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}
.btns__cancel button {
  font-family: "Montserrat", sans-serif;
  border: none;
  padding: 5px 15px;
  font-size: 17px;
  border-radius: 7px;
  background-color: rgb(224, 120, 110);
  color: white;
}
.btns__save button {
  font-family: "Montserrat", sans-serif;
  border: none;
  padding: 5px 15px;
  font-size: 17px;
  border-radius: 7px;
  background-color: rgb(55, 158, 57);
  color: white;
}
.showConfirm-enter-active,
.showConfirm-leave-active {
  transition: all 0.3s ease;
}

.showConfirm-enter-from,
.showConfirm-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.showConfirm-enter-to,
.showConfirm-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
