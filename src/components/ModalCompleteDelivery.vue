<template>
  <div
    class="modal__delivery"
    v-show="stateModalComplete"
    @click="hiddenModal($event)"
  >
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
      <div class="dynamics__info" v-for="question in client.scenario_elements">
        <p>{{ question.element_name }}</p>
        <div
          class="upload__photo"
          v-if="question.element_type === 'photo_upload'"
        >
          <el-upload
            v-loading="loading"
            :file-list="fileListMap[client.id[0]]"
            :key="client.id"
            :http-request="
              (file) => uploadFile(file, client.id, question.ordinal)
            "
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            multiple
            accept="image/*"
          >
            <el-button type="primary">Загрузить фото</el-button>
          </el-upload>
        </div>
        <div class="info__problem" v-if="question.element_type === 'dropdown'">
          <el-select
            v-model="selectedValues[question.ordinal]"
            placeholder="Выберите вариант"
            size="large"
            style="width: 240px"
          >
            <el-option
              v-for="item in question.options"
              :key="question.ordinal"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>
      <div class="complete">
        <button @click="completeDelivery(checkId)">Завершить</button>
      </div>
    </div>

    <ConfirmCompletionDelivery
      class="modal__confirm"
      :showConfirmDelivery="showConfirmDelivery"
      @resetModal="resetModal"
      @updateStateModalConfirm="updateStateModalConfirm"
      :saveID="saveID"
      @hiddenModal="hiddenModal"
    />
  </div>
</template>

<script>
import ConfirmCompletionDelivery from "./ConfirmCompletionDelivery.vue";
import { ElMessage } from "element-plus";
import { mapGetters } from "vuex";

export default {
  components: {
    ConfirmCompletionDelivery,
  },
  data() {
    return {
      infoDelivery: this.clickedInfoUser,
      activeId: null,
      showConfirmDelivery: false,
      saveID: null,
      selectedValues: {},
      fileListMap: {},
      loading: false,
    };
  },
  props: {
    clickedInfoUser: {
      type: Object,
      required: true,
    },
    stateModalComplete: {
      type: Boolean,
    },
  },
  computed: {
    checkInfoUser() {
      return this.clickedInfoUser;
    },
    checkId() {
      this.saveID = this.clickedInfoUser.clickedInfo.id;
      return this.clickedInfoUser.clickedInfo.id;
    },
  },
  methods: {
    ...mapGetters(["getUserId"]),

    async uploadFile(options, clientId, ordinal) {
      const { file } = options;
      const form = new FormData();
      console.log(this.getUserId());
      const filePath = `meetings_file/${clientId}_${this.getUserId()}_${ordinal}.jpg`;
      form.append("files", file, filePath);
      this.loading = true;
      const AUTH_TOKEN = import.meta.env.VITE_APP_AUTH_TOKEN;
      try {
        const response = await fetch(
          "https://api.timeweb.cloud/api/v1/storages/buckets/306097/object-manager/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
            body: form,
          }
        );

        if (response.ok) {
          console.log(response);
          ElMessage.success("Файл успешно загружен!");
          this.loading = false;
          // Обновление списка файлов для текущего клиента
          if (!this.fileListMap[clientId]) {
            this.fileListMap[clientId] = [];
          }
          this.fileListMap[clientId].push(file);
          console.log(this.fileListMap);
        } else {
          ElMessage.error("Ошибка загрузки файла.");
        }
      } catch (error) {
        console.error("File upload error:", error);
        ElMessage.error("Произошла ошибка");
        this.loading = false;
      }
    },
    handleRemove(uploadFile, uploadFiles) {
      console.log(uploadFile, uploadFiles);
    },
    handlePreview(file) {
      console.log(file);
    },
    resetModal(boolean) {
      this.$emit("resetModals", boolean);
    },
    hiddenModal(boolean) {
      this.showConfirmDelivery = boolean;
    },
    updateStateModalConfirm(boolean) {
      this.showConfirmDelivery = boolean;
    },
    hiddenModal(event) {
      const modalConfirm = document.querySelector(".modal__confirm");
      if (event === modalConfirm || event.target.nodeName != "BUTTON") {
        this.showConfirmDelivery = false;
      }
    },
    toHome() {
      this.$emit("editStateModal", false);
      this.$emit("updateData", true);
    },

    completeDelivery(id) {
      this.showConfirmDelivery = true;
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
  z-index: 30;
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
.complete button {
  font-family: "Montserrat", sans-serif;
  border: none;
  padding: 10px 25px;
  font-size: 17px;
  border-radius: 7px;
  background-color: rgb(55, 158, 57);
  color: white;
}
.complete {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
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
  margin-bottom: 20px;
}
.detail__info p {
  font-weight: 700;
}
.detail__info span {
  font-weight: 400;
}
.dynamics__info {
  margin-bottom: 20px;
}
.dynamics__info p {
  margin-bottom: 10px;
}
.el-upload-list--picture .el-upload-list__item {
  padding: 5px !important;
}
</style>
