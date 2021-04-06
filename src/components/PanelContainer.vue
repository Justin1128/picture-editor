<template>
  <div>
    <div v-if="getCurrentLayer">
      <div v-if="getCurrentLayer._typeTool">
        <div class="panel-header">文字</div>
        <div class="editor-panel">
          <div>
            <div class="text-common-panel__title">大小</div>
            <el-select v-model="getFontSize" placeholder="请选择">
              <el-option v-for="item in fontSizeList" :key="item" :label="item+'px'" :value="item"></el-option>
            </el-select>
          </div>
          <div>
            <div class="text-common-panel__title">文本样式</div>
            <IconItemSelect class="style-item" :data="styleIconList" @finish="textStyleAction" />
          </div>
          <div>
            <div class="text-common-panel__title">文本内容</div>
            <TextInputArea
              v-model="getCurrentLayer._typeTool.value"
              @finish="(value) => finish('text', value)"
            />
          </div>
          <div>
            <div class="text-common-panel__title">字体</div>
            <fontItemSelect @changeFont="changeFont" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="panel-header">图片</div>
        <div class="editor-panel">
          <div class="text-common-panel__title">上传图片</div>
          <upload-img
            :uploadType="0"
            @postImg="defalutAngleSignImg"
            :initList="[]"
            :tips="'请上传图片'"
            :uploadLimitInfo="''"
          ></upload-img>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="panel-header">全局</div>
      <div class="editor-panel">
        <div class="text-common-panel__title">画布尺寸</div>
        <div class="canvas-view">
          <div class="canvas-view__item">
            <span>{{stageSize.width}}</span>
            <span class="canvas-view__item-label">宽</span>
          </div>
          <div class="canvas-view__item">
            <span>{{stageSize.height}}</span>
            <span class="canvas-view__item-label">高</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextInputArea from "./styleWidgets/TextInputArea";
import IconItemSelect from "./styleWidgets/IconItemSelect";
import fontItemSelect from "./styleWidgets/fontItemSelect";
import UploadImg from "./UploadImg";
import { mapGetters } from "vuex";

export default {
  components: {
    TextInputArea,
    IconItemSelect,
    fontItemSelect,
    UploadImg,
  },
  props: {
    datas: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      fontSize: "",
      fontSizeList: [
        "12",
        "24",
        "26",
        "28",
        "30",
        "34",
        "36",
        "40",
        "44",
        "46",
        "50",
        "60",
        "72",
        "96",
        "106",
        "120",
        "144",
      ],
      styleIconList: [
        {
          key: "fontWeight",
          icon: "iconjiacu",
          tip: "加粗",
          value: ["normal", "bold"],
          select: false,
        },
        {
          key: "fontStyle",
          icon: "iconxieti",
          tip: "斜体",
          value: ["normal", "italic"],
          select: false,
        },
        {
          key: "textDecoration",
          icon: "iconxiahuaxian",
          tip: "下划线",
          value: ["none", "underline"],
          select: false,
        },
        {
          key: "textAlign",
          icon: "iconzuoduiqi",
          tip: "左对齐文本",
          value: "left",
          select: false,
        },
        {
          key: "textAlign",
          icon: "iconjuzhongduiqi",
          tip: "居中对齐文本",
          value: "center",
          select: false,
        },
        {
          key: "textAlign",
          icon: "iconyouduiqi",
          tip: "右对齐文本",
          value: "right",
          select: false,
        },
      ],
      angleSignImgList: [],
    };
  },
  computed: {
    ...mapGetters(["stageSize"]),
    getCurrentLayer() {
      return this.$store.state.currentIndex > -1
        ? this.datas[this.$store.state.currentIndex]
        : null;
    },
    getFontSize: {
      set(val) {
        this.$set(this.getCurrentLayer._typeTool.font.sizes, 0, val);
      },
      get() {
        return this.getCurrentLayer._typeTool.font.sizes[0] + "px";
      },
    },
    toggleImg: {
      set(val) {
        this.$set(this.getCurrentLayer, "imgBase64", val);
      },
      get() {
        return this.getCurrentLayer.imgBase64;
      },
    },
  },
  created() {
    // console.log(this.datas[0].node.type, "-------------");
  },
  watch: {
    // datas: {
    //   deep: true,
    //   handler: function (n, o) {
    //     console.log(n[0].node.type, "???");
    //   },
    // },
  },
  methods: {
    finish(val) {
      console.log(val);
    },
    changeFont(val) {
      this.$set(this.getCurrentLayer._typeTool.font.names, 0, val);
    },
    textStyleAction(item) {
      let val =
        item.key === "textAlign" ? item.value : item.value[item.select ? 1 : 0];
      switch (item.key) {
        case "textAlign":
          this.$set(this.getCurrentLayer._typeTool.font.alignment, 0, val);
          break;
        case "fontWeight":
          this.$set(this.getCurrentLayer._typeTool.font.weights, 0, val);
          break;
        case "fontStyle":
          this.$set(this.getCurrentLayer._typeTool.font.styles, 0, val);
          break;
        case "textDecoration":
          this.$set(this.getCurrentLayer._typeTool.font.textDecoration, 0, val);
          break;
        default:
          break;
      }
    },
    defalutAngleSignImg(val) {
      if (val && val.length > 0) {
        this.getCurrentLayer["imgBase64"] = process.env.VUE_APP_IMG_DOMAIN+val[0].info.res.relativeUrl;
      } else {
        // this.datas.componentData["angleSignImg"] = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 2px solid #eef2f8;
  box-sizing: border-box;
  height: 58px;
  padding-left: 17px;
}
.editor-panel {
  padding: 15px 24px;
  .text-common-panel__title {
    margin: 20px 0 12px;
    height: 17px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #a0a0a0;
  }
  .canvas-view {
    display: flex;
    .canvas-view__item {
      flex: 1;
      height: 40px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #e0e5ea;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #000;
      padding: 0 11px 0 16px;
      margin-right: 8px;
      cursor: pointer;
      .canvas-view__item-label {
        font-size: 12px;
        color: #a0a0a0;
      }
    }
  }
}
</style>