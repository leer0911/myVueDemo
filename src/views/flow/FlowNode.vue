<template>
  <div class="flow-node" @dragend="dragEnd()" :transform="option.transform" @mouseover="mouseover()" @mouseout="mouseout()">
    <icon :name="option.type" :size="80" :transform="option.transform"/>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'node',
  data() {
    return {
      arrow: {
        show: true,
        position: {
          t: '',
          b: '',
          l: '',
          r: ''
        }
      }
    };
  },
  props: {
    option: {
      type: Object
    }
  },
  computed: {
    ...mapState('flow', ['nodeData'])
  },
  methods: {
    ...mapMutations('flow', ['UPDATE_NODE']),
    mouseover() {
      this.arrow.show = true;
      console.log(this.showArrow);
    },
    mouseout(){
      this.arrow.show = false;
    },
    dragEnd() {
      let x = event.offsetX,
        y = event.offsetY,
        val = `translate(${x},${y})`,
        id = event.target.id;

      this.UPDATE_NODE({
        [id]: {
          ...this.nodeData[id],
          transform: val,
          top: y,
          left: x
        }
      });
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
.arrow {
  position: absolute;
  opacity: 0.3;
  z-index: 9999;
  cursor: crosshair;
  &-bottom {
    transform: rotate(-180deg);
  }
  &-left {
    transform: rotate(-90deg);
  }
  &-right {
    transform: rotate(90deg);
  }
  &:hover {
    opacity: 1;
  }
}
</style>