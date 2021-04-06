<template>
  <div id="size-control">
    <!-- 上左 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'left-top','nw-resize')"
      :style="{
        left: left + 'px',
        top: top + 'px',
        cursor: 'nw-resize',
      }"
    ></div>
    <!-- 上中 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'top','n-resize')"
      :style="{
        left: left + width / 2 + 'px',
        top: top + 'px',
        cursor: 'n-resize'
      }"
    ></div>
    <!-- 上右 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'right-top','ne-resize')"
      :style="{
        left: left + width + 'px',
        top: top + 'px',
        cursor: 'ne-resize'
      }"
    ></div>
    <!-- 中左 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'left','w-resize')"
      :style="{
        left: left + 'px',
        top: top + height / 2 + 'px',
        cursor: 'w-resize'
      }"
    ></div>
    <!-- 中右 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'right','e-resize')"
      :style="{
        left: left + width + 'px',
        top: top + height / 2 + 'px',
        cursor: 'e-resize'
      }"
    ></div>
    <!-- 下左 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'left-bottom','sw-resize')"
      :style="{
        left: left + 'px',
        top: top + height + 'px',
        cursor: 'sw-resize'
      }"
    ></div>
    <!-- 下中 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'bottom','s-resize')"
      :style="{
        left: left + width / 2 + 'px',
        top: top + height + 'px',
        cursor: 's-resize'
      }"
    ></div>
    <!-- 下右 -->
    <div
      class="square"
      @mousedown.stop="handlemousedown($event, 'right-bottom','se-resize')"
      :style="{
        left: left + width + 'px',
        top: top + height + 'px',
        cursor: 'se-resize'
      }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default: {},
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    orgTop: {
      type: Number,
      default: 0,
    },
    orgLeft: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      top: 0,
      left: 0,

      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      dirs: null,
      target: null,

      //记录每次点击时的位置
      tt: 0,
      ll: 0,
      ww: 0,
      hh: 0,
    };
  },
  methods: {
    handlemousedown(e, val, type) {
      document.body.style.cursor = type;
      console.log(
        "ddddd",
        e.currentTarget.offsetLeft,
        e.currentTarget.offsetTop,
        "--"
      );
      this.tt = this.orgTop;
      this.ll = this.orgLeft;
      this.ww = this.width;
      this.hh = this.height;

      this.target = e.currentTarget;
      this.dirs = val;

      this.startX = e.clientX;
      this.startY = e.clientY;

      this.originX = this.target.offsetLeft;
      this.originY = this.target.offsetTop;
      // 绑定鼠标移动事件
      document.addEventListener("mousemove", this.handlemousemove, true);
      // 取消鼠标移动事件
      document.addEventListener("mouseup", this.handlemouseup, true);
    },
    handlemousemove(e) {
      e.stopPropagation();
      e.preventDefault();
      let nx = e.clientX;
      let ny = e.clientY;
      let nl =
        this.originX +
        (e.clientX - this.startX) * (1/this.$store.state.stageZoom.value);
      let nt =
        this.originY +
        (e.clientY - this.startY) * (1/this.$store.state.stageZoom.value);
      //   this.target.style.left = nl + "px";
      //   this.target.style.top = nt + "px";
      let dir = this.dirs;
      // console.log(nl, nt, "mmmmm");
      let thsT = this.orgTop,
        thsL = this.orgLeft,
        thsW = this.width,
        thsH = this.height;

      switch (dir) {
        case "left-top":
          thsW = this.ww - nl;
          thsH = (thsW / this.ww) * this.hh;
          thsL = this.ll + nl;
          thsT = this.tt - (thsH - this.hh);
          break;
        case "top":
          thsT = this.tt + nt;
          thsH = this.hh - nt;
          break;
        case "right-top":
          thsW = nl;
          thsH = (thsW / this.ww) * this.hh;
          thsT = this.tt - (thsH - this.hh);
          break;
        case "right":
          thsW = nl;
          break;
        case "right-bottom":
          thsW = nl;
          thsH = (thsW / this.ww) * this.hh;
          break;
        case "bottom":
          thsH = nt;
          break;
        case "left-bottom":
          thsL = this.ll + nl;
          thsW = this.ww - nl;
          thsH = (thsW / this.ww) * this.hh;
          break;
        case "left":
          thsW = this.ww - nl;
          thsL = this.ll + nl;
          break;
      }
      // 计算字体比例

      // let size = this.datas._typeTool && (thsW * this.datas._typeTool.font.sizes[0]) / this.ww;
      // console.log("ssssssssssssss", size);
      let size;
      this.$emit("updateSite", { thsT, thsL, thsW, thsH, size });
    },
    handlemouseup() {
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", this.handlemousemove, true);
    },
  },
};
</script>

<style lang="scss" scoped>
.square {
  position: absolute;
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);
  // outline: 1px solid #3b74f1;
  box-sizing: border-box;
  display: block;
  background: #fff;
  border: 1px solid #c0c5cf;
  box-shadow: 0 0 2px 0 rgba(86, 90, 98, 0.2);
}
</style>