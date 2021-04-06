<template>
  <div class="hello">
    <el-upload
      class="upload-demo"
      drag
      action="#"
      :before-upload="beforeUpload"
      :http-request="handleFile"
      :show-file-list="false"
      :multiple="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传psd文件，且不超过30mb</div>
    </el-upload>
    <!-- <img v-if="preview" style="width:100%" :src="preview" /> -->
    <h1>图层：</h1>


    <!-- <Children :datas="layers" :layerWidth="containerDocument.width" :layerHeiht="containerDocument.height"/> -->
    

    <!-- 递归 -->
    <!-- <div class="cont"
    :style="{
      'width':containerDocument.width+'px',
      'height':containerDocument.height+'px',
    }">
        <Children :datas="treeChildren"/>
    </div>-->
    <PsdLayout/>
  </div>
</template>

<script>
import Children from "./Children.vue";
import PsdLayout from "./PsdLayout.vue"

// import PSD from 'psd.js/dist/psd.min'
let PSD = require("psd");
export default {
  components: {
    Children,
    PsdLayout
  },
  name: "Psd",
  props: {
    msg: String,
  },
  data() {
    return {
      preview: "",
      layers: [],
      containerDocument: {}, //document
      treeChildren: [],
    };
  },
  methods: {
    beforeUpload(file) {
      // debugger
      const isPSD = file.type === "image/vnd.adobe.photoshop";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isPSD) {
        this.$message.error("上传头像图片只能是 PSD 格式!");
      }
      if (!isLt20M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }

      this.handleFile(file);
      return isPSD && isLt20M;
    },
    blendData(v1, v2) {
      for (let i = 0; i < v2.length; i++) {
        v2[i].text && (v1[i].text = v2[i].text);
        if (v1[i].children && v1[i].children.length > 0) {
          this.blendData(v1[i], v2[i]);
        }
      }
    },
    handleFile(f) {
      // debugger
      // console.log(f.file)
      let file = f;
      const url = this.getObjectUrl(file);
      console.log("url", url);
      // let _this = this;
      PSD.fromURL(url).then((psd) => {
        // debugger
        console.log(psd.image, "image", psd.tree());
        console.log(psd.tree().export(), "tree");
        console.log(psd);
        console.log(psd.image.toBase64);

        this.containerDocument = psd.tree().export().document;
        this.treeChildren = psd.tree().children();

        let rv = psd.image.toBase64();
        this.preview = rv;

        psd.layers.forEach((element) => {
          console.log(element, element.name, element.text);
          try {
            element.node && (element.imgBase64 = element.node.layer.image.toBase64());
            // 导出layer信息
            this.$set(element,'_export', element.export())
            // 导出文本信息
            this.$set(element,'_typeTool', element.node.get("typeTool").export())
            // 自定义数据
            element._custom={
              editable:false
            };
          } catch (error) {
            console.log("3333");
          }
          //  element.imgBase64=element.image.toPng()
        });

        this.layers = psd.layers.filter((element) => element.visible).reverse();
        // this.layers=psd.layers

        //    debugger
        console.log("----------", this.layers);

        // let layers = psd.layers
        // let imgs = []
        // for (let index = 0; index < layers.length; index++) {
        //   const layer = layers[index];
        //   if(layer.visible){
        //     imgs.push(layer.image.toBase64())
        //   }
        // }
        // this.layers = imgs
      });
    },
    getObjectUrl(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      }
      return url;
    },
    toBase64Image() {},
  },
};
</script>


<style scoped lang="scss">
.hello {
  .con {
    overflow: hidden;
    // border: 1px solid #000;
    position: relative;
  }
  .layers {
    overflow: hidden;
    // border: 1px solid #000;
    position: relative;
  }
}
</style>
