<template lang="">
  <div v-loading="confirmLoad" v-if="validUser === true">
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
          <input v-model="formLabelAlign.firstName" placeholder="Иван" />
        </el-form-item>
        <el-form-item label="Фамилия">
          <input v-model="formLabelAlign.lastName" placeholder="Иванов" />
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
            <button
              v-loading="loadPhone"
              :disabled="checkPhone"
              plain
              :plain="true"
              @click="sendPhone"
            >
              Проверить
            </button>
          </div>
        </el-form-item>
        <el-form-item label="Адрес">
          <div class="form__address">
            <input
              v-model="formLabelAlign.region"
              :placeholder="placeAddress"
            />
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
          v-loading="loadAllData"
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

    <el-dialog
      v-model="dialTheNumber"
      width="500"
      destroy-on-close
      center
      class="modal__confirm"
    >
      <h4>Подтверждение номера при регистрации</h4>
      <div class="form__code">
        <input
          v-model="formLabelAlign.sms"
          placeholder="Введите код"
          oninput="this.value = this.value.slice(0, 6)"
        />
        <button v-loading="loadSMS" :disabled="checkSMS" @click="postSMSCode">
          Отправить
        </button>
      </div>
    </el-dialog>
  </div>
  <div v-else class="not_userValid">Доступ запрещен 403</div>
</template>

