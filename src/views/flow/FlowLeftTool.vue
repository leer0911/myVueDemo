<template>
  <div id="flowLeftTool" class="flow-left-tool">
    <div class="container">
      <a href="javascript:void(0)" class="title">
        <icon name="down-arrow" :size="8" class="icon"></icon>
        <span>流程图</span>
      </a>
      <div class="shapeList">
        <div class="listItem">
          <div @mousedown="selNode(item.type)" v-for="(item,index) in shapeList" :key="index" :title="item.title" class="item" draggable="true">
            <svg>
              <component :is="item.type"></component>
            </svg>
          </div>
        </div>
      </div>
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
      shapeList: [
        {
          type: 'Start',
          title: '124'
        }
      ],
      svgStyle: {}
    }
  },
  computed: {
    ...mapState('flow', ['inDrawArea', 'selNodeType'])
  },
  methods: {
    ...mapMutations('flow', ['SEL_NODETYPE', 'SET_DRAGGING', 'SET_INDRAWAREA']),
    selNode (type) {
      this.SEL_NODETYPE(type)
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
  .container {
    .title {
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
    }
    .icon {
      margin-right: 8px;
    }
    .shapeList {
      display: flex;
      flex-wrap: wrap;
      background: #f5f5f5;
      .listItem {
        overflow: hidden;
        width: 40px;
        height: 40px;
        padding: 1px;
        cursor: move;
        .item {
          width: 36px;
          height: 36px;
          overflow: hidden;
          cursor: move;
          background: none;
        }
      }
    }
  }
}
</style>
