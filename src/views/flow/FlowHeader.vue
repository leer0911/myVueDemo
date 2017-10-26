<template>
  <div id="flowHeader" class="flow-header">
    <icon name="rcslogo" :size="20"></icon>
    <ul class="flow-menu">
      <li v-for="(item,index) in flowMenu" :key="index">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'flowHeader',
  data() {
    return {
      flowTitle: '未命名表单',
      flowMenu: [{ name: '文件' }, { name: '保存' }]
    };
  }
};
</script>

<style lang="scss">
.flow-header {
  background: #1f88d6;
  color: #fff;
  display: flex;
  align-items: center;
  padding-left: 15px;
  .flow-title {
    padding: 2px 8px;
    font-size: 16px;
  }
  .flow-menu {
    display: flex;
    margin-left: 10px;
    li {
      padding: 6px 8px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>