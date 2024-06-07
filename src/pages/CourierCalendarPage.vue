<template>
  <div class="delivery">
    <div class="delivery__title">
      <h1>Календарь оказания услуг</h1>
    </div>
    <CourierCalendar />
  </div>
  <!-- <NavigationMenu /> -->
</template>
<script>
import NavigationMenu from "../components/NavigationMenu.vue";
import CourierCalendar from "../components/CourierCalendar.vue";

export default {
  components: {
    NavigationMenu,
    CourierCalendar,
  },
};
</script>
<style lang="css" scoped>
.delivery {
  padding: 20px;
}
h1 {
  color: black;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>
