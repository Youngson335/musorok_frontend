<template>
  <div class="subscription">
    <div class="subscription__info">
      <h3>Подписка:</h3>
      <div v-if="subscribeDay !== null" class="info__true">
        <p>Активна</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          data-v-ea893728=""
        >
          <path
            fill="currentColor"
            d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
          ></path>
        </svg>
      </div>
      <div v-else class="info__false">
        <p>Не активна</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          data-v-ea893728=""
        >
          <path
            fill="currentColor"
            d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
          ></path>
        </svg>
      </div>
    </div>
    <div v-if="active" class="sub__information">
      <div class="information__date">
        <div class="date__block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
            ></path>
            <path
              fill="currentColor"
              d="M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32"
            ></path>
            <path
              fill="currentColor"
              d="M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32"
            ></path>
          </svg>
          <p>Срок действия: осталось {{ subscribeDay }} дней</p>
        </div>
        <div class="date__block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
            ></path>
          </svg>
          <p>Дата активации: {{ getSubscribeStartDttm }}</p>
        </div>
        <div class="date__block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            data-v-ea893728=""
          >
            <path
              fill="currentColor"
              d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
            ></path>
          </svg>
          <p>Дата окончания: {{ getSubscribeEndDttm }}</p>
        </div>
      </div>
    </div>
    <div v-else class="no__active">
      <p>
        Для оформления подписки воспользуйтесь пунктом меню "Выбрать тариф" в
        телеграмм боте
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      subscribeDay: null,
      getSubscribeEndDttm: null,
      getSubscribeStartDttm: null,
      userID: null,
      active: false,
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
  },
  methods: {
    async getInfoSubscription() {
      let response = await fetch(
        `https://musorok.online:8000/client_info/${this.getUserId}`
      );
      let data = await response.json();
      this.subscribeDay = data.subscribe_days;
      if (data.subscribe_end_dttm) {
        this.getSubscribeEndDttm = data.subscribe_end_dttm.slice(0, 10);
        this.getSubscribeStartDttm = data.subscribe_start_dttm.slice(0, 10);
      }

      if (this.subscribeDay !== null) {
        this.active = true;
      } else {
        this.active = false;
      }
    },
  },
  created() {
    this.getInfoSubscription();
  },
};
</script>
<style lang="css">
.subscription {
  width: 100%;
}
.subscription__info {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 20px;
}
.subscription__info h3 {
  margin-right: 20px;
}
.info__true p {
  color: #1ab81a;
  margin-right: 5px;
  font-size: 20px;
}
.info__true {
  display: flex;
  align-items: center;
}
.info__true svg {
  color: #1ab81a;
  width: 25px;
}

.info__false p {
  color: #ff4e4e;
  margin-right: 5px;
  font-size: 20px;
}
.info__false {
  display: flex;
  align-items: center;
}
.info__false svg {
  color: #ff4e4e;
  width: 25px;
}
.information__date {
  padding: 0 20px;
}
.date__block {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 20px;
}
.date__block svg {
  width: 20px;
  margin-right: 5px;
}
.no__active {
  padding: 0 20px;
  text-align: start;
}
</style>
