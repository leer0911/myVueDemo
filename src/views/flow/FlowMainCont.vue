<template>
  <div id="flowMainCont" class="flow-main-cont">
    <div style="width:5500px;height:2500px">
      <div id="draw" class="main-bg" :style="{transform:`scale(${drawStyle.zoomRate})`,transformOrigin:`${drawStyle.origin}`}" @drop.prevent="dropHandle" @dragover.stop.prevent @mousedown="drawLineStart" @mousemove="drawingLine" @mouseup="drawLineEnd" @mousewheel.alt.prevent="wheelHandle" @click.stop.prevent="editEnd">
        <svg id="drawSVG" style="width: 1550px; height: 750px; display: block; position: absolute; background-image: none;">
          <defs>
            <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="9" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 12 6 L 0 12  L 4 6" style="fill: rgb(0,0,0);" transform="scale(0.8)"></path>
            </marker>
          </defs>

          <!-- 箭头 -->
          <foreignObject>
            <div v-show="showArrow && !isDragging" id="arrow" @mouseover="enterArrow" @mouseout="outArrow">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.t" class="arrow" draggable="false" data-direction="t">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.b" class="arrow arrow-bottom" draggable="false" data-direction="b">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.l" class="arrow arrow-left" draggable="false" data-direction="l">
              <img src="~assets/arrow.png" alt="" :style="arrowStyle.r" class="arrow arrow-right" draggable="false" data-direction="r">
            </div>
          </foreignObject>

          <g id="draw-line" style="cursor:row-resize;">
            <component :is="selLineType" :lineStyle="drawLineInfo.lineStyle" v-if="lineDrawing">
            </component>
            <component v-for="(item,index) in lineData" :is="item.type" :key="index" :lineStyle="item.lineStyle" :id="item.id" v-line>
            </component>
            <component :is="clickInfo.type" :lineStyle="clickInfo.lineStyle" v-show="showLineSet">
            </component>
          </g>

          <g id="draw-node">
            <!-- 镜像 -->
            <component :is="selNodeId" :transform="selNodeInfo.transform" v-if="isDragging" inDraw>
            </component>

            <!-- 真实节点 -->
            <component v-for="(item,index) in nodeData" :text="item.text" :imgSrc="item.imgSrc" :editable="editable" :is="item.type" :key="index" :transform="item.transform" :id="item.id" v-node inDraw>
            </component>

            <!-- 修改节点大小 -->
            <g v-if="showResize">
              <g :style="{cursor: `${key}-resize`}" :transform="`translate(${item.x},${item.y})`" v-for="(item,key,index) of resizeStyle" :key="index" v-if="key!=='rect'">
                <image x="-8" y="-8" width="17" height="17" xlink:href="~assets/point.png"></image>
              </g>
              <g :transform="`translate(${resizeStyle.rect.x},${resizeStyle.rect.y})`" style="cursor: move; visibility: visible;">
                <rect :width="resizeStyle.rect.w" :height="resizeStyle.rect.h" fill="none" stroke="#00a8ff" stroke-dasharray="3 3" pointer-events="none"></rect>
              </g>
            </g>

          </g>

        </svg>
        <tool-menu :ulStyle="'width:100px;text-align:center'" :visible.sync="visible" :menuData="menuData" @selItme="deleteHandle" :style="{top:menuInfo.top,left:menuInfo.left}"></tool-menu>

      </div>
    </div>
  </div>
</template>

<script>
import shapesMixin from './shapes/shapesMixin.js'
import { mapState, mapMutations } from 'vuex'
import ToolMenu from './ToolMenu'

