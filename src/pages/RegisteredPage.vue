<template lang="">
  <div class="header">
    <h1>Регистрация</h1>
    <img src="../assets/icons/me_geoposition.png" />
  </div>

  <form class="registration--form" action="javascript:void(0);">
    <el-form
      :label-position="labelPosition"
      label-width="auto"
      :model="formLabelAlign"
      action="javascript:void(0);"
    >
      <el-form-item label="Имя">
        <input v-model="formLabelAlign.name" placeholder="Иван" />
      </el-form-item>
      <el-form-item label="Фамилия">
        <input v-model="formLabelAlign.firstName" placeholder="Иванов" />
      </el-form-item>
      <el-form-item label="Номер">
        <div class="form__phone">
          <p>+7</p>
          <input
            placeholder="ХХХХХХХХХХ"
            type="number"
            v-model="formLabelAlign.phone"
            oninput="this.value = this.value.slice(0, 10)"
          />
          <button :disabled="checkPhone" @click="sendPhone">Проверить</button>
        </div>
      </el-form-item>
      <el-form-item label="Адрес">
        <div class="form__address">
          <input v-model="formLabelAlign.region" :placeholder="placeAddress" />
          <button
            v-loading="loading"
            @click="postAddress()"
            :disabled="stateBtnCheckAddress"
          >
            Проверить
          </button>
        </div>
        <p>
          Введите адрес с указанием квартиры (если имеется) и нажмите
          «Проверить»
        </p>
      </el-form-item>
    </el-form>

    <div class="save__info">
      <button
        class="save__info--btn"
        @click="postAllInfo"
        :disabled="stateBtnSaveAllInfo"
      >
        Зарегистрироваться
      </button>
    </div>
    <div class="description">
      <p>
        Регистрируясь в нашем сервисе, вы даёте согласие на обработку
        персональных данных.<a
          href="https://telegra.ph/Politika-v-otnoshenii-obrabotki-personalnyh-dannyh-05-27-2"
          >Политика в отношении обработки персональных данных</a
        >
      </p>
    </div>
  </form>

  <el-dialog v-model="centerDialogVisible" center>
    <span> Ваш адрес: {{ checkAddress }} </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="removeAddress">Нет</el-button>
        <el-button type="primary" @click="saveAddress"> Да </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      labelPosition: "left",
      formLabelAlign: {
        name: "",
        firstName: "",
        region: "",
        phone: "",
      },
      centerDialogVisible: false,
      fullAddress: "",
      placeAddress: "Москва, ул. Арбатская, д. 1, кв. 1",
      loading: false,
      checkAddress: "",
      valuePhone: 914,
      userPhone: null,
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
    userID() {
      return this.getUserId;
    },
    stateBtnCheckAddress() {
      if (this.formLabelAlign.region != "") {
        return false;
      } else {
        this.formLabelAlign.region = "";
        return true;
      }
    },
    stateBtnSaveAllInfo() {
      if (
        this.formLabelAlign.name != "" &&
        this.formLabelAlign.firstName != "" &&
        this.userPhone != null &&
        this.fullAddress != ""
      ) {
        return false;
      } else return true;
    },
    checkPhone() {
      let strPhone = String(this.formLabelAlign.phone);
      if (strPhone.length === 10) {
        return false;
      } else {
        this.userPhone = null;
        return true;
      }
    },
  },
  methods: {
    async postAddress() {
      if (this.formLabelAlign.region != "") {
        this.loading = true;
        try {
          let response = await fetch(
            `https://musorok.online:8000/validate_address`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                address: this.formLabelAlign.region,
              }),
            }
          );
          if (!response.ok) {
            this.loading = false;
            throw new Error("Ошибка отправки запроса");
          }
          let data = await response.json();
          this.checkAddress = data.formatted_address;
          this.loading = false;
          this.centerDialogVisible = true;
          console.log(data.formatted_address);
        } catch {
          console.error("Данные не отправились!");
          this.loading = false;
        }
      }
    },
    sendPhone() {
      let phone = "7";
      this.userPhone = phone + this.formLabelAlign.phone;

      console.log("отправил номер: ", this.userPhone);
    },
    saveAddress() {
      this.centerDialogVisible = false;
      this.fullAddress = this.checkAddress;
    },
    removeAddress() {
      this.formLabelAlign.region = "";
      this.fullAddress = "";
      this.placeAddress = "Москва, ул. Арбатская, д. 1, кв. 1";
      this.centerDialogVisible = false;
    },
    async postAllInfo() {
      console.log("Пользователь зарегестрован!");
    },
  },
};
</script>
<style scoped>
.header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header img {
  width: 70px;
  display: inline-block;
}
.header h1 {
  font-weight: 200;
  text-align: center;
}
.registration--form {
  padding: 20px;
}
input::placeholder {
  font-family: "Montserrat", sans-serif;
  color: rgba(255, 134, 134, 0.64);
}
input:focus-visible {
  outline: 1px solid rgba(0, 0, 0, 0.581);
}
input {
  font-family: "Montserrat", sans-serif;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.261);
  background-color: rgba(229, 229, 229, 0.358);
  padding: 8px;
  border-radius: 5px;
}

.el-form {
  margin-bottom: 50px;
}
.save__info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.save__info--btn {
  font-family: "Montserrat", sans-serif;
  border: none;
  padding: 8px;
  width: 100%;
  text-align: center;
  border-radius: 5px;
  font-size: 15px;
  background-color: #4bb72a85;
  color: white;
}
.save__info--btn:disabled {
  background-color: #4bb72a85;
  color: #757575ab;
}
.el-form-item__content p {
  line-height: 11px;
  font-size: 10px;
}
.form__address {
  border: 1px solid rgba(0, 0, 0, 0.261);
  border-radius: 5px;
  background-color: rgba(229, 229, 229, 0.358);
}
.form__address input {
  border: none;
  background: none;
}
.form__address input:focus-visible {
  outline: none;
}
.form__address input::placeholder {
  font-size: 9px;
}
.form__address button {
  border: none;
  background: none;
  font-family: "Montserrat", sans-serif;
  padding: 8px;
  text-transform: lowercase;
  border-left: 1px solid rgba(0, 0, 0, 0.261);
  background-color: white;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.5);
  border-radius: 10px 5px 5px 10px;
}
.form__address {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form__phone {
  border: 1px solid rgba(0, 0, 0, 0.261);
  border-radius: 5px;
  background-color: rgba(229, 229, 229, 0.358);
}
.form__phone {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form__phone p {
  font-size: 15px;
  padding: 5px;
}
.form__phone input {
  background: none;
  border: none;
  font-size: 15px;
}
.form__phone input:focus-visible {
  outline: none !important;
}
.form__phone input::placeholder {
  font-size: 15px;
}
.form__phone button {
  border: none;
  background: none;
  font-family: "Montserrat", sans-serif;
  padding: 8px;
  text-transform: lowercase;
  border-left: 1px solid rgba(0, 0, 0, 0.261);
  background-color: white;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.5);
  border-radius: 10px 5px 5px 10px;
}
.description p {
  font-size: 10px;
  text-align: center;
}
</style>

<style>
.el-dialog {
  width: calc(100% - 20px) !important;
}
.el-dialog__headerbtn {
  display: none;
}
.dialog-footer button {
  width: 100px;
}
.el-loading-spinner .circular {
  width: 25px !important;
}
.el-loading-mask {
  border-radius: 10px 5px 5px 10px;
  background-color: rgb(255 255 255 / 70%);
}
</style>
