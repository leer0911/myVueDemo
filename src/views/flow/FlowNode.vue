<template>
  <div class="flow-node" draggable="true" :style="nodePosition" @dragstart="nodeDragStart(option.id)" @mouseenter="mouseEnterNode(option.id)">
    <flow-arrow :nodeId="option.id" :arrowVisible.sync="arrowVisible"></flow-arrow>
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
      arrowVisible
    };
  },
  props: {
    option: {
      type: Object
    }
  },
  components: { FlowArrow },
  computed: {
    ...mapState('flow', ['nodeData']),
    nodePosition() {
      return {
        left: `${this.option.left}px`,
        top: `${this.option.top}px`
      };
    }
  },
  methods: {
    ...mapMutations('flow', ['UPDATE_NODE']),
    nodeDragStart(id) {
      let img = this.$refs[id].$el.childNodes[0],
        dataTransfer = event.dataTransfer;
      dataTransfer.dropEffect = 'copy';
      dataTransfer.setData('Text', `update:${this.option.id}`);
      dataTransfer.setDragImage(img, 0, 0);
      this.arrow.show = false;
    },
    mouseEnterNode(id) {
      let { width, height } = this.$refs[id].$el.childNodes[0].getBBox();
      let padding = 100;
      width = `${(width + padding).toFixed(0)}px`;
      height = `${(height + padding - 3).toFixed(0)}px`;
      this.arrow = {
        show: true,
        width,
        height
      };
    },
    mouseLeaveNode() {
      this.arrow.show = false;
    },
    getNodeSize() {
      let id = this.option.id;
      let { width, height } = this.$refs[id].$el.childNodes[0].getBBox();
      this.UPDATE_NODE({
        [id]: {
          ...this.nodeData[id],
          width: width.toFixed(0),
          height: (height - 3).toFixed(0)
        }
      });
    },
    init() {
      let id = this.option.id;
      if (typeof this.nodeData[id].width !== 'undefined') {
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

.arrow-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  .arrow {
    opacity: 0.3;
    z-index: 9999;
    cursor: crosshair;
    &-t {
      top: 0;
      left: 50%;
      transform: translate(-50%, 160%);
    }
    &-b {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, -160%);
    }
    &-l {
      bottom: 50%;
      left: 0;
      transform: translate(160%, 50%);
    }
    &-r {
      bottom: 50%;
      right: 0;
      transform: translate(-160%, 50%);
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>