<template>
  <div class="flow-node" :draggable="nodeInfo.draggable" :style="nodePosition" @dragstart="nodeDragStart(option.id)" @mouseenter="mouseEnterNode(option.id)" @mouseleave="mouseLeaveNode">
    <flow-arrow :nodeId="option.id" :arrowVisible.sync="arrowVisible" @arrowPointEnter="arrowPointEnter" @arrowPointLeave="arrowPointLeave"></flow-arrow>
    <icon :name="option.type" :size="80" :ref="option.id" style="cursor:move" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import FlowArrow from './FlowArrow';

export default {
  name: 'node',
  data() {
    return {
      arrowVisible: false,
      nodeInfo: {
        draggable: true
      }
    };
  },
  props: {
    option: {
      type: Object
    }
  },
  components: {
    FlowArrow
  },
  computed: {
    ...mapState('flow', ['nodeData']),
    nodePosition() {
      return {
        left: `${this.option.left}px`,
        top: `${this.option.top}px`
      };
    }
  },
  watch:{
    nodeData(){
      this.init()
    }
  },
  methods: {
    ...mapMutations('flow', ['UPDATE_NODE']),
    nodeDragStart(id) {
      let img = this.$el;
      let dataTransfer = event.dataTransfer;
      dataTransfer.dropEffect = 'copy';
      dataTransfer.setData('Text', `update:${this.option.id}`);
      dataTransfer.setDragImage(img, 0, 0);

      this.checkNodes(id);
    },
    checkNodes(id) {
      console.log(this.$refs[id].$el.getBoundingClientRect());
    },
    mouseEnterNode(id) {
      this.arrowVisible = true;
    },
    mouseLeaveNode() {
      this.arrowVisible = false;
    },
    arrowPointEnter() {
      this.nodeInfo.draggable = false;
    },
    arrowPointLeave() {
      this.nodeInfo.draggable = true;
    },
    getNodeSize() {
      let id = this.option.id,
        right,
        bottom;
      let { width, height, x, y } = this.$refs[id].$el.childNodes[0].getBBox();
      let { left, top } = this.nodeData[id];
      width = +width.toFixed(0);
      height = +(height - 3).toFixed(0);
      x = +x.toFixed(0);
      y = +y.toFixed(0);
      left += x;
      top += y;
      bottom = top + height;
      right = left + width;
      this.UPDATE_NODE({
        [id]: {
          ...this.nodeData[id],
          width,
          height,
          x,
          y,
          icon: {
            width,
            height,
            left,
            right,
            bottom,
            top
          }
        }
      });
    },
    init() {
      let id = this.option.id;
      if (typeof this.nodeData[id].width === 'undefined') {
        this.getNodeSize();
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.flow-node {
  position: absolute;
  &.flow-node:hover a {
    border-right: 1px solid #000;
  }
}
</style>