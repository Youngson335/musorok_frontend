<template>
  <el-switch
    @click="postStateSwitch"
    v-model="checkSwitch"
    class="mt-2"
    inline-prompt
    :aria-checked="checkSwitch"
    :disabled="getStatusDisabledSwitch"
  />
</template>

<script lang="js">
import { ref } from "vue";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import { mapActions } from "vuex";
// import { Check, Close } from "@element-plus/icons-vue";


export default {
    data() {
        return {
            checkSwitch: false,
            userID: this.tgUserId,
            disabledSwitch: this.getStatusDisabledSwitch,
            emailUser: '',
            updateInfo: this.stateEditInfo,
            notifications_email: null,
        }
    },
    props:{
        tgUserId: {
          type: Number,
        },
        userEmail: {
            type: String,
        },
        stateEditInfo: {
            type: Boolean
        }
    },
    computed: {
        ...mapGetters(['getNotificationDisabled', 'getUserId']),
        getStatusDisabledSwitch() {
            return this.getNotificationDisabled;
        },
    },
methods: {
    ...mapMutations(['updateEmail']),
    ...mapActions(['getStatus']),
    async getStatusSwitch() {
        let response = await fetch(
        `https://musorok.online:8000/client_detail_info/${this.userID}`
        );
        let data = await response.json();
        this.notifications_email = data.notifications_email;
        this.emailUser = data.email;
        // this.disabledSwitch = this.emailUser.trim() === '';
        if(this.notifications_email === 1) {
            this.checkSwitch = true;
          } else if(this.notifications_email === 0) {
            this.checkSwitch = false
          }
        //   if(this.emailUser.trim() === '') {
        //     this.checkSwitch = false
        //     this.disabledSwitch = true
        //   }
    },
    postStateSwitch() {
        console.log(this.checkSwitch);
        fetch(`https://musorok.online:8000/update_notifications/${this.userID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                notifications_email: this.checkSwitch,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при выполнении запроса");
            }
            return response.json();
        })
        .then((data) => {
            this.getStatus();
            console.log("Обновил:", data);
        })
        .catch((error) => {
            console.error("Ошибка при обновлении значений переключения:", error);
            if (error.response && error.response.data && error.response.data.detail) {
                error.response.data.detail.forEach((errorDetail) => {
                    console.error(`Ошибка: ${errorDetail.msg}`);
                });
            }
        });
    },
},

created() {
    this.getStatusSwitch();
}
}
// const value = ref(true);
</script>
<style>
.mt-2 {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 100%;
}
.el-switch.is-checked .el-switch__core {
  background-color: rgb(41, 212, 41) !important;
  border-color: rgb(41, 212, 41) !important;
}
</style>
