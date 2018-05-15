<template>
  <section class="arrow-wrap"
    :style="arrow"
    v-show="nodeId">
    <img src="~assets/arrow.png"
      draggable="false"
      class="arrow"
      v-for="(item,index) in ['t','b','l','r']"
      :key="index"
      :class="`arrow-${item}`"
      @mouseover="arrowPointEnter(item)"
      @mouseleave="arrowPointLeave"
      @mousedown="drawLineStart(item)"
      @mouseup="drawLineSuccess(item)">
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { deepCopy } from './utils';

export default {
  name: 'Arrow',
  data() {
    return {
      pointRectPadding: 0,
      a: 123,
      lineInfo: {
        lineDrawing: false,
        type: '',
        startPosition: {
          x: 0,
          y: 0
        },
        endPosition: {
          x: 0,
          y: 0
        }
      }
    };
  },
  computed: {
    ...mapState('flow', [
      'nodeData',
      'lineData',
      'selLineType',
      'hoverNodeData',
      'hoverArrowPoint'
    ]),
    nodeId() {
      return this.hoverNodeData.id;
    },
    arrow() {
      if (!this.nodeId || !this.nodeData[this.nodeId]) {
        return;
      }
      let { width, height, left, top, x, y } = this.nodeData[this.nodeId];
      width = `${(width + this.pointRectPadding).toFixed(0)}px`;
      height = `${(height + this.pointRectPadding).toFixed(0)}px`;
      left = left + x + 'px';
      top = top + y + 'px';
      return {
        width,
        height,
        left,
        top
      };
    }
  },
  methods: {
    ...mapMutations('flow', ['UPDATE_LINE', 'UPDATE_HOVER_ARROW']),
    arrowPointEnter(direction) {
      this.UPDATE_HOVER_ARROW({
        direction
      });
    },
    arrowPointLeave() {
      this.UPDATE_HOVER_ARROW({
        direction: ''
      });
    },
    drawLineStart(direction) {
      this.lineInfo.startPosition = { ...this.getPointPosition(event.target) };
      this.lineInfo.lineDrawing = true;
    },
    drawLineSuccess(direction) {
      if (this.lineInfo.lineDrawing) {
        return;
      }
      this.lineInfo.endPosition = { ...this.getPointPosition(event.target) };
      const lineId = 'line-' + new Date().getTime();
      const lineData = deepCopy(this.lineInfo);
      this.UPDATE_LINE({
        [lineId]: {
          ...lineData,
          lineId,
          type: this.selLineType
        }
      });
      this.lineInfo.lineDrawing = false;
    },
    getPointPosition(target) {
      const { offsetLeft: x, offsetTop: y } = target;
      const { top, left } = this.arrow;
      return {
        x: x + left,
        y: y + top
      };
    },
    drawLineFail() {
      this.lineInfo.lineDrawing = false;
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.drawLineFail);
  }
};
</script>

<style lang="scss">
.arrow-wrap {
  position: absolute;
  cursor: move;
  .arrow {
    opacity: 0.3;
    z-index: 9999;
    cursor: crosshair;
    position: absolute;
    z-index: 99999;
    &-t {
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &-b {
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
    }
    &-l {
      bottom: 50%;
      left: 0;
      transform: translate(-50%, 50%);
    }
    &-r {
      bottom: 50%;
      right: 0;
      transform: translate(50%, 50%);
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>