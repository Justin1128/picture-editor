<template>
  <div id="ref-line">
    <!-- 横线 -->
    <div
      class="horizontal"
      v-for="item in horizontal"
      :key="genID(item)"
      :style="{
        left: item.left+'px',
        top: item.top + 'px',
        width: item.width + 'px'
      }"
    ></div>

    <!-- 竖线 -->
    <div
      class="vertical"
      :key="genID(item)"
      v-for="item in vertical"
      :style="{
        left: item.left+'px',
        top: item.top + 'px',
        height: item.height + 'px'
      }"
    ></div>
  </div>
</template>

<script>
// 组件移动参考线

import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["layersList", "currentLayer", "horizontal", "vertical"]),
  },
  methods: {
    genID(length) {
      return Number(
        Math.random().toString().substr(3, 10000) + Date.now()
      ).toString(36);
    },
  },
};
</script>

<style lang="scss" scoped>
#ref-line {
  position: absolute;
  .vertical {
    position: absolute;
    width: 1px;
    z-index: 999;
    background-color: rgb(253, 66, 255);
  }
  .horizontal {
    position: absolute;
    height: 1px;
    z-index: 999;
    background-color: rgb(253, 66, 255);
  }
}
</style>


