<template>
  <div id="flow" class="flow">
    <flow-header></flow-header>
    <flow-top-tool></flow-top-tool>
    <flow-left-tool></flow-left-tool>
    <flow-main-draw></flow-main-draw>
    <!-- <flow-right></flow-right> -->
  </div>
</template>

<script>
import FlowHeader from './FlowHeader'
import FlowLeftTool from './FlowLeftTool'
import FlowRight from './FlowRight'
import FlowTopTool from './FlowTopTool'
import FlowMainDraw from './FlowMainDraw'

export default {
  name: 'flow',
  components: {
    FlowHeader,
    FlowLeftTool,
    FlowRight,
    FlowTopTool,
    FlowMainDraw
  }
}
</script>

<style lang="scss">
@import 'flow.scss';
</style>