<template>
  <!-- 图片上传组件 -->
  <div class="uploadImg">
    <div class="addFile flex">
      <div class="cont flex">
        <div class="list" v-for="(item,index) in allImgList" :key="index">
          <div class="item" v-if="item.info.type=='success'">
            <template v-if="item.info.res.fileType=='image'">
              <div class="img">
                <img :src="item.info.res.absoluteUrl" alt />
              </div>
            </template>
            <template v-else-if="item.info.res.fileType=='video'">
              <div class="video">
                <video
                  :src="item.info.res.absoluteUrl"
                  :poster="item.info.res.absoluteUrl|addPoster"
                ></video>
                <i class="el-icon-video-play"></i>
              </div>
            </template>
          </div>
          <el-progress v-else :width="60" type="circle" :percentage="item.info.progress"></el-progress>
          <div class="up">
            <input class="upLoad" type="file" @input="e=>{toInput(e,index)}" :multiple="false" />
          </div>
          <div class="removeBtn" @click="removeFile(index)" v-if="item.info.type=='success'">
              <i class="iconfont iconshanchu1"></i>
          </div>
        </div>
      </div>
      <div class="uploadFile avatar-uploader" v-if="allImgList.length<uploadNumber">
        <input class="upLoad" type="file" @input="e=>{toInput(e)}" multiple />
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </div>
    <div class="msg">
      <span class="tips">{{tips}}</span>
      <span class="uploadLimitInfo">{{uploadLimitInfo}}</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { _ossDT, stopUpdate } from "@/assets/js/ossUtil.js";
