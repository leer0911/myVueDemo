<template>
  <div id='refLine' class="ref-line-wrap">
    <!-- 这边为了偷懒采用了数组传值拼贴style 的方式 -->
    <div v-if="item.isNearly" class="ref-line" :class="`ref-line-${item.refLine[0]}`" :style="{[item.refLine[0]]:`${item.refLine[1]}px`}" v-for="(item,index) in refLineData" :key="index"></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'refLine',
  data() {
    return {
      options: {
        gap: ''
      }
    };
  },
  props: {
    refLineData: {
      type: Array
    }
  },
  computed: {}
};
</script>

<style>
.ref-line-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}
.ref-line {
  opacity: 0.7;
  position: absolute;
  background: #4daeff;
  z-index: 99999;
}
.ref-line-top {
  width: 100%;
  height: 1px;
  left: 0;
}
.ref-line-lefr {
  width: 1px;
  height: 100%;
  top: 0;
}
</style>