<script>
import { mapGetters } from "vuex";
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      labelPosition: "left",
      formLabelAlign: {
        lastName: "",
        firstName: "",
        region: "",
        phone: "",
        sms: "",
      },
      centerDialogVisible: false,
      fullAddress: "",
      placeAddress: "Москва, ул. Арбатская, д. 1, кв. 1",
      loading: false,
      checkAddress: "",
      valuePhone: 914,
      userPhone: null,
      dialTheNumber: false,
      loadPhone: false,
      loadAllData: false,
      loadSMS: false,
      geoData: null,
      initialPhone: null,
      showBtnSMS: false,
      showInputSMS: false,
      showCallPhone: true,
      callStatus: null,
      updatePhoneStatus: null,
      confirmLoad: false,
      validUser: true,
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getUserTgName", "getValidationClient"]),
    validationClient() {
      return this.getValidationClient;
    },
    userID() {
      return this.getUserId;
    },
    userTgName() {
      return this.getUserTgName;
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
        this.formLabelAlign.firstName != "" &&
        this.formLabelAlign.lastName != "" &&
        this.initialPhone != null &&
        this.fullAddress != ""
      ) {
        return false;
      } else return true;
    },
    checkPhone() {
      let strPhone = String(this.formLabelAlign.phone);
      if (this.callStatus === "pincode_ok") {
        return true;
      }
      if (strPhone.length === 10) {
        this.showCallPhone = true;
        this.showInputSMS = false;
        return false;
      } else {
        this.userPhone = null;
        return true;
      }
    },
    checkSMS() {
      let strSMS = String(this.formLabelAlign.sms);
      if (strSMS.length === 6) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    async getInfoValidateUser() {
      await fetch(`https://musorok.online:8000/validate_client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: this.validationClient,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка валидации пользователя");
          } else {
            return response;
          }
        })
        .then((data) => {
          console.log("Валидация прошла", data);
          return data.json();
        })
        .then((jsonData) => {
          // this.validUser = jsonData.valid;
          // console.log(this.validUser);
        })
        .catch((err) => {
          console.error("Произлшла ошибка валидации, ", err);
        });
    },
    showSMSButton(boolean) {
      this.showBtnSMS = boolean;
    },
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
          this.geoData = data;
          console.log(this.geoData);

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
    async sendPhone() {
      this.loadPhone = true;
      let phone = "7";
      this.userPhone = phone + this.formLabelAlign.phone;

      if (this.callStatus === null) {
        await fetch(
          `https://musorok.online:8000/phone_calls/initiate_check_call/`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: this.userPhone,
              client_id: this.userID,
            }),
          }
        )
          .then((response) => {
            if (!response.ok) {
              ElMessage.error("Ошибка номера!");
              this.loadPhone = false;
              this.callStatus = null;
              throw Error("Произошли ошибка запроса!");
            } else return response;
          })
          .then((data) => {
            console.log("Данные отправлены!", data);
            this.loadPhone = false;
            this.dialTheNumber = true;
            this.phoneConfirmationBySms();
          })
          .catch((error) => {
            ElMessage.error("Произошла системная ошибка!");
            this.loadPhone = false;
            console.error("Произошла ошибка!", error);
          });
      } else {
        this.loadPhone = false;
        this.dialTheNumber = true;
      }
      if (this.callStatus !== "pincode_ok") {
        this.confirmTheNumber();
      } else {
        console.log("прекратил вывод!");
      }
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
      this.loadAllData = true;
      let prob = {
        client_id: this.userID,
        first_name: this.formLabelAlign.firstName,
        last_name: this.formLabelAlign.lastName,
        username: this.userTgName,
        number_phone: this.initialPhone,
        geo: this.geoData,
      };
      console.log(prob);
      console.log(JSON.stringify(prob));
      await fetch(`https://musorok.online:8000/register_user`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.userID,
          first_name: this.formLabelAlign.firstName,
          last_name: this.formLabelAlign.lastName,
          username: this.userTgName,
          number_phone: this.initialPhone,
          geo: this.geoData,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            this.loadAllData = false;
            ElMessage.error("Ошибка регистрации!");
            throw new Error("Ошибка отправки запроса!");
          } else return response;
        })
        .then((data) => {
          console.log("Данные отправлены!", data);
          this.loadAllData = false;
          ElMessage.success("Вы зарегистрированы!");
          window.location.reload();
        })
        .catch((error) => {
          this.loadAllData = false;
          ElMessage.error("Произошла ошибка!");
          console.error("Проищошла ошибка:", error);
        });
    },
    async phoneConfirmationBySms() {
      const id = String(this.userID);

      await fetch(`https://musorok.online:8000/phone_sms/send/`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: this.userPhone,
          client_id: id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            ElMessage.error("Ошибка получения смс!");
            throw new Error("Ошибка получения смс!");
          } else return response;
        })
        .then((data) => {
          console.log("запрос отправлен!", data);
          this.showCallPhone = false;
          this.showInputSMS = true;
        })
        .catch((error) => {
          ElMessage.error("Ошибка запроса смс!");
          console.error("Произошла системная ошибка!", error);
        });
    },
    async postSMSCode() {
      this.loadSMS = true;
      this.confirmLoad = true;
      const id = String(this.userID);
      const code = this.formLabelAlign.sms;
      await fetch(`https://musorok.online:8000/phone_sms/verify/`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: this.userPhone,
          client_id: id,
          verification_code: this.formLabelAlign.sms,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            this.loadSMS = false;
            ElMessage.error("Ошибка подтверждения номера!");
            this.confirmLoad = false;
            throw new Error("Ошибка подтверждения номера!");
          } else return response;
        })
        .then((data) => {
          this.loadSMS = false;
          console.log("Номер подтвержден!", data);
          this.callStatus = "pincode_ok";
          this.confirmLoad = false;
          ElMessage.success("Номер подтвержден!");
          this.initialPhone = this.userPhone;
          this.dialTheNumber = false;
        })
        .catch((err) => {
          this.loadSMS = false;
          this.confirmLoad = false;
          ElMessage.error("Ошибка подтверждения номера!");
          console.error("Ошибка подтверждения номера!", err);
        });
    },
    confirmTheNumber() {
      console.log(this.userTgName);
      let prob = {
        phone: this.userPhone,
        id: this.userID,
      };
      console.log(prob);

      let confirmNumber = setInterval(async () => {
        try {
          let response = await fetch(
            `https://musorok.online:8000/phone_calls/check_check_call_status/`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone: this.userPhone,
                client_id: this.userID,
              }),
            }
          );

          if (!response.ok) {
            console.log("Ошибка запроса");
            this.callStatus = null;
            clearInterval(confirmNumber);
            return;
          }

          let data = await response.json();
          if (this.callStatus === "pincode_ok") {
            this.callStatus === "pincode_ok";
          } else {
            this.callStatus = data.status;
            console.log("получил данные!", data);
            this.updatePhoneStatus = data.status;
            if (data.status === "expires") {
              this.callStatus = null;
            }
            if (data.status == "pincode_ok") {
              console.log("подтвердил", data);
              this.initialPhone = this.userPhone;
              this.callStatus = "pincode_ok";
              ElMessage.success("Номер подтвержден!");
              clearInterval(confirmNumber);
              this.dialTheNumber = false;
            }
          }
        } catch (err) {
          console.log(err);
          clearInterval(confirmNumber);
        }
      }, 3000);
    },
  },
  created() {
    this.getInfoValidateUser();
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
  width: 100%;
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
  width: 100%;
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
.form__code {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: showBtnSMS-11a8829b 0.3s ease;
}
.form__code p {
  font-size: 15px;
  padding: 5px;
}
.form__code input {
  background: none;
  border: none;
  border-bottom: 1px solid gray;
  font-size: 15px;
  border-radius: 0px;
  text-align: center;
  width: 50%;
  margin-bottom: 15px;
}
.form__code input:focus-visible {
  outline: none !important;
}
.form__code input::placeholder {
  font-size: 15px;
  color: rgba(0, 0, 0, 0.38);
}
.form__code button {
  font-family: "Montserrat", sans-serif;
  padding: 8px;
  text-transform: lowercase;
  background-color: #ffb651;
  border: none;
  border-radius: 20px;
}

.description p {
  font-size: 10px;
  text-align: center;
}
a {
  color: blue;
}
h4 {
  text-align: center;
  line-height: 13px;
  margin-bottom: 10px;
}
.modal__confirm p {
  text-align: center;
  margin-bottom: 10px;
}
.confirm__phone {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.confirm__phone button {
  border: none;
  padding: 5px 10px;
  font-size: 18px;
  border-radius: 5px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: #606266;
  margin-bottom: 10px;
}
.confirm__sms {
  animation: showBtnSMS 0.3s ease;
}

@keyframes showBtnSMS {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
.not_userValid {
  text-align: center;
  display: flex;
  height: 60vh;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
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
.el-dialog__header {
  display: none;
}
</style>
