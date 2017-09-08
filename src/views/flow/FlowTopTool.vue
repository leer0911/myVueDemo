<template>
  <div id="flowTopTool" class="flow-top-tool">
    <div class="container">
      <a href="javascript:void(0);" class="label" @click.stop="selZoomRate">
        <span>{{zoomRateNum}}</span>
        <icon name="down-arrow" :size="10"></icon>
      </a>
      <div class="separator"></div>
      <a href="javascript:void(0);" class="button" :style="{color:selLineType==='StraightLine'?'#f00':''}" @click="straight">
        <icon name="straight"></icon>
      </a>
      <div class="separator"></div>
      <a href="javascript:void(0);" class="button" :style="{color:selLineType==='LinePoly'?'#f00':''}" @click="poly">
        <icon name="zhexianjiantou1"></icon>
      </a>
      <div class="separator"></div>
      <a href="javascript:void(0);" class="button" @click="zoomIn">
        <icon name="expand"></icon>
      </a>
      <a href="javascript:void(0);" class="button" @click="zoomOut">
        <icon name="narrow"></icon>
      </a>
      <div class="separator"></div>
      <a href="javascript:void(0);" class="button" @click="undo" :style="{color:showUndo?'':'#999'}">
        <icon name="undo"></icon>
      </a>
      <a href="javascript:void(0);" class="button" @click="redo" :style="{color:showRedo?'':'#999'}">
        <icon name="redo"></icon>
      </a>
      <div class="separator"></div>
      <!-- <a href="javascript:void(0);" class="button" @click="remove">
                                  <icon name="remove"></icon>
                                </a>
                                <div class="separator"></div> -->
    </div>
    <tool-menu :ulStyle="'width:100px;text-align:center'" :visible.sync="visible" :menuData="menuData" @selItme="clickFn"></tool-menu>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ToolMenu from './ToolMenu'
export default {
  name: 'flow-top-tool',
  data () {
    return {
      topTool: [
        {
          type: '',
          title: ''
        }
      ],
      visible: false,
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
    straight () {
      this.SEL_LINETYPE('StraightLine')
    },
    remove () {
      // console.log('a')
    },
    poly () {
      this.SEL_LINETYPE('LinePoly')
    },
    clickFn (item) {
      this.visible = false
      let zoomRate = +item.title.replace('%', '') / 100
      this.UPDATE_DRAWSTYLE({ zoomRate, origin: 'center' })
    },
    selZoomRate () {
      this.visible = true
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
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    a {
      color: #333;
      font-size: 12px;
    }
    .label {
      span {
        margin-right: 5px;
        width: 35px;
        display: inline-block;
        text-align: center;
      }
    }
    .button {
      padding: 6px 8px;
      font-size: 16px;
    }
    .separator {
      width: 1px;
      height: 34px;
      background: $borderColor;
      margin-left: 6px;
      margin-right: 6px;
      margin-top: -2px;
    }
  }
}
</style>