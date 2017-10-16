<template>
  <div id="flowRight" class="flow-right">
    <!-- <span>节点数据</span>
    <div class="fr-cont">
      {{node}}
    </div>
    <span>连线数据</span>
    <div class="fr-cont">
      {{line}}
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'flow-right',
  computed: {
    ...mapState('flow', ['lineData', 'nodeData']),
    node() {
      return JSON.stringify(this.nodeData)
    },
    line() {
      return JSON.stringify(this.lineData)
    }
  }
}
</script>

<style lang="scss">
.flow-right {
  width: 208px;
  padding: 10px;
  position: absolute;
  top: 90px;
  bottom: 0;
  right: 0;
  background: whiteSmoke;
  .fr-cont {
    margin: 10px 0;
  }
}
</style>
