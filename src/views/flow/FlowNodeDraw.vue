<template>
  <div id="FlowNodeDarw" class="node-draw">
    <flow-node v-for="(item,index) in nodeData" :key="index" :option="item"></flow-node>
    <flow-ref-line></flow-ref-line>
  </div>
</template>

<script>
import FlowNode from './FlowNode';
import FlowRefLine from './FlowRefLine';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'FlowNodeDarw',
  data() {
    return {
      dragNodeId: '',
      dragNodeInfo: {}
    };
  },
  components: {
    FlowNode,
    FlowRefLine
  },
  computed: {
    ...mapState('flow', ['nodeData'])
  },
  watch: {
    dragNodeId() {
      console.log(this.dragNodeId);
      this.dragNodeInfo = {
        ...this.nodeData[this.dragNodeId]
      };
    }
  },
  methods:{

  },
  mounted() {

  }
};
</script>

<style scoped>
.node-draw {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
</style>