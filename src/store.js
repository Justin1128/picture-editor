import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 图层列表
    layersList: [],
    // 历史记录
    historyList:[],
    // 当前选中组件索引
    currentIndex: -1,
    // 舞台大小
    stageSize: {
      width: 0,
      height: 0,
    },
    // 舞台缩放
    stageZoom: {
      value: 1,
      text: '100%'
    },
    // 水平线
    horizontal: [],
    // 垂直线
    vertical: []
  },
  getters: {
    stageZoom(state) {
      return state.stageZoom
    },
    stageSize(state) {
      return state.stageSize
    },
    layersList(state) {
      return state.layersList
    },
    currentLayer(state) {
      return state.layersList[state.currentIndex]
    },
    horizontal(state) {
      return state.horizontal
    },
    vertical(state) {
      return state.vertical
    },

  },
  mutations: {
    setLayersList(state, val) {
      state.layersList = val;
    },
    // 舞台
    setStage(state, val) {
      let { width, height } = val
      state.stageSize.width = width;
      state.stageSize.height = height;
    },
    // 当前选中项
    setCurrentIndex(state, val) {
      state.currentIndex = val
    },
    // 画布大小
    setStageZoom(state, val) {
      state.stageZoom.value = val;
      state.stageZoom.text = Math.floor(val * 100) + '%';
    },
    // 设置水平线
    setHorizontal(state, val) {
      state.horizontal.push(val)
    },
    // 设置垂直线
    setVertical(state, val) {
      state.vertical.push(val)
    },
    initLine(state) {
      state.horizontal = [];
      state.vertical = [];
    }
  },
  actions: {

  }
})
