<template>
  <div>
    <div
      class="layer"
      :ref="'entity'+i"
      :layer-name="layer.name"
      v-for="(layer,i) in reverseDatas"
      v-if="layer.layer.visible"
      :key="i"
      :style="{
        'width':layer.layer.width+'px',
        'height':layer.layer.height+'px',
        'top':layer.layer.top+'px',
        'bottom':layer.layer.bottom+'px',
        'left':layer.layer.left+'px',
        'right':layer.layer.right+'px',
        'opacity':layer.layer.opacity/255,  
        'mix-blend-mode':layer.layer.blendingMode(), //混合模式
        }"
         @mousedown="e=>selectHandle(e,i)"
    >
      <!-- <span
        v-if="layer.type=='layer' && layer._typeTool"
        class="content-text"
        :style="getStyle(layer._typeTool)"
      >{{layer._typeTool.value}}</span> -->
      <ChildrenText v-if="layer.type=='layer' && layer._typeTool" :datas="layer" />
      <div v-else-if="layer.type=='layer' && !layer._typeTool">
        <img v-if="layer.layer" :src="getBase64(layer)" alt srcset />
      </div>
      <!-- {{layer.depth()}} -->
      <Children v-if="layer._children && layer._children.length>0" :datas="layer._children" />
    </div>
  </div>
</template>

<script>
import {computeFontSize} from '../assets/js/psdUtil.js'
import ChildrenText from './ChildrenText.vue'
import { move } from "../mixins/move.js";

export default {
  name: "Children",
  mixins: [move],

  components:{
    ChildrenText
  },
  props: {
    datas: {
      type: Array,
      default: [],
    },
  },
  computed: {
    reverseDatas() {
      console.log(this.datas, "eeeee");
      return this.datas.reverse();
    },
  },
  created() {
    this.reverseDatas.forEach((element) => {
      console.log(element,element.name)
      try {
        console.log(
          element.typeTool,
          "68888888",
          element.get("typeTool").export()
        );
        // 解析文本信息
        element._typeTool = element.get("typeTool").export();
        // 解析图片
        element._imgBase64 = this.getBase64(element);
      } catch (error) {}
    });
  },
  methods: {
    getStyle(val){
      return {
        'top':val.top+'px',
        'bottom':val.bottom+'px',
        'left':val.left+'px',
        'right':val.right+'px',
        'font-size':computeFontSize(val)+'px',
        'color':this.getRGBA(val.font.colors[0]),
        'text-align':val.alignment && val.alignment[0],//*
        // 'line-height':val.lending[0] //leading
        //lengthArray
        'font-weight':val.weights && val.weights[0]
      }
    },
    getBase64(val) {
      try {
        return val.layer.image.toBase64();
      } catch (error) {
        return "";
      }
      // console.log('vvvv',val.layer.image.toBase64())
    },
    getRGBA(val) {
      return val ? `rgba(${val.join(",")})` : "";
    },
    getM(val) {
      // debugger;
      return val ? `matrix(${Object.keys(val).join(",")})` : "";
    },
    selectHandle(e,i){
      this.initmovement(e,i)
    }
  },
};
</script>

<style scoped lang="scss">
.layer {
  position: absolute;
  // border: 1px solid #000;
  // overflow: hidden;
  .content-text {
    position: absolute;
  }
}
</style>