<template>
  <div id="flowHeader">
    <div class="flow-title">
      {{flowTitle}}
    </div>
    <ul class="flow-menu">
      <li v-for="(item,index) in flowMenu" :key="index">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'flowHeader',
  data () {
    return {
      flowTitle: '未命名表单',
      flowMenu: [
        { name: '文件' },
        { name: '编辑' }
      ]
    }
  }
}
</script>

<style lang="scss">
.flow-title {
  padding: 2px 8px;
  font-size: 16px;
}

.flow-menu {
  display: flex;
  li {
    padding: 6px 8px;
  }
}
</style>