<template>
  <div id="FlowNodeDarw" style="position: relative;width:100%;height:100%">
    <flow-node v-for="(item,index) in nodeData" :key="index" :option="item"></flow-node>
  </div>
</template>

<script>
import FlowNode from './FlowNode';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'FlowNodeDarw',
  components: {
    FlowNode
  },
  computed: {
    ...mapState('flow', [
      'nodeData',
      'selNodeType',
      'dragging',
      'lineData',
      'selLineType',
      'drawStyle'
    ])
  }
};
</script>

<style scoped>

</style>