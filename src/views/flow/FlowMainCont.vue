<template>
  <div id="flowMainCont" class="flow-main-cont">
    <div style="width:5500px;height:2500px">
      <div id="draw" class="main-bg" :style="{transform:`scale(${drawStyle.zoomRate})`,transformOrigin:`${drawStyle.origin}`}" @drop.prevent="dropHandle" @dragover.stop.prevent @mousedown="drawLineStart" @mousemove="drawingLine" @mouseup="drawLineEnd" @mousewheel.alt.prevent="wheelHandle">
        <svg id="drawSVG" style="width: 1550px; height: 750px; display: block; position: absolute; background-image: none;">
          <defs>
            <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 12 6 L 0 12  L 4 6" style="fill: rgb(0,0,0);" transform="scale(0.8)"></path>
            </marker>
          </defs>
          <foreignObject>
            <div v-show="showArrow && !isDragging" id="arrow" @mouseover="enterArrow" @mouseout="outArrow">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.t" class="arrow" draggable="false" data-direction="t">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.b" class="arrow arrow-bottom" draggable="false" data-direction="b">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.l" class="arrow arrow-left" draggable="false" data-direction="l">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.r" class="arrow arrow-right" draggable="false" data-direction="r">
            </div>
          </foreignObject>
          <g id="draw-line">
            <component :is="selLineType" :lineStyle="drawLineInfo.lineStyle" v-if="lineDrawing">
            </component>
            <component v-for="(item,index) in lineData" :is="item.type" :key="index" :lineStyle="item.lineStyle" :id="item.id" @mouseover="a">
            </component>
          </g>
          <g id="draw-node">
            <component v-for="(item,index) in nodeData" :is="item.type" :key="index" :transform="item.transform" :shapeStyle="shapeStyle" :id="item.id" v-drag>
            </component>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
