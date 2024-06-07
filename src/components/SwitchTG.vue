<template>
  <el-switch
    @click="postStateSwitch"
    v-model="checkSwitch"
    class="mt-2"
    inline-prompt
    :aria-checked="checkSwitch"
  />
</template>

<script lang="js">
import { ref } from "vue";

export default {
    data() {
        return {
            checkSwitch: false,
            userID: this.tgUserId,
            notifications_tg: null,
        }
    },
    props:{
        tgUserId: {
            type: Number,
        }
    },
    computed: {
        // stateSwitch() {
        //   if(this.notifications_tg === 1) {
        //     this.checkSwitch = true;
        //   } else if(this.notifications_tg === 0) {
        //     this.checkSwitch = false
        //   }
        // }
    },
    methods: {
      async getStatusSwitch() {
        let response = await fetch(
        `https://musorok.online:8000/client_detail_info/${this.userID}`
        );
        let data = await response.json();
        this.notifications_tg = data.notifications_tg;
        if(this.notifications_tg === 1) {
            this.checkSwitch = true;
          } else if(this.notifications_tg === 0) {
            this.checkSwitch = false
          }
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
              notifications_tg: this.checkSwitch,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при выполнении запроса");
            }
            return response.json();
        })
        .then((data) => {
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
    }
    },
    mounted() {
      this.stateSwitch;
    },
    created() {
      this.getStatusSwitch()
    }
}
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