export default {
  name: 'flowMainCont',
  mixins: [shapesMixin],
  data () {
    return {
      // 节点相关
      isDragging: false,
      selNodeInfo: {},
      showArrow: false,
      showResize: false,
      showLineSet: false,
      clickInfo: {},
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
      selNodeId: '',
      editable: false,
      lineDrawing: false,
      arrowDirection: '',
      arrowPadding: 15,
      timer: null,
      drawScale: 2,
      zoomType: 'zoomIn',
      visible: false,
      menuData: [
        { title: '删除' }
      ],
      menuInfo: {
        top: 0,
        left: 0,
        selType: '',
        selId: ''
      }
    }
  },

  components: {
    ToolMenu
  },
  computed: {
    ...mapState('flow', ['nodeData', 'selNodeType', 'dragging', 'lineData', 'selLineType', 'drawStyle']),
    arrowStyle () {
      let { width, height, top, left } = this.selNodeInfo
      let padding = this.arrowPadding
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
        left: left - width - objH / 2 - padding + 'px'
      }
      let r = {
        top: top - objH / 2 + 'px',
        left: left + width - objH / 2 + padding + 'px'
      }
      return {
        t, b, l, r
      }
    },
    resizeStyle() {
      let { width, height, top, left } = this.clickInfo
      let w = width / 2
      let h = height / 2

      return {
        nw: { x: left - w, y: top - h },
        n: { x: left, y: top - h },
        ne: { x: left + w, y: top - h },
        w: { x: left - w, y: top },
        e: { x: left + w, y: top },
        sw: { x: left - w, y: top + h },
        s: { x: left, y: top + h },
        se: { x: left + w, y: top + h },
        rect: {
          w: width,
          h: height,
          x: left - w,
          y: top - h
        }
      }
    }
  },
  directives: {
    node (el, binding, vnode) {
      // vnode.context 相当于 this
      let _this = vnode.context
      let x, y, val

      // 获取节点信息
      let getNodeInfo = () => {
        // 防止缩放后元素大小更改故除以缩放比例
        let obj = el.getElementsByTagName('g')[0]
        let w = obj.getBoundingClientRect().width / _this.drawStyle.zoomRate
        let h = obj.getBoundingClientRect().height / _this.drawStyle.zoomRate
        let wh = {
          width: w,
          height: h
        }
        let nodeInfo = _this.nodeData[el.id]
        _this.selNodeInfo = Object.assign({}, nodeInfo, wh)
        _this.showArrow = true
      }
      // 节点文本编辑≠≠
      el.ondblclick = (ev) => {
        _this.editable = true
        let editor = el.querySelector('.shape-text')
        el.querySelector('foreignObject').setAttribute('pointer-events', 'all')
        editor.focus()
        let fn = () => {
          let text = editor.innerHTML
          let result = _this.deepCopy(_this.nodeData[el.id])
          result.text = text
          _this.UPDATE_NODE({ [el.id]: result })
          _this.editable = false
          document.querySelector('.shape-text').removeEventListener('blur', fn)
        }
        document.querySelector('.shape-text').addEventListener('blur', fn)
      }
      // 节点删除相关
      el.oncontextmenu = (ev) => {
        ev.preventDefault()
        _this.visible = true
        _this.showArrow = false
        let x = ev.offsetX
        let y = ev.offsetY
        _this.menuInfo.top = `${y}px`
        _this.menuInfo.left = `${x}px`
        _this.menuInfo.selType = el.id.replace(/-.*/g, '')
        _this.menuInfo.id = el.id
      }
      // 移动相关
      el.onmousedown = (ev) => {
        if (ev.buttons === 2) {
          return
        }
        _this.selNodeId = _this.nodeData[el.id].type
        clearTimeout(_this.timer)
        _this.timer = setTimeout(() => {
          _this.isDragging = true

          // 节点移动回调
          let fn = (ev) => {
            x = ev.offsetX
            y = ev.offsetY
            val = `translate(${x},${y})`
            // el.setAttribute('transform', val)
            _this.selNodeInfo.transform = val
            _this.drawLineEnd()
          }

          // 节点移动结束后更新节点
          let updata = (ev) => {
            if (_this.isDragging) {
              x = ev.offsetX
              y = ev.offsetY
              val = `translate(${x},${y})`

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
      // 选择节点
      el.onclick = () => {
        clearTimeout(_this.timer)
        _this.showResize = true
        _this.clickElementId = el.id
        _this.clickInfo = JSON.parse(JSON.stringify(_this.selNodeInfo))
      }
      el.onmouseleave = (ev) => {
        // _this.selNodeInfo = {}
      }
      // 连接点显示相关
      el.onmouseover = (ev) => {
        if (_this.isDragging) { return }
        if (_this.lineDrawing) {
          _this.arrowPadding = 0
        } else {
          _this.arrowPadding = 15
        }
        setTimeout(getNodeInfo(), 0)
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
            }
          }
          if (!_this.showArrow) {
            document.querySelector('#draw').removeEventListener('mousemove', fn)
          }
        }
        document.querySelector('#draw').addEventListener('mousemove', fn)
      }
    },
    line (el, binding, vnode) {
      let _this = vnode.context
      el.oncontextmenu = (ev) => {
        ev.preventDefault()
        _this.visible = true
        // _this.showArrow = false
        let x = ev.offsetX
        let y = ev.offsetY
        _this.menuInfo.top = `${y}px`
        _this.menuInfo.left = `${x}px`
        _this.menuInfo.selType = el.id.replace(/-.*/g, '')
        _this.menuInfo.id = el.id
      }
      el.onclick = (ev) => {
        _this.clickInfo = _this.deepCopy(_this.lineData[el.id])
        _this.clickInfo.lineStyle.stroke = '#00a8ff'
        _this.clickInfo.lineStyle['stroke-dasharray'] = '3 3'
        _this.showLineSet = true
      }
      el.onmousedown = (ev) => {
        _this.lineDrawing = true
        _this.drawLineInfo.lineStyle.path = ''
        // let { path } = _this.lineData[el.id]
      }
      el.ondblclick = (ev) => {
        _this.editable = true
        let editor = el.querySelector('.line-text')
        el.querySelector('foreignObject').setAttribute('pointer-events', 'all')
        editor.focus()
        let fn = () => {
          let text = editor.innerHTML
          let result = _this.deepCopy(_this.lineData[el.id])
          result.text = text
          _this.UPDATE_LINE({ [el.id]: result })
          _this.editable = false
          document.querySelector('.line-text').removeEventListener('blur', fn)
        }
        document.querySelector('.line-text').addEventListener('blur', fn)
      }
    }
  },
  methods: {
    ...mapMutations('flow', ['SEL_NODETYPE', 'UPDATE_NODE', 'UPDATE_LINE', 'UPDATE_DRAWSTYLE']),
    click(){
      alert('a')
    },
    editEnd () {
      if (this.editable && !this.showArrow) {
        this.editable = false
      }
    },
    deleteNode (id = '') {
      for (var key in this.lineData) {
        if (this.lineData[key].startNode === id || this.lineData[key].endNode === id) {
          delete this.lineData[key]
          this.UPDATE_LINE(this.lineData)
        }
      }
      delete this.nodeData[id]
      this.UPDATE_NODE(this.nodeData)
      this.showArrow = false
      this.showResize = false
    },
    deleteHandle (ev) {
      let { id, selType } = this.menuInfo
      switch (selType) {
        case 'node':
          this.deleteNode(id)
          break
        case 'line':
          delete this.lineData[id]
          this.UPDATE_NODE(this.lineData)
          break
        default:
          break
      }
    },
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
    // 节点添加
    dropHandle (ev) {
      let imgSrc = ev.dataTransfer.getData('URL')
      if (this.selNodeType !== '') {
        let x = ev.offsetX
        let y = ev.offsetY
        let id = 'node-' + ((new Date()).getTime())
        this.UPDATE_NODE({
          [id]: {
            id: 'node-' + ((new Date()).getTime()),
            type: this.selNodeType,
            transform: `translate(${x},${y})`,
            top: y,
            left: x,
            text: '',
            imgSrc
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
    computePolyLine (start, end, direction) {
      let startPoint = {
        x: +(start.split(',')[0]),
        y: +(start.split(',')[1])
      }
      let endPoint = {
        x: +(end.split(',')[0]),
        y: +(end.split(',')[1])
      }
      let m1, m2
      switch (direction) {
        case 't':
        case 'b':
          let mY = startPoint.y + (endPoint.y - startPoint.y) / 2
          m1 = {
            x: startPoint.x,
            y: mY
          }
          m2 = {
            x: endPoint.x,
            y: mY
          }
          break
        case 'l':
        case 'r':
          let mX = startPoint.x + (endPoint.x - startPoint.x) / 2
          m1 = {
            x: mX,
            y: startPoint.y
          }
          m2 = {
            x: mX,
            y: endPoint.y
          }
          break
        default:
          break
      }

      return `${startPoint.x},${startPoint.y} ${m1.x},${m1.y} ${m2.x},${m2.y} ${endPoint.x},${endPoint.y}`
    },
    drawLineStart (ev) {
      if (ev.buttons === 2) {
        return
      }
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
            let direction = this.drawLineInfo.startDirection
            let endP = `${left},${top}`
            this.drawLineInfo.lineStyle.points = this.computePolyLine(startP, endP, direction)
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
    deepCopy (s, t = {}) {
      for (var i in s) {
        if (typeof s[i] === 'object') {
          t[i] = (s[i].constructor === Array) ? [] : {}
          this.deepCopy(s[i], t[i])
        } else {
          t[i] = s[i]
        }
      }
      return t
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
          endDirection: this.arrowDirection,
          text: ''
        }
        // vuex 不应该直接用响应式数据，需先进行深拷贝

        // let deepCopy = (s, t = {}) => {
        //   for (var i in s) {
        //     if (typeof s[i] === 'object') {
        //       t[i] = (s[i].constructor === Array) ? [] : {}
        //       deepCopy(s[i], t[i])
        //     } else {
        //       t[i] = s[i]
        //     }
        //   }
        //   return t
        // }

        let data = this.deepCopy(this.drawLineInfo)
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
              let points = this.computePolyLine(startP, endP, direction)
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
              let points = this.computePolyLine(startP, endP, direction)
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
      if (this.showResize || this.showLineSet) {
        this.clickInfo = {}
        this.showResize = false
        this.showLineSet = false
      }
    })
    // 阻止右键事件
    document.addEventListener('contextmenu', (ev) => {
      ev.preventDefault()
    })
    document.addEventListener('keydown', (ev) => {
      switch (ev.keyCode) {
        case 46:
          let { id } = this.clickInfo
          let selType = id.replace(/-.*/, '')
          switch (selType) {
            case 'node':
              this.deleteNode(id)
              break
            case 'line':
              delete this.lineData[id]
              this.UPDATE_NODE(this.lineData)
              this.showLineSet = false
              this.clickInfo = {}
              break
            default:
              break
          }
          break

        default:
          break
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
  top: 92px;
  bottom: 0;
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
  .shape-text {
    width: 400px;
    margin-left: -200px;
    text-align: center;
    outline: none;
    margin-top: -10px;
  }
  .line-text {
    width: 400px;
    margin-left: -200px;
    text-align: center;
    outline: none;
    margin-top: -10px;
    z-index: 9999;
    cursor: pointer;
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