// import SVG from 'svg.js'
// import 'svg.select.js'
// import 'svg.resize.js'
// import 'svg.draggable.js'
// import 'svg.panzoom.js'
import shapesMixin from './shapes/shapesMixin.js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'flowMainCont',
  mixins: [shapesMixin],
  data () {
    return {
      // 节点相关
      shapeStyle: {
        cx: '0',
        cy: '0'
      },
      isDragging: false,
      selNodeInfo: {},
      showArrow: false,
      // 连线相关
      drawLineInfo: {
        startNode: '',
        endNode: '',
        startDirection: '',
        endDirection: '',
        // type: 'StraightLine',
        type: '',
        lineStyle: {
          // x1: '',
          // y1: '',
          // x2: '',
          // y2: ''
        }
      },
      lineDrawing: false,
      arrowDirection: '',
      timer: null,
      drawScale: 2,
      zoomType: 'zoomIn'
    }
  },
  computed: {
    ...mapState('flow', ['nodeData', 'selNodeType', 'dragging', 'lineData', 'selLineType', 'drawStyle']),
    arrowStyle () {
      let { width, height, top, left } = this.selNodeInfo
      let padding = 0
      let objH = 15
      let objW = 15
      width = width / 2
      height = height / 2
      let t = {
        top: top - padding - objH / 2 - height + 'px',
        left: left - objW / 2 + 'px'
      }
      let b = {
        top: top + padding + height - objH / 2 + 'px',
        left: left - objW / 2 + 'px'
      }
      let l = {
        top: top - objH / 2 + 'px',
        left: left - width - objH / 2 + 'px'
      }
      let r = {
        top: top - objH / 2 + 'px',
        left: left + width - objH / 2 + 'px'
      }
      return {
        t, b, l, r
      }
    }
  },
  directives: {
    drag (el, binding, vnode) {
      // vnode.context 相当于 this
      let _this = vnode.context
      let x, y, val

      // 获取节点信息
      let getNodeInfo = () => {
        // 防止缩放后元素大小更改故除以缩放比例
        let w = el.getBoundingClientRect().width / _this.drawStyle.zoomRate
        let h = el.getBoundingClientRect().height / _this.drawStyle.zoomRate
        let wh = {
          width: w,
          height: h
        }
        let nodeInfo = _this.nodeData[el.id]
        _this.selNodeInfo = Object.assign({}, nodeInfo, wh)
        _this.showArrow = true
      }

      el.onmousedown = (ev) => {
        clearTimeout(_this.timer)
        _this.timer = setTimeout(() => {
          _this.isDragging = true

          // 节点移动回调
          let fn = (ev) => {
            x = ev.offsetX
            y = ev.offsetY
            val = `translate(${x},${y}) scale(3)`
            el.setAttribute('transform', val)
            _this.drawLineEnd()
          }

          // 节点移动结束后更新节点
          let updata = (ev) => {
            if (_this.isDragging) {
              x = ev.offsetX
              y = ev.offsetY
              val = `translate(${x},${y}) scale(3)`

              _this.UPDATE_NODE({
                [el.id]: {
                  ..._this.nodeData[el.id],
                  transform: val,
                  top: y,
                  left: x
                }
              })
              getNodeInfo()
            }
            _this.isDragging = false
            _this.updateLine()
            // 移除画布事件
            document.querySelector('#draw').removeEventListener('mousemove', fn)
            document.querySelector('#draw').removeEventListener('mouseup', updata)
            document.querySelector('#draw').removeEventListener('mouseleave', leaveFn)
          }

          // 离开画布后触发的方法
          let leaveFn = (ev) => {
            if (_this.isDragging) {
              updata(ev)
              _this.showArrow = false
            }
          }

          // 添加画布事件
          document.querySelector('#draw').addEventListener('mousemove', fn)
          document.querySelector('#draw').addEventListener('mouseup', updata)
          document.querySelector('#draw').addEventListener('mouseleave', leaveFn)
        }, 200)
      }
      el.onclick = () => {
        clearTimeout(_this.timer)
      }
      el.onmouseover = (ev) => {
        getNodeInfo()
        let fn = (ev) => {
          if (ev.target.tagName !== 'IMG') {
            let x = ev.offsetX
            let y = ev.offsetY
            let { top, left, width, height } = _this.selNodeInfo
            width = width / 2
            height = height / 2
            let padding = 40
            if (top - height - padding > y || y > top + height + padding || left - width - padding > x || x > left + width + padding) {
              _this.showArrow = false
              document.querySelector('#draw').removeEventListener('mousemove', fn)
            } else {
              _this.showArrow = true
            }
          }
        }
        document.querySelector('#draw').addEventListener('mousemove', fn)
      }
    }
  },
  methods: {
    ...mapMutations('flow', ['SEL_NODETYPE', 'UPDATE_NODE', 'UPDATE_LINE', 'UPDATE_DRAWSTYLE']),
    wheelHandle (ev) {
      if (ev.deltaY < 0) {
        this.zoomType = 'zoomIn'
      } else {
        this.zoomType = 'zoomOut'
      }
      let x = ev.offsetX
      let y = ev.offsetY
      if (this.zoomType === 'zoomIn') {
        if (this.drawStyle.zoomRate < 3) {
          let zoomRate = this.drawStyle.zoomRate + 0.25
          this.UPDATE_DRAWSTYLE({ zoomRate, origin: `${x}px ${y}px` })
        }
      } else if (this.zoomType === 'zoomOut') {
        if (this.drawStyle.zoomRate > 0.25) {
          let zoomRate = this.drawStyle.zoomRate - 0.25
          this.UPDATE_DRAWSTYLE({ zoomRate, origin: `${x}px ${y}px` })
        }
      }
    },
    dropHandle (ev) {
      if (this.selNodeType !== '') {
        let x = ev.offsetX
        let y = ev.offsetY
        let id = 'node-' + ((new Date()).getTime())
        this.UPDATE_NODE({
          [id]: {
            id: 'node-' + ((new Date()).getTime()),
            type: this.selNodeType,
            transform: `translate(${x},${y}) scale(3)`,
            top: y,
            left: x
          }
        })
        this.showArrow = false
      }
    },
    enterArrow (ev) {
      this.arrowDirection = ev.target.dataset.direction
      ev.target.style.opacity = 1
    },
    outArrow (ev) {
      this.arrowDirection = ''
      ev.target.style.opacity = 0.5
    },
    computeLine (direction, obj) {
      let { top, left, width, height } = obj
      let w = width / 2
      let h = height / 2
      switch (direction) {
        case 't':
          top = top - h
          break
        case 'b':
          top = top + h
          break
        case 'l':
          left = left - w
          break
        case 'r':
          left = left + w
          break
        default:
          break
      }
      return { top, left }
    },
    computePolyLine (start, end) {
      let startPoint = {
        x: +(start.split(',')[0]),
        y: +(start.split(',')[1])
      }
      let endPoint = {
        x: +(end.split(',')[0]),
        y: +(end.split(',')[1])
      }
      let mY = startPoint.y + (endPoint.y - startPoint.y) / 2
      let m1 = {
        x: startPoint.x,
        y: mY
      }
      let m2 = {
        x: endPoint.x,
        y: mY
      }
      return `${startPoint.x},${startPoint.y} ${m1.x},${m1.y} ${m2.x},${m2.y} ${endPoint.x},${endPoint.y}`
    },
    drawLineStart () {
      if (this.arrowDirection && !this.isDragging && this.showArrow) {
        this.lineDrawing = true
        let { id } = this.selNodeInfo
        let { top, left } = this.computeLine(this.arrowDirection, this.selNodeInfo)
        let style = {}
        switch (this.selLineType) {
          case 'LinePoly':
            style = {
              points: `${left},${top}`
            }
            break
          case 'StraightLine':
            style = {
              x1: left,
              y1: top,
              x2: left,
              y2: top
            }
            break
          default:
            break
        }

        this.drawLineInfo = {
          ...this.drawLineInfo,
          lineStyle: {
            ...style
          },
          type: this.selLineType,
          startNode: id,
          startDirection: this.arrowDirection
        }
      }
    },
    drawingLine (ev) {
      if (this.lineDrawing && ev.target.tagName !== 'IMG' && !this.isDragging) {
        let top = ev.offsetY
        let left = ev.offsetX

        switch (this.selLineType) {
          case 'LinePoly':
            let startP = this.drawLineInfo.lineStyle.points.split(' ')[0]
            let endP = `${left},${top}`
            this.drawLineInfo.lineStyle.points = this.computePolyLine(startP, endP)
            break
          case 'StraightLine':
            this.drawLineInfo.lineStyle.x2 = left
            this.drawLineInfo.lineStyle.y2 = top
            break
          default:
            break
        }

        this.arrowDirection = ''
      }
    },
    drawLineEnd (ev) {
      if (this.lineDrawing && this.arrowDirection && this.showArrow) {
        let { id } = this.selNodeInfo
        let { top, left } = this.computeLine(this.arrowDirection, this.selNodeInfo)
        this.drawLineInfo.endNode = id
        let style = {}
        switch (this.selLineType) {
          case 'LinePoly':
            style = {
              ...this.drawLineInfo.lineStyle
            }
            break
          case 'StraightLine':
            style = {
              ...this.drawLineInfo.lineStyle,
              x2: left,
              y2: top
            }
            break
          default:
            break
        }

        this.drawLineInfo = {
          ...this.drawLineInfo,
          lineStyle: {
            ...style
          },
          endDirection: this.arrowDirection
        }
        // vuex 不应该直接用响应式数据，需先进行深拷贝

        let deepCopy = (s, t = {}) => {
          for (var i in s) {
            if (typeof s[i] === 'object') {
              t[i] = (s[i].constructor === Array) ? [] : {}
              deepCopy(s[i], t[i])
            } else {
              t[i] = s[i]
            }
          }
          return t
        }

        let data = deepCopy(this.drawLineInfo)
        let lineId = 'line-' + ((new Date()).getTime())
        data.id = lineId
        this.UPDATE_LINE({
          [lineId]: data
        })
      } else {
        this.drawLineInfo = {
          startNode: '',
          endNode: '',
          type: this.selLineType,
          lineStyle: {

          }
        }
      }
      this.lineDrawing = false
      this.arrowDirection = ''
    },
    updateLine () {
      let { id } = this.selNodeInfo
      let data = {}

      for (var key in this.lineData) {
        if (this.lineData[key].startNode === id) {
          // 获取开始端口坐标
          let direction = this.lineData[key].startDirection
          let { left, top } = this.computeLine(direction, this.selNodeInfo)
          let type = this.lineData[key].type

          switch (type) {
            case 'LinePoly':
              let arr = this.lineData[key].lineStyle.points.split(' ')
              let startP = `${left},${top}`
              let endP = arr[arr.length - 1]
              let points = this.computePolyLine(startP, endP)
              data[key] = {
                ...this.lineData[key],
                lineStyle: {
                  ...this.lineData[key].lineStyle,
                  points
                }
              }
              break
            case 'StraightLine':
              data[key] = {
                ...this.lineData[key],
                lineStyle: {
                  ...this.lineData[key].lineStyle,
                  x1: left,
                  y1: top
                }
              }
              break
            default:
              break
          }
        } else if (this.lineData[key].endNode === id) {
          // 获取结束端口坐标
          let direction = this.lineData[key].endDirection
          let { left, top } = this.computeLine(direction, this.selNodeInfo)
          let type = this.lineData[key].type
          switch (type) {
            case 'LinePoly':
              let arr = this.lineData[key].lineStyle.points.split(' ')
              let startP = arr[0]
              let endP = `${left},${top}`
              let points = this.computePolyLine(startP, endP)
              data[key] = {
                ...this.lineData[key],
                lineStyle: {
                  ...this.lineData[key].lineStyle,
                  points
                }
              }
              break
            case 'StraightLine':
              data[key] = {
                ...this.lineData[key],
                lineStyle: {
                  ...this.lineData[key].lineStyle,
                  x2: left,
                  y2: top
                }
              }
              break
            default:
              break
          }
        }
      }

      this.UPDATE_LINE(data)
    }
  },
  mounted () {
    document.addEventListener('mouseup', (ev) => {
      if (this.selNodeType) {
        this.SEL_NODETYPE('')
      }
    })
    document.getElementById('flowMainCont').scrollTop = 380
    document.getElementById('flowMainCont').scrollLeft = 760
  }
}
</script>

<style lang="scss">
.flow-main-cont {
  right: 0;
  left: 208px;
  top: 90px;
  bottom: 0;
  touch-action: none;
  overflow: auto;
  background: #ebebeb;
  position: absolute;
  .main-bg {
    position: absolute;
    overflow: hidden;
    left: 50%;
    top: 50%;
    width: 1550px;
    height: 750px;
    margin: 80px;
    border: 1px solid #cacaca;
    background: url('../../assets/bg.svg') #fff -1px -1px;
    transform-origin: 50% 50%
  }
  .arrow {
    position: absolute;
    opacity: 0.3;
    z-index: 9999;
    cursor: crosshair;
    &-bottom {
      transform: rotate(-180deg)
    }
    &-left {
      transform: rotate(-90deg)
    }
    &-right {
      transform: rotate(90deg)
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>