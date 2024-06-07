<template>
  <div class="delivery">
    <div class="delivery__title">
      <h1>График выноса мусора</h1>
    </div>
    <Calendar />
  </div>
  <!-- <NavigationMenu /> -->
</template>
<script>
import Calendar from "../components/Calendar.vue";
import NavigationMenu from "../components/NavigationMenu.vue";

export default {
  components: {
    Calendar,
    NavigationMenu,
  },
};
</script>
<style lang="css" scoped>
.delivery {
  padding: 20px;
}
h1 {
  color: black;
  font-size: 25px;
  margin-bottom: 20px;
}
</style>
