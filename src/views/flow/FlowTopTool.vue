<script>
import { mapMutations, mapState } from 'vuex'
import ToolMenu from './ToolMenu'
export default {
  name: 'flow-top-tool',
  render (h) {
    const topTool = this.topTool
    const labelCont = (item) => {
      if (item.type === 'label') {
        return (<span>{this.zoomRateNum}</span>)
      }
    }
    const iconCont = (item) => {
      let color
      if (typeof item.color === 'function') {
        color = item.color.call(this)
      } else {
        color = item.color
      }
      return (<icon name={item.icon} size={item.size} style={{color}} />)
    }
    const items = topTool.map((item, index) => {
      return (
        <div class='ftt-tool-item' data-event={item.event} title={item.title}>
          <div class={['ftt-icon', (item.type === 'label' ? 'ftt-label' : 'ftt-button')]}>
            {labelCont(item)}
            {iconCont(item)}
          </div>
          <div class='ftt-separator' v-show={item.separator} />
        </div >
      )
    })
    return (
      <div id='flowTopTool' class='flow-top-tool' >
        <div class='ftt-container' onClick={this.toolDelegate}>
          {items}
        </div>
      </div>
    )
  },
  data () {
    return {
      visible: false,
      topTool: [
        {
          type: 'label',
          title: '画布缩放',
          icon: 'down-arrow',
          size: 10,
          separator: true,
          event: 'selZoomRate'
        },
        {
          type: 'button',
          title: '直线',
          icon: 'straight',
          separator: true,
          event: 'straight',
          color () {
            return (this.selLineType === 'StraightLine' ? '#f00' : '')
          }
        },
        {
          type: 'button',
          title: '折线',
          icon: 'zhexianjiantou1',
          separator: true,
          event: 'poly',
          color () {
            return (this.selLineType === 'LinePoly' ? '#f00' : '')
          }
        },
        {
          type: 'button',
          title: '放大',
          icon: 'expand',
          event: 'zoomIn'
        },
        {
          type: 'button',
          title: '缩小',
          icon: 'narrow',
          separator: true,
          event: 'zoomOut'
        },
        {
          type: 'button',
          title: '撤销',
          icon: 'undo',
          event: 'undo',
          color () {
            return (this.showUndo ? '' : '#999')
          }
        },
        {
          type: 'button',
          title: '重做',
          icon: 'redo',
          separator: true,
          event: 'redo',
          color () {
            return (this.showRedo ? '' : '#999')
          }
        }
      ],
      menuData: [
        {
          title: '25%'
        },
        {
          title: '50%'
        },
        {
          title: '75%'
        },
        {
          title: '100%'
        },
        {
          title: '125%'
        },
        {
          title: '150%'
        },
        {
          title: '200%'
        },
        {
          title: '300%'
        }
      ]
    }
  },
  components: {
    ToolMenu
  },
  computed: {
    ...mapState('flow', ['selLineType', 'drawStyle', 'historyLength', 'historyIndex']),
    zoomRateNum () {
      return this.drawStyle.zoomRate * 100 + '%'
    },
    showUndo () {
      return this.historyLength
    },
    showRedo () {
      return this.historyIndex
    }
  },
  methods: {
    ...mapMutations('flow', ['SEL_LINETYPE', 'UPDATE_DRAWSTYLE', 'UNDO', 'REDO']),
    toolDelegate (event) {
      let dataset = event.target.dataset
      let eventName = dataset.event
      let eventFn = {
        selZoomRate () {
          this.visible = true
        },
        straight () {
          this.SEL_LINETYPE('StraightLine')
        },
        poly () {
          this.SEL_LINETYPE('LinePoly')
        },
        zoomIn () {
          if (this.drawStyle.zoomRate < 3) {
            let zoomRate = this.drawStyle.zoomRate + 0.25
            this.UPDATE_DRAWSTYLE({ zoomRate })
          }
        },
        zoomOut () {
          if (this.drawStyle.zoomRate > 0.25) {
            let zoomRate = this.drawStyle.zoomRate - 0.25
            this.UPDATE_DRAWSTYLE({ zoomRate })
          }
        },
        undo () {
          if (this.showUndo) {
            this.UNDO({})
          }
        },
        redo () {
          if (this.showRedo) {
            this.REDO({})
          }
        }
      }
      if (this.visible) {
        this.visible = false
      }
      if (eventName) {
        eventFn[eventName].call(this)
      }
    },
    changeColor (obj) {
      this.topTool.map(item => {
        item = 'StraightLine'
      })
    },
    menuClickFn (item) {
      let zoomRate = +item.title.replace('%', '') / 100
      this.visible = false
      this.UPDATE_DRAWSTYLE({ zoomRate, origin: 'center' })
    }
  }
}
</script>

<style lang="scss">
@import 'flow.scss';

.flow-top-tool {
  height: 34px;
  border-bottom: 1px solid $borderColor;
  border-top: 1px solid $borderColor;
  background: whiteSmoke;
  font-size: 12px;
  padding-left: 8px;
  .ftt-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .ftt-icon {
      pointer-events: none
    }
    .ftt-tool-item {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .ftt-label {
      span {
        margin-right: 5px;
        width: 35px;
        display: inline-block;
        text-align: center;
      }
    }
    .ftt-button {
      padding: 6px 8px;
      font-size: 16px;
    }
    .ftt-separator {
      width: 1px;
      height: 34px;
      pointer-events: none;
      background: $borderColor;
      margin-left: 6px;
      margin-right: 6px;
      margin-top: -2px;
    }
  }
}
</style>