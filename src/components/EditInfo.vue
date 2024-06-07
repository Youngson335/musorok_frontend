<template>
  <div class="edit__data">
    <div class="data__user">
      <input
        :class="{ noEdit: editInfo }"
        :readonly="editInfo"
        type="text"
        v-model="userFirstName"
        @input="updateName"
      />
    </div>
    <div class="data__user">
      <input
        :class="{ noEdit: editInfo }"
        :readonly="editInfo"
        type="text"
        v-model="userLastName"
        @input="updateLastName"
      />
    </div>
    <div class="data__user">
      <input
        :class="{ noEdit: editInfo }"
        :readonly="editInfo"
        type="text"
        v-model="userEmail"
        placeholder="Введите email"
      />
    </div>
  </div>
  <ButtonEdit
    @click="postEditUserData"
    :editInfo="editInfo"
    @updateParent="editInfo = $event"
  />
</template>
<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";
import ButtonEdit from "./ButtonEdit.vue";
export default {
  components: {
    ButtonEdit,
  },
  data() {
    return {
      userFirstName: this.firstName,
      userLastName: this.lastName,
      userEmail: this.email,
      stateBtn: this.editInfo,
      userId: null,
      statusEmail: null,
    };
  },
  props: {
    editInfo: {
      type: Boolean,
    },
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    email: {
      type: String,
    },
  },

  methods: {
    ...mapMutations(["updateEmail"]),
    ...mapActions(["getStatus"]),
    async postEditUserData() {
      this.$emit("updateParent", this.editInfo);

      await fetch(
        `https://musorok.online:8000/update_client_info/${this.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            first_name: this.userFirstName,
            last_name: this.userLastName,
            email: this.userEmail,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Имя пользователя успешно обновлено на сервере:", data);
          this.getStatus();
        })
        .catch((error) => {
          console.error("Ошибка при обновлении имени на сервере:", error);
        });
      let response = await fetch(
        `https://musorok.online:8000/client_detail_info/${this.userId}`
      );
      let data = await response.json();
      this.statusEmail = data.notifications_email;
      console.log("email", this.statusEmail);
      this.setEmail();
      console.log(data, "запросил");
    },
    setEmail() {
      this.updateEmail(this.statusEmail);
    },
  },
  computed: {
    ...mapGetters(["getUserId"]),
    userTgId() {
      return (this.userId = this.getUserId);
    },
  },
  watch: {
    firstName(newVal) {
      this.userFirstName = newVal;
    },
    lastName(newVal) {
      this.userLastName = newVal;
    },
    email(newVal) {
      this.userEmail = newVal;
    },
    // stateBtn(newVal) {
    //   if (newVal === true) {
    //     this.postEditUserData();
    //   }
    // },
  },
  created() {
    this.userTgId;
    this.setEmail;
  },
};
</script>
<style>
.edit__data {
  display: flex;
  justify-content: start;
  align-items: start;
  flex-direction: column;
  width: 100%;
}
.data__user {
  margin-bottom: 15px;
  width: 100%;
}
.data__user input {
  padding: 3px;
  width: 100%;
  font-size: 15px;
  font-family: "Montserrat", sans-serif;
}
input {
  outline: none;
}
.noEdit {
  color: #abb2ac;
}
</style>
