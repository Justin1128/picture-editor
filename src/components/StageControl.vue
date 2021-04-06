<template>
  <div class="zoom-control">
    <div class="zoom-control-wrap">
      <div class="zoom-icon radius-left" @click.stop="activezoomIndex > 0 ? sub() : ''">
        <i class="iconfont iconjjian-"></i>
      </div>
      <el-tooltip
        class="item"
        v-model="toolTip"
        effect="dark"
        :content="stageBest?'原始尺寸':'最佳尺寸'"
        placement="top"
      >
        <div class="zoom-text">
          <div v-show="toolTip" @click="adjustHandle">
            <i class="iconfont" :class="stageBest?'iconfangda':'iconsuoxiao'"></i>
          </div>
          <span v-show="!toolTip">{{stageZoom.text }}</span>
        </div>
      </el-tooltip>
      <div
        class="zoom-icon radius-right"
        @click.stop="activezoomIndex<zoomList.length-1 ? add() : ''"
      >
        <i class="iconfont iconjia1"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      toolTip: false,
      stageBest: true,
      show: true,
      activezoomIndex: 3,
      zoomList: [
        {
          text: "25%",
          value: 0.25,
        },
        {
          text: "50%",
          value: 0.5,
        },
        {
          text: "75%",
          value: 0.75,
        },
        {
          text: "100%",
          value: 1,
        },
        {
          text: "125%",
          value: 1.25,
        },
        {
          text: "150%",
          value: 1.5,
        },
        {
          text: "175%",
          value: 1.75,
        },
        {
          text: "200%",
          value: 2,
        },
        // {
        //   text: "最佳尺寸",
        //   value: -1,
        //   icon: "icon-best-size",
        // },
      ],
      otherList: [
        {
          text: "250%",
          value: 250,
        },
        {
          text: "300%",
          value: 300,
        },
        {
          text: "350%",
          value: 350,
        },
        {
          text: "400%",
          value: 400,
        },
        {
          text: "450%",
          value: 450,
        },
        {
          text: "500%",
          value: 500,
        },
      ],
      otherIndex: -1,
      bestZoom: 0,
    };
  },
  computed: {
    ...mapGetters(["stageZoom"]),
  },
  methods: {
    add() {
      this.activezoomIndex =
        this.zoomList.findIndex((item) => this.stageZoom.value < item.value) -
        1;
      this.activezoomIndex++;
      this.$store.commit(
        "setStageZoom",
        this.zoomList[this.activezoomIndex].value
      );
    },
    sub() {
      this.activezoomIndex = this.zoomList.findIndex(
        (item) => this.stageZoom.value <= item.value
      );
      this.activezoomIndex--;
      this.$store.commit(
        "setStageZoom",
        this.zoomList[this.activezoomIndex].value
      );
    },
    adjustHandle() {
      this.stageBest = !this.stageBest;
      if (this.stageBest) {
        this.$emit("getBestZoom");
      } else {
        this.activezoomIndex = 3;
        this.$store.commit(
          "setStageZoom",
          this.zoomList[this.activezoomIndex].value
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.zoom-control {
  display: flex;
  position: absolute;
  bottom: 26px;
  right: 25px;
  z-index: 2;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(238, 242, 248, 0.1);
  border-radius: 6px;
  width: 140px;
  height: 40px;
  .zoom-control-wrap {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .zoom-text {
      cursor: pointer;
      width: 50%;
    }
    .zoom-icon {
      cursor: pointer;
    }
  }
  .zoom-control-wrap#fire {
    opacity: 0.5;
  }
}
</style>