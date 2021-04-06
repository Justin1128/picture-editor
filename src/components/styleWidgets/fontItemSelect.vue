<template>
  <el-select v-model="value8" filterable placeholder="请选择" @change="change">
    <el-option v-for="(item,index) in list" :key="item.key" :label="item.text" :value="index"></el-option>
  </el-select>
</template>

<script>
import { fontList } from "@/assets/font-o.js";
import { setFont } from "@/assets/js/psdUtil.js";
export default {
  data() {
    return {
      value8: '',
      list: fontList,
    };
  },
  methods: {
    change(val) {
      let item=this.list[val];
      this.$emit("changeFont", item.key);
      setFont(item.key, item.name);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>