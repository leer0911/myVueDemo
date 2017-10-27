<template>
    <div class="arrow-wrap" :style="{width:arrow.width,height:arrow.height}" v-if="arrow.show" @mouseleave="mouseLeaveNode(option.id)">
      <img src="~assets/arrow.png" class="arrow" draggable="false" v-for="(item,index) in ['t','b','l','r']" :key="index" :class="`arrow-${item}`">
    </div>
</template>

<script>
export default {
  name: 'name',
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
    nodeId: {
      type: String
    },
    arrowVisible: {
      type: Boolean
    }
  }
};
</script>

<style scoped>

</style>