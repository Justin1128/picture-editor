<template>
  <el-tabs type="border-card">
    <el-tab-pane label="psd">
      <Psd/>
    </el-tab-pane>
    <el-tab-pane label="hello">
      <HelloWorld/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Psd from '@/components/Psd.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    Psd
  }
}
</script>
