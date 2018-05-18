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
import { deepCopy, pxToNumber, getRelativePosition } from './utils';
import * as d3 from 'd3';

export default {
  name: 'Arrow',
  data() {
    return {
      pointRectPadding: 0,
      lineDrawing: false,
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
        },
        startId: '',
        endId: ''
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
    ...mapMutations('flow', ['UPDATE_LINE', 'UPDATE_SHADOW_LINE']),
    arrowPointEnter(direction) {},
    arrowPointLeave() {},
    drawLineStart(direction) {
      this.lineDrawing = true;
      this.lineInfo = {
        ...this.lineInfo,
        startPosition: { ...this.getPointPosition(event.target) },
        startId: this.nodeId
      };
      this.$parent.$el.addEventListener('mousemove', this.lineDrawingHandle);
    },
    lineDrawingHandle() {
      const { target, currentTarget, clientX, clientY } = event;
      const { top, left } = this.$parent.$el.getBoundingClientRect();
      const { startPosition } = this.lineInfo;
      this.UPDATE_SHADOW_LINE({
        startPosition,
        endPosition: {
          x: clientX - left,
          y: clientY - top
        },
        type: this.selLineType
      });
    },
    drawLineSuccess(direction) {
      const { startId } = this.lineInfo;
      this.$parent.$el.removeEventListener('mousemove', this.lineDrawingHandle);
      if (!this.lineDrawing || startId === this.nodeId) {
        return;
      }
      this.lineInfo = {
        ...this.lineInfo,
        endPosition: { ...this.getPointPosition(event.target) },
        endId: this.nodeId
      };
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
      const { top, left } = getRelativePosition(target, this.$parent.$el);
      const { width, height } = target.getBoundingClientRect();
      return {
        x: left + width / 2,
        y: top + height / 2
      };
    },
    drawLineEnd() {
      this.lineDrawing = false;
      this.UPDATE_SHADOW_LINE(null);
      this.$parent.$el.removeEventListener('mousemove', this.lineDrawingHandle);
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.drawLineEnd);
  },
  destroyed() {
    document.removeEventListener('mouseup', this.drawLineEnd);
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