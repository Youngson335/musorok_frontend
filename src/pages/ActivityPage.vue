<template>
  <div class="activity__page" v-loading="loading">
    <SelectedDate @loadingPage="editLoading" />
  </div>
</template>
<script>
import SelectedDate from "../components/SelectedDate.vue";
export default {
  components: { SelectedDate },
  data() {
    return {
      loading: true,
      reload: null,
    };
  },
  methods: {
    editLoading(value) {
      this.loading = value;
    },
  },
};
</script>
<style scoped>
h1 {
  color: black;
  padding: 20px;
}
.activity__page {
  padding: 20px;
  max-height: 600px;
  overflow: scroll;
}
</style>
