<template>
  <div id="flow" class="flow">
    <flow-header></flow-header>
    <flow-top-tool></flow-top-tool>
    <flow-left-tool></flow-left-tool>
    <flow-main-cont></flow-main-cont>
  </div>
</template>

<script>
import FlowHeader from './FlowHeader'
import FlowLeftTool from './FlowLeftTool'
import FlowTopTool from './FlowTopTool'
import FlowMainCont from './FlowMainCont'

export default {
  name: 'flow',
  components: {
    FlowHeader,
    FlowLeftTool,
    FlowTopTool,
    FlowMainCont
  }
}
</script>

<style lang="scss">
@import 'flow.scss';
</style>