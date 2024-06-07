<template>
  <div class="mb-4 buttonEdit">
    <el-button>{{ edit }}</el-button>
  </div>
</template>

<script>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
export default {
  data() {
    return {
      edit: "Изменить",
    };
  },
};
</script>

<style scoped>
.mb-4 {
  width: 100%;
  display: flex;
  justify-content: center;
}
.buttonEdit {
  display: flex;
  justify-content: start !important;
}
.el-button > span {
  font-family: "Montserrat", sans-serif !important;
  color: white;
}
.el-button {
  background-color: rgb(195, 55, 45) !important;
  padding: 10px 10px !important;
}
/* .editBg {
  background-color: rgb(195, 55, 45) !important;
} */
</style>
