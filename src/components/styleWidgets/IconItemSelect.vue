<template>
  <div class="icon-item-select">
    <ul class="list">
      <el-tooltip
        class="item"
        effect="dark"
        v-for="(item, index) in data"
        :key="index"
        :content="item.tip"
        placement="bottom"
      >
        <li class="list-item" :class="{'active': item.select}" @click="selectItem(item)">
          <i class="iconfont" :class="item.icon"></i>
        </li>
      </el-tooltip>
    </ul>
  </div>
</template>

<script>
// 图标按钮选择组件
const NAME = "icon-item-select";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  props: {
    data: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    selectItem(item) {
      item.select = !item.select;
      this.$emit("finish", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-item-select {
  .list {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: space-around;
    .list-item{
      cursor: pointer;
    }
  }
}
</style>
