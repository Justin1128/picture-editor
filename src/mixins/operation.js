import { mapGetters, mapMutations } from "vuex";
let arr = ['top', 'bottom'];

function throttle(func, wait) {
    let timeout;
    return function () {
        const args = arguments;
        if (timeout) return;
        timeout = setTimeout(() => {
            func.apply(this, args);
            timeout = null;
        }, wait);
    };
}

let operation = {
    data() {
        return {
            _startX: 0,
            _startY: 0,

            _originX: 0,
            _originY: 0,

            _target: null,
            _layer: null
        }
    },
    computed: {
        ...mapGetters(["layersList", "currentLayer", "horizontal", "vertical"]),
    },
    methods: {
        ...mapMutations(["setHorizontal", "setVertical", "initLine"]),
        initmovement(e, layer) {
            this._target = e.currentTarget;
            this._target.style.cursor = 'move'
            this._layer = layer;
            // layer._custom.focus=true;

            this._startX = e.clientX;
            this._startY = e.clientY;

            this._originX = this._target.offsetLeft;
            this._originY = this._target.offsetTop;


            // 绑定鼠标移动事件
            document.addEventListener('mousemove', this.handlemousemove, true)
            // 取消鼠标移动事件
            document.addEventListener('mouseup', this.handlemouseup, true)


        },
        handlemousemove(e) {
            e.stopPropagation()
            e.preventDefault()

            this._layer.left = this._originX + ((e.clientX - this._startX) * (1 / this.$store.state.stageZoom.value));
            this._layer.top = this._originY + ((e.clientY - this._startY) * (1 / this.$store.state.stageZoom.value));
            this._layer.bottom = this._layer.top + this._target.offsetHeight;

            throttle(this.markLine(), 1000)

        },
        handlemouseup() {
            this._target.style.cursor = 'auto'
            document.removeEventListener('mousemove', this.handlemousemove, true)
            document.removeEventListener('mouseup', this.handlemouseup, true)

            this.initLine();
        },
        layoutMoveHandle(e) {
            // console.log(e.target.className);
            // e.target.style.outline='1px solid'
        },
        markLine() {
            for (let i = 0; i < this.layersList.length; i++) {
                const element = this.layersList[i];
                !element._yList && (element._yList = [])
                !element._xList && (element._xList = [])
                if (element.layerEnd == this.currentLayer.layerEnd) continue
                //水平
                this.checkYs(element, i)
                //垂直
                this.checkXs(element, i)
            }
        },
        checkYs(element, i) {
            // 水平线
            let elementYs = [element.top, element.top + element.height / 2, element.top + element.height];
            let currentLayerYs = [this.currentLayer.top, this.currentLayer.top + this.currentLayer.height / 2, this.currentLayer.top + this.currentLayer.height]
            for (let j = 0; j < elementYs.length; j++) {
                for (let k = 0; k < currentLayerYs.length; k++) {
                    const ys_element = elementYs[j];
                    const current_element = currentLayerYs[k];
                    if (Math.abs(current_element - ys_element) <= 3 && element._yList.indexOf(ys_element) === -1) {
                        // 偏移3个像素点自动赋值
                        this.currentLayer.top = ys_element - (this.currentLayer.height / 2) * k
                        // 记录已经画线的位置
                        element._yList.push(ys_element)
                        let ll = Math.min(element.left, this.currentLayer.left)
                        let data = {
                            top: ys_element,
                            left: ll,
                            width: Math.max(this.currentLayer.left + this.currentLayer.width, element.left + element.width) - ll,
                            layerEnd: element.layerEnd
                        }
                        this.setHorizontal(data);
                    } else {
                        this.horizontal.splice(i, 1)
                        element._yList = []
                    }
                }
            }
        },
        checkXs(element, i) {
            // 垂直线
            let elementXs = [element.left, element.left + element.width / 2, element.left + element.width];
            let currentLayerXs = [this.currentLayer.left, this.currentLayer.left + this.currentLayer.width / 2, this.currentLayer.left + this.currentLayer.width]
            for (let j = 0; j < elementXs.length; j++) {
                for (let k = 0; k < currentLayerXs.length; k++) {
                    const xs_element = elementXs[j];
                    const current_element = currentLayerXs[k];
                    if (Math.abs(current_element - xs_element) <= 3 && element._xList.indexOf(xs_element) === -1) {
                        // 偏移3个像素点自动赋值
                        this.currentLayer.left = xs_element - (this.currentLayer.width / 2) * k
                        element._xList.push(xs_element)
                        let tt = Math.min(element.top, this.currentLayer.top);
                        let data = {
                            top: tt,
                            left: xs_element,
                            height: Math.max(this.currentLayer.top + this.currentLayer.height, element.top + element.height) - tt,
                            layerEnd: element.layerEnd
                        }
                        this.setVertical(data);
                    } else {
                        this.vertical.splice(i, 1)
                        element._xList = []
                    }
                }
            }
        }
    }
}

export { operation }
