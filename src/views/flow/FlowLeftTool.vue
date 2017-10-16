<template>
  <div id="flowLeftTool" class="flow-left-tool">
    <div class="flt-container">

      <div style="margin:10px">
        <div class="flt-input-svg" title="添加SVG" @drop.stop.prevent="dropHandle" @dragover.stop.prevent="dragoverHandle">
          <div class="flt-input-svg-box">添加SVG</div>
        </div>
      </div>

      <ul>
        <li class="flt-tool-list" v-for="(tool,index) in toolItems" :key="index">
          <div class="flt-list-tit" @click.stop="tool.show = !tool.show">
            <icon :name="tool.show?'down-arrow':'up-arrow'" :size="8" class="flt-icon"></icon>
            <span>{{tool.title}}</span>
          </div>
          <div class="flt-shape-list" v-show="tool.show">
            <div class="flt-item-box">
              <template v-if="tool.title==='自定义'">
                <div class="flt-list-item" draggable="true" v-for="(item,index) in userImages" :key="index" :title="item.title" @mousedown="selNode('SvgImage')" @dragstart="dragstart(item)">
                  <svg class="flt-list-svg">
                    <svg-image :imgSrc="item"></svg-image>
                  </svg>
                </div>
              </template>
              <template v-else>
                <div class="flt-list-item" draggable="true" v-for="(item,index) in tool.listData" :key="index" :title="item.title" @mousedown="selNode(item.type)">
                  <svg class="flt-list-svg">
                    <component :is="item.type"></component>
                  </svg>
                </div>
              </template>
            </div>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import shapesMixin from './shapes/shapesMixin.js'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'flow-left-tool',
  mixins: [shapesMixin],
  data () {
    return {
      selItem: undefined,
      toolItems: [

        {
          title: '流程图',
          listData: [
            {
              type: 'Start',
              title: '开始'
            },
            {
              type: 'General',
              title: '流程'
            },
            {
              type: 'Decision',
              title: '判断'
            }
          ],
          show: true
        },
        {
          title: '自定义',
          show: true
        }
      ],
      svgStyle: {},
      userImages: []
    }
  },
  computed: {
    ...mapState('flow', ['inDrawArea', 'selNodeType'])
  },
  methods: {
    ...mapMutations('flow', ['SEL_NODETYPE', 'SET_DRAGGING', 'SET_INDRAWAREA']),
    selNode (type) {
      this.SEL_NODETYPE(type)
    },
    dropHandle (e) {
      let reader = new FileReader()
      let file = e.dataTransfer.files[0]
      reader.onload = (e) => {
        this.userImages.push(e.target.result)
      }
      reader.readAsDataURL(file)
    },
    dragoverHandle () {

    },
    dragstart (imgSrc) {
      event.dataTransfer.setData('URL', imgSrc)
    }
  }
}
</script>

<style lang="scss">
.flow-left-tool {
  width: 208px;
  position: absolute;
  top: 90px;
  bottom: 0;
  overflow: auto;
  background: whiteSmoke;
  .flt-list-svg {
    width: 36px;
    height: 36px;
    display: block;
    position: relative;
    overflow: hidden;
    cursor: move;
    left: 2px;
    top: 2px;
  }
  .flt-container {
    .flt-list-tit {
      color: #333;
      background: #eee;
      padding: 6px 0px 6px 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4em;
      font-size: 9pt;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .flt-icon {
      margin-right: 8px;
    }
    .flt-shape-list {
      display: flex;
      flex-wrap: wrap;
      background: #f5f5f5;
      .flt-item-box {
        display: flex;
        padding: 1px;
        flex-wrap: wrap;
        align-items: center;
        cursor: move;
        .flt-list-item {
          width: 36px;
          height: 36px;
          overflow: hidden;
          cursor: move;
          background: none;
          margin-left: 10px;
        }
      }
    }
  }
  .flt-input-svg {
    touch-action: none;
    cursor: pointer;
    border: 3px solid transparent;
  }

  .flt-input-svg-box {
    border-radius: 6px;
    border: 3px dotted lightgray;
    text-align: center;
    padding: 8px;
    color: rgb(179, 179, 179);
  }
}
</style>