export default {
  name: "uploadImg",
  props: {
    //0图片、1视频、2图片和视频
    uploadType: {
      type: Number,
      default: 0,
    },
    // 一次上传限制数量
    uploadNumber: {
      type: Number,
      default: 1,
    },
    // 初始化
    initList: {
      type: Array,
      default: () => [],
    },
    // 建议
    tips: {
      type: String,
      default: "",
    },
    uploadLimitInfo: {
      type: String,
      default: "",
    },
    // 图片限制
    imgLimit: {
      tpye: Number,
      default: 2,
    },
    // 视频限制
    videoLimit: {
      tpye: Number,
      default: 10,
    },
  },
  data() {
    return {
      allImgList: [],
      isLoading: [], //正在上传
      currentChangeIndex: -1, //修改文件的索引
    };
  },
  components: {},
  computed: {},
  created() {
    // 回显列表传入数组  解构为需要的对象 item添加该项为回显项
    if (this.initList.length > 0) {
      this.allImgList = this.initList;
      // for (let i = 0; i < this.initList.length; i++) {
      //   this.allImgList.push({
      //     info: {
      //       progress: 100,
      //       res: {
      //         fileType: "image",
      //         relativeUrl: this.initList[i],
      //       },
      //       type: "success",
      //     },
      //   });
      // }

      console.log(this.allImgList,'this.allImgList')
    }
  },
  filters: {
    addPoster(val) {
      return val + "?x-oss-process=video/snapshot,t_1,m_fast";
    },
  },
  watch: {
    initList(newv) {
      if (newv.length > 0) {
        this.allImgList = newv;
      }
    },
    allImgList: {
      handler(newName, oldName) {
        if (newName) {
          let successList = this.allImgList.every((item) => {
            return item.info.type == "success";
          });
          console.log(successList, "------successList");
          if (successList == true) {
            this.$emit("postImg", this.allImgList);
          }
        }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      // immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    toInput(e, index) {
      if (typeof index == "number") {
        this.currentChangeIndex = index;
      } else {
        this.currentChangeIndex = -1;
      }
      console.log(
        this.currentChangeIndex != -1 ? "替换" : "上传",
        this.currentChangeIndex
      );
      let _this = this;
      this.isLoading = this.allImgList.filter((item, index) => {
        return item.info.type == "conduct";
      });
      if (this.isLoading && this.isLoading.length > 0) {
        return this.$message.info("已有文件正在上传");
      }
      // 上传
      let upList = Object.values(e.target.files);
      if (!upList) return;
      if (this.uploadType == 1) {
        let limitFlag = false;
        let limitSize = false;
        upList.filter((item) => {
          if (this.getFileType(item.name) != "video") {
            limitFlag = true;
          }
          if (item.size / 1024 / 1024 > this.videoLimit) {
            limitSize = true;
          }
        });
        if (limitFlag) {
          return this.$message.info("请上传视频");
        }
        if (limitSize) {
          return this.$message.info(`上传的视频不可超过${this.videoLimit}M`);
        }
      } else if (this.uploadType == 2) {
        let limitFlag = false;
        upList.filter((item) => {
          if (
            this.getFileType(item.name) != "image" &&
            this.getFileType(item.name) != "video"
          ) {
            limitFlag = true;
          }
        });
        if (limitFlag) {
          return this.$message.info("请上传图片或视频");
        }
      } else {
        let limitFlag = false;
        let limitSize = false;
        upList.filter((item) => {
          if (this.getFileType(item.name) != "image") {
            limitFlag = true;
          }
          if (item.size / 1024 / 1024 > this.imgLimit) {
            limitSize = true;
          }
        });
        if (limitFlag) {
          return this.$message.info("请上传图片");
        }
        if (limitSize) {
          return this.$message.info(`上传的图片不可超过${this.imgLimit}M`);
        }
      }
      // 切换资源不校验上限
      if (
        upList.length + this.allImgList.length > this.uploadNumber &&
        this.currentChangeIndex == -1
      ) {
        let upType = "张图片";
        if (this.uploadType == 1) {
          upType = "个视频";
        } else if (this.uploadType == 2) {
          upType = "个图片或视频";
        }
        return this.$message.info(`请上传小于${this.uploadNumber}${upType}`);
      }
      _ossDT(e.target.files, (res) => {
        console.log(res, "----------------149");
        if (this.currentChangeIndex != -1) {
          // 点击切换资源
          _this.$set(_this.allImgList, this.currentChangeIndex, res[0]);
          _this.currentChangeIndex = -1;
        } else {
          _this.allImgList = [..._this.allImgList, ...res];
          if (_this.allImgList.length > this.uploadNumber) {
            _this.allImgList = _this.allImgList.slice(0, this.uploadNumber);
          }
        }
        console.log(_this.allImgList, "---------------60");
        e.target.value = "";
      });
    },
    getFileType(name) {
      if (!name) return false;
      var imgType = ["gif", "jpeg", "jpg", "bmp", "png"];
      var videoType = [
        "avi",
        "wmv",
        "mkv",
        "mp4",
        "mov",
        "rm",
        "3gp",
        "flv",
        "mpg",
        "rmvb",
      ];
      if (
        RegExp(".(" + imgType.join("|") + ")$", "i").test(name.toLowerCase())
      ) {
        return "image";
      } else if (
        RegExp(".(" + videoType.join("|") + ")$", "i").test(name.toLowerCase())
      ) {
        return "video";
      } else {
        return false;
      }
    },
    closeDia() {
      let inputFile = document.querySelector(".upLoad");
      inputFile.value = "";
      stopUpdate();
    },
    removeFile(index) {
      this.allImgList.splice(index, 1);
      this.$emit("remIndex", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.uploadImg {
  .addFile {
    margin: 20px 0;
    align-items: center;
    flex-wrap: wrap;
    .cont {
      overflow: initial;
      align-items: center;
      flex-wrap: wrap;
      .list {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        position: relative;
        margin-bottom: 10px;
        position: relative;
        .item {
          width: 60px;
          height: 60px;
          overflow: hidden;
          border-radius: 6px;
          .img {
            width: 60px;
            height: 60px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        .up {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          z-index: 1;
          input {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
          }
        }
        .removeBtn {
          cursor: pointer;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 2;
          .img {
            width: 20px;
            height: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .video {
          width: 60px;
          height: 60px;
          position: relative;
          i {
            position: absolute;
            bottom: 4px;
            left: 4px;
            font-size: 20px;
            color: #fff;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
    .load {
      height: 60px;
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      .item {
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }
    .uploadFile {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 6px;
      border: 1px dashed #bbbbbb;
      transition: all 0.4s;
      cursor: pointer;
      &:hover {
        border-color: #409eff;
      }
      .upLoad {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        top: 0;
        left: 0;
        z-index: 1;
      }
      i {
        text-align: center;
        line-height: 60px;
      }
    }
    .avatar-uploader {
      margin-right: 10px;
      margin-bottom: 10px;
      width: 60px;
      height: 60px;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
  .msg {
    font-size: 12px;
    .tips {
      color: #ef2526;
    }
    .uploadLimitInfo {
      margin-left: 10px;
      color: #999;
    }
  }
}
</style>
