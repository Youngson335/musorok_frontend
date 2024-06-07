<template>
  <div>
    <keep-alive>
      <NavigationMenu />
    </keep-alive>
    <router-view />
  </div>
</template>
<script>
import NavigationMenu from "./components/NavigationMenu.vue";
export default {
  components: {
    NavigationMenu,
  },
};
</script>
<style lang=""></style>
