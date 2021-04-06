<template>
  <div class="header-group">
    <div class="header-wrap">
      <div class="left">
        <div class="name">智能海报</div>
        <div class="history">
          <i class="iconfont iconreturn" @click="returnHandle(0)"></i>
          <i class="iconfont iconreturn" @click="returnHandle(1)"></i>
        </div>
      </div>
      <div class="btns">
        <i class="iconfont iconshuoming" v-popover:popover1></i>
        <el-button type="primary" @click="drawImg">保存图片</el-button>
        <!-- <el-button type="danger" @click="$emit(`handleClose`)">退出</el-button> -->
      </div>
    </div>
    </el-popover>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      canvasOpts: {
        allowTaint: false, // 否允许跨源图像污染画布
        backgroundColor: null, // 解决生成的图片有白边
        useCORS: true, // 如果截图的内容里有图片,解决文件跨域问题
        scale: 3,
      },
    };
  },
  methods: {
    returnHandle(index) {
      console.log(index);
      
    },
    drawImg() {
      this.$store.state.currentIndex = -1;
      this.$nextTick(() => {
        let dom = document.querySelector(`#layout`);
        let copyDom = dom.cloneNode(true);
        copyDom.style.transform = "";
        document.body.appendChild(copyDom);
        html2canvas(copyDom, this.canvasOpts)
          .then((canvas) => {
            if (canvas) {
              let imgData = canvas.toDataURL("image/png");
              // 下载后的问题名
              let filename = "psd.png";
              // download
              this.saveImg(imgData, filename);
              document.body.removeChild(copyDom);
            }
          })
          .catch((e) => {});
      });
    },
    saveImg(data, filename) {
      let save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      save_link.href = data;
      save_link.download = filename;

      let event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      save_link.dispatchEvent(event);
      this.$message({
        message: "已保存图片到本地！",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-group {
  width: 100%;
}
.header-wrap {
  width: 100%;
  //   margin-right: 20px;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    .history {
      width: 100px;
      justify-content: space-evenly;
      &::before {
        content: "";
        height: 65%;
        width: 1px;
        background: #000;
      }
      display: flex;
      align-items: center;
      margin-left: 8px;
      .iconfont {
        font-size: 30px;
        cursor: pointer;
      }
      .iconfont:last-child {
        transform: scaleX(-1);
      }
    }
  }
  .name {
    margin-left: 20px;
    text-shadow: #000 1px 0 0, #000 0 1px 0, #000 -1px 0 0, #000 0 -1px 0;
    font-size: 25px;
    font-weight: bold;
    color: white;
    line-height: 40px;
  }
  .btns {
    margin-right: 20px;
    display: flex;
    align-items: center;
    .iconshuoming {
      cursor: pointer;
      font-size: 20px;
      margin-right: 20px;
    }
  }
}
</style>