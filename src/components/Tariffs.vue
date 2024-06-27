<template>
  <div class="tariffs">
    <div class="tariffs__title">
      <h2>Оформить подписку</h2>
    </div>
    <div class="tariffs__item" v-for="tariff of tariffs">
      <div class="item__name">
        <p>{{ tariff.name }}</p>
        <div class="item__icon">
          <img src="../assets/icons/subscription__icon.svg" />
        </div>
      </div>
      <div class="item__description">
        <p>{{ tariff.description }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tariffs: null,
    };
  },
  computed: {
    ...mapGetters(["getUserId"]),
    userID() {
      return this.getUserId;
    },
  },
  methods: {
    async getTariffsByUserId(id) {
      console.log(id);
      let response = await fetch(
        `https://musorok.online:8000/client_tariffs/${id}`
      );
      let data = await response.json();
      this.tariffs = data.tariffs;
      console.table(this.tariffs);
    },
  },
  mounted() {
    this.getTariffsByUserId(this.userID);
  },
};
</script>
<style>
.tariffs__title {
  margin-bottom: 5px;
  color: #54ba6c;
}
.tariffs__title h2 {
  font-size: 20px;
}
.tariffs__item {
  margin-bottom: 10px;
  border: 1px solid #c5c5c5;
  padding: 5px;
  border-radius: 5px;
  background: #cdcdcd75;
  cursor: pointer;
}
.tariffs {
  margin-bottom: 100px;
}
.item__name {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item__name p {
  font-weight: 600;
}
.item__description {
  font-size: 12px;
}
.item__icon {
  display: flex;
  justify-content: end;
  align-items: center;
}
.item__icon img {
  display: block;
}
</style>
