<template>
  <section class="arrow-wrap" :style="arrow" v-if="arrowVisible">
    <img src="~assets/arrow.png" draggable="false" class="arrow" v-for="(item,index) in ['t','b','l','r']" :key="index" :class="`arrow-${item}`" @mouseover="arrowPointEnter" @mouseleave="arrowPointLeave" @mousedown="drawLineStart(item)" @mouseup="drawLineSuccess(item)">
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { deepCopy } from './utils';

export default {
  name: 'name',
  data() {
    return {
      pointRectPadding: 0,
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
    ...mapState('flow', ['nodeData', 'lineData', 'selLineType']),
    arrow() {
      if (!this.nodeId) {
        return;
      }
      let { width, height, left, top, x, y } = this.nodeData[this.nodeId];
      width = `${(width + this.pointRectPadding).toFixed(0)}px`;
      height = `${(height + this.pointRectPadding).toFixed(0)}px`;
      left = left + x;
      top = top + y;
      return {
        width,
        height,
        left,
        top
      };
    }
  },
  props: {
    nodeId: {
      type: String
    },
    arrowVisible: {
      type: Boolean
    }
  },
  methods: {
    ...mapMutations('flow', ['UPDATE_LINE']),
    arrowPointEnter() {
      this.$emit('arrowPointEnter');
    },
    arrowPointLeave() {
      this.$emit('arrowPointLeave');
    },
    drawLineStart(direction) {
      this.lineInfo.startPosition = this.getPointPosition(event.target);
      this.lineInfo.lineDrawing = true;
    },
    drawLineSuccess(direction) {
      if (this.lineInfo.lineDrawing) {
        return;
      }
      console.log(this.lineInfo)
      this.lineInfo.endPosition = this.getPointPosition(event.target);
      let lineId = 'line-' + new Date().getTime();
      let lineData = deepCopy(this.lineInfo);
      this.UPDATE_LINE({
        [lineId]: {
          ...lineData,
          lineId,
          type:this.selLineType
        }
      });
      this.lineInfo.lineDrawing = false;
    },
    getPointPosition(target) {
      let { offsetLeft: x, offsetTop: y } = target;
      let { top, left } = this.arrow;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: move;
  .arrow {
    opacity: 0.3;
    z-index: 9999;
    cursor: crosshair;
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