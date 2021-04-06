<template>
  <div>
    <el-dialog
      custom-class="dialog"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      :fullscreen="true"
    >
      <div class="design-editor">
        <div class="header-container">
          <LayoutHeader />
        </div>
        <div class="aside-container">
          <LayoutAside />
        </div>
        <div class="collapse-container">
          <!-- <LayoutCollapse /> -->
        </div>
        <div class="main-container">
          <el-upload
            v-if="!psdLoaded"
            class="upload-demo"
            drag
            action="#"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :http-request="()=>{}"
            :multiple="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传psd文件，且不超过30mb</div>
          </el-upload>
          <!-- 舞台 -->
          <div class="layers-wrap">
            <div
              class="editor-container"
              :style="{
              width:containerDocument.width*this.$store.state.stageZoom.value+'px',
              height:containerDocument.height*this.$store.state.stageZoom.value+'px',
            }"
            >
              <Children
                :datas="layers"
                :layerWidth="containerDocument.width"
                :layerHeiht="containerDocument.height"
              />
            </div>
          </div>
          <!-- 缩放器 -->
          <StageControl v-if="psdLoaded" @getBestZoom="getBestZoom" />
        </div>
        <div class="panel-container">
          <PanelContainer :datas="layers" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Children from "./Children.vue";
import PanelContainer from "./PanelContainer.vue";
import StageControl from "./StageControl.vue";
import LayoutHeader from "./LayoutHeader.vue";
import LayoutAside from "./LayoutAside";
import LayoutCollapse from "./LayoutCollapse.vue";
import html2canvas from "html2canvas";

let PSD = require("psd");
export default {
  components: {
    Children,
    PanelContainer,
    StageControl,
    LayoutHeader,
    LayoutAside,
    LayoutCollapse,
  },
  data() {
    return {
      psdLoaded: false,
      dialogVisible: true,

      preview: "",
      layers: [],
      containerDocument: {}, //document
    };
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    beforeUpload(file) {
      const isPSD = /\.(psd|PSD)$/.test(file.name);
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isPSD) {
        this.$message.error("上传文件只能是 PSD 格式!");
        return false;
      }
      if (!isLt20M) {
        this.$message.error("上传文件大小不能超过 20MB!");
        return false;
      }
      this.handleFile(file);
    },
    blendData(v1, v2) {
      for (let i = 0; i < v2.length; i++) {
        v2[i].text && (v1[i].text = v2[i].text);
        if (v1[i].children && v1[i].children.length > 0) {
          this.blendData(v1[i], v2[i]);
        }
      }
    },
    handleFile(file) {
      const url = this.getObjectUrl(file);
      console.log("url", url);
      PSD.fromURL(url).then((psd) => {
        // console.log(psd.image, "image", psd.tree());
        // console.log(psd.tree().export(), "tree");
        // console.log(psd);
        // console.log(psd.image.toBase64);

        //记录舞台信息
        this.containerDocument = psd.tree().export().document;
        this.$store.commit("setStage", this.containerDocument);

        //海报图片封面
        this.preview = psd.image.toBase64();

        let copyLayers = [];
        psd.layers.forEach((element) => {
          //底部bottom
          try {
            this.$set(
              element,
              "bottom",
              this.containerDocument.height - element.bottom
            );
            // 图片
            element.node &&
              this.$set(
                element,
                "imgBase64",
                element.node.layer.image.toBase64()
              );
            // 导出layer信息
            this.$set(element, "_export", element.export());
            // 导出文本信息
            this.$set(
              element,
              "_typeTool",
              element.node.get("typeTool").export()
            );
            // 自定义数据
            element._custom = {
              editable: false,
            };
          } catch (error) {
            console.log("error");
          }
          //copy item
          let copy = {
            imgBase64: element.imgBase64,
            _export: element._export,
            _typeTool: element._typeTool,
            _custom: element._custom,
            top: element.top,
            right: element.right,
            bottom: element.bottom,
            left: element.left,
            visible: element.visible,
            name: element.name,
            opacity: element.opacity,
            layerEnd: element.layerEnd,
            width: element.width,
            height: element.height,
          };
          copyLayers.push(copy);
        });
        // 存入图层队列
        this.layers = copyLayers.filter((element) => element.visible).reverse();
        this.$store.commit("setLayersList", this.layers);
        console.log("图层列表==>", this.layers);

        this.psdLoaded = true;
        this.getBestZoom();
      });
    },
    copyLayers(data) {
      return data.map((item) => {
        return ({ imgBase64 = "123" } = item);
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
    // 计算最佳宽高
    getBestZoom() {
      let dom = document.getElementsByClassName("layers-wrap")[0];
      let min = Math.min(
        dom.offsetWidth / (this.containerDocument.width + 62 * 2),
        dom.offsetHeight / (this.containerDocument.height + 62 * 2)
      );
      min < 1 && this.$store.commit("setStageZoom", min);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  border: 1px solid;
}
.dialog {
  /deep/ .el-dialog__headerbtn {
    z-index: 100;
  }
  .design-editor {
    .header-container {
      position: absolute;
      right: 0;
      box-sizing: initial;
      top: 0px;
      left: 0px;
      height: 54px;
      display: flex;
      justify-content: left;
      flex-direction: row;
      align-items: center;
      background-color: #fff;
      border-bottom: 1px solid #eef2f8;
      // z-index: -10;
    }
    .aside-container {
      position: absolute;
      top: 55px;
      left: 0px;
      width: 65px;
      bottom: 0;
      padding-top: 6px;
      background-color: #fff;
      box-sizing: border-box;
      .aside-item {
        padding: 12px 0;
      }
    }
    .main-container {
      overflow: auto;
      background-color: #eef2f8;
      bottom: 0;
      z-index: 0;
      transition: left 0.15s ease;
      position: absolute;
      box-sizing: initial;
      top: 55px;
      left: 65px;
      right: 276px;
      .upload-demo {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
        z-index: 10;
        left: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        width: 360px;
      }
      .layers-wrap {
        width: 100%;
        height: 100%;
        overflow: auto;
        .editor-container {
          position: relative;
          margin: 0 auto;
          padding: 30px;
        }
      }
    }
    .panel-container {
      text-align: left;
      position: absolute;
      top: 55px;
      right: 0px;
      width: 276px;
      bottom: 0;
      width: 276px;
      background: #fff;
      overflow: auto;
      box-sizing: initial;
      transition: width 0.15s ease;
    }
  }
}
</style>