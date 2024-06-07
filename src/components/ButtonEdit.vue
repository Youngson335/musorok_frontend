<template>
  <div class="mb-4">
    <el-button :class="{ editBg: !editInfo }" @click="clickEdit">{{
      edit
    }}</el-button>
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
      edit: "Редактировать",
      save: "Сохранить",
    };
  },
  props: {
    editInfo: {
      type: Boolean,
    },
  },
  methods: {
    clickEdit() {
      if (this.editInfo === false) {
        this.$emit("updateParent", true);
        this.edit = "Редактировать";
      } else {
        this.$emit("updateParent", false);
        this.edit = "Сохранить";
      }
    },
  },
};
</script>

<style>
.mb-4 {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 15px;
}
.el-button > span {
  font-family: "Montserrat", sans-serif !important;
  color: white;
}
.el-button {
  background-color: rgb(45, 195, 45) !important;
  padding: 18px 15px !important;
}
.editBg {
  background-color: rgb(195, 55, 45) !important;
}
</style>
