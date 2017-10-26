<template>
  <div class="flow-node" draggable="true" :style="nodePosition" @dragstart="dragstart(option.id)" @mouseover="mouseover(option.id)" @mouseout="mouseout(option.id)">
    <icon :name="option.type" :size="80" :ref="option.id" />
    <div id="arrow" class="arrow-wrap" :style="{width:arrow.width,height:arrow.height}" v-if="arrow.show">
      <img src="~assets/arrow.png" class="arrow arrow-t" draggable="false" data-direction="t">
      <img src="~assets/arrow.png" class="arrow arrow-b" draggable="false" data-direction="b">
      <img src="~assets/arrow.png" class="arrow arrow-l" draggable="false" data-direction="l">
      <img src="~assets/arrow.png" class="arrow arrow-r" draggable="false" data-direction="r">
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'node',
  data() {
    return {
      arrow: {
        show: false,
        width: '',
        height: ''
      }
    };
  },
  props: {
    option: {
      type: Object
    }
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
  methods: {
    ...mapMutations('flow', ['UPDATE_NODE']),
    enterArrow() {},
    outArrow() {},
    dragstart(id) {
      let img = this.$refs[id].$el.childNodes[0],
        dataTransfer = event.dataTransfer;

      dataTransfer.dropEffect = 'copy';
      dataTransfer.setData('Text', `update:${this.option.id}`);
      dataTransfer.setDragImage(img, 0, 0);
      this.arrow.show = false;
    },
    mouseover(id) {
      let { width, height } = this.$refs[id].$el.childNodes[0].getBBox();
      width = `${width.toFixed(0)}px`;
      height = `${height.toFixed(0)-3}px`;
      this.arrow = {
        ...this.arrow,
        width,
        height
      };
      this.arrow.show = true;
    },
    mouseout() {
      this.arrow.show = false;
    }
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
  cursor: crosshair;
  .arrow {
    opacity: 0.3;
    z-index: 9999;
    &-t {
      top: 0;
      left: 50%;
      transform: translate(-50%, -150%);
    }
    &-b {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 150%);
    }
    &-l {
      bottom: 50%;
      left: 0;
      transform: translate(-150%, 50%);
    }
    &-r {
      bottom: 50%;
      right: 0;
      transform: translate(150%, 50%);
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>