<template>
  <div class="aside-body">
    <div class="aside-button" @click="clickHandle">
      <i class="iconfont iconwenzi1 icon" ></i>
      文字
    </div>
    <div class="aside-button" @click="clickHandle">
      <i class="iconfont icontupian icon" ></i>
      图片
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    clickHandle(){
      alert('暂未开通')
    }
  }
};
</script>

<style lang="scss" scoped>
.aside-body {
  display: flex;
  flex-direction: column;
  .aside-button {
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    padding: 12px 0;
    font-size: 12px;
    font-weight: 500;
    color: #757e8a;
    background: #fff;
    width: 100%;
    cursor: pointer;
    word-break: break-all;
    .icon {
      font-size: 28px;
      display: block;
      margin: 0 auto 2px;
    }
  }
}
</style>