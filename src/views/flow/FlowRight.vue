<template>
  <div id="flowRight" class="flow-right">
    <div class="container">
      <a href="javascript:void(0)" class="title">
        <icon name="down-arrow" :size="8" class="icon"></icon>
        <span>节点数据</span>
      </a>
      <textarea class="data-textarea" v-model="node">
      </textarea>
      <a href="javascript:void(0)" class="title">
        <icon name="down-arrow" :size="8" class="icon"></icon>
        <span>连线数据</span>
      </a>
      <textarea class="data-textarea" v-model="line">
      </textarea>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'flow-right',
  computed: {
    ...mapState('flow', ['lineData', 'nodeData']),
    node () {
      return JSON.stringify(this.nodeData)
    },
    line () {
      return JSON.stringify(this.lineData)
    }
  }
}
</script>

<style lang="scss">
.flow-right {
  width: 208px;
  position: absolute;
  top: 90px;
  bottom: 0;
  overflow: auto;
  right: 0;
  background: whiteSmoke;
  svg {
    width: 36px;
    height: 36px;
    display: block;
    position: relative;
    overflow: hidden;
    cursor: move;
    left: 2px;
    top: 2px;
  }
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
        display: flex;
        padding: 1px;
        justify-content: center;
        align-items: center;
        cursor: move;
        .item {
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
}
.data-textarea{
  width: 100%;
  height: 200px;
}
</style>
