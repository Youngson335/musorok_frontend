<template>
  <div class="user">
    <div class="user__name">
      <h2>{{ userName }}</h2>
    </div>
    <div class="user__surname">
      <h2>{{ userLastName }}</h2>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    userName: {
      type: String,
    },
    userLastName: {
      type: String,
    },
  },
};
</script>
<style>
.user {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}
.user__name {
  margin-right: 5px;
}
</style>
