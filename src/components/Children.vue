<template>
  <!-- <div id="canvas"> -->
    <div
      class="layout"
      id="layout"
      :style="{
      'width':this.layerWidth+'px',
      'height':this.layerHeiht+'px',
      'transform': `scale(${this.$store.state.stageZoom.value})`
    }"
      @mousemove="layoutMoveHandle"
    >
      <div
        class="layer"
        :class="layer.name"
        :ref="'entity'+i"
        v-for="(layer,i) in datas"
        :key="i"
        :style="{'width':layer.width+'px',
        'height':layer.height+'px',
        'position':'absolute',
        'top':layer.top+'px',
        'bottom':layer.bottom+'px',
        'left':layer.left+'px',
        'right':layer.right+'px',
          'outline': $store.state.currentIndex==i?'1px dashed #000':''
        }"
        @mousedown="selectHandle($event,layer,i)"
        @dblclick="shishiClick($event,layer)"
      >
        <!-- 'opacity':layer.opacity/255, -->

        <ChildrenText v-if="layer._typeTool" :datas="layer._typeTool" />
        <img v-else class="layerImg" style="display:block" :src="layer.imgBase64" />
        <Control
          v-if="$store.state.currentIndex==i"
          :orgTop="layer.top"
          :orgLeft="layer.left"
          :width="layer.width"
          :height="layer.height"
          :datas="layer"
          @updateSite="val=>updateSite(val,layer)"
        />
      </div>
      <Reline />
    </div>
  <!-- </div> -->
</template>

<script>
import ChildrenText from "./ChildrenText.vue";
import Control from "./Control.vue";
import { operation } from "../mixins/operation";
import Reline from "./RefLine";

export default {
  components: {
    ChildrenText,
    Control,
    Reline,
  },
  mixins: [operation],
  props: {
    datas: {
      type: Array,
      default: [],
    },
    layerWidth: {
      type: Number,
      default: 0,
    },
    layerHeiht: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    selectHandle(e, layer, i) {
      this.$store.commit("setCurrentIndex", i);
      this.initmovement(e, layer);
    },
    shishiClick(e, val) {
      console.log("双击", val);
      if (val._typeTool) {
        //文本
        // val._custom._editable = true;
        // this.$set(val,'_editable',true)
      }
      console.log();
    },
    updateSite(val, layer) {
      let { thsT, thsL, thsW, thsH, size } = val;
      layer.width = thsW;
      layer.height = thsH;
      layer.top = thsT;
      layer.left = thsL;
      // set 文本fontsize
      // layer._typeTool && this.$set(layer._typeTool.font.sizes,0,size)
    },
  },
};
</script>

<style scoped lang="scss">
#canvas{
  height: 100%;
}
.layout {
  overflow: hidden;
  position: relative;
  transform-origin: left top;
  .layer {
    display: block;
    position: static;
    .layerImg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>