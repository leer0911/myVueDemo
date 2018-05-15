<template>
  <div class="crumbs">
    <strong class="unuse">Platform</strong>
    <span class="split-line">/</span>
    <strong>未命名</strong>
  </div>
</template>

<script>
export default {};
</script>

<style  lang="scss">
.crumbs {
  width: 100%;
  height: 50px;
  background: #fff;
  border-top: 3px solid #ddd;
  color: #333;
  padding-left: 20px;
  display: flex;
  align-items: center;
  .unuse {
    color: #999;
  }
  .split-line {
    margin: 0 8px;
  }
}
</style>