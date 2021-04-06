<template>
    <!-- contenteditable="true" -->
    <div class="rx"  data-gramm="false"  :style="parseTextStyle(datas)">
      <span class="content-text" v-html="datas.value">{{datas.value}}</span>
      <!-- {{datas.font}} -->
    </div>
</template>
 
<script>
import { parseTextStyle } from "../assets/js/parseUtil.js";

export default {
  props: {
    datas: {
      type: Object,
      default: {},
    },
  },
  watch:{
    datas:{
      deep:true,
      handler:function(n,o){
        // alert(11)
        console.log(n,o,'bian')
      }
    }
  },
  computed:{
    getTextStyle(){
      return this.datas.font.size
    }
  },
  data() {
    return {
      parseTextStyle,
    };
  },
  created(){
    console.log('ahhahaha',this.datas)
  },
  methods:{
    
  }
};
</script>

<style>
.rx{
    position: absolute;
  }
</style>