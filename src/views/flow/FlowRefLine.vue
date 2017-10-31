<template>
  <div id='refLine' class="ref-line-wrap">
    <div class="ref-line ref-line-h" v-for="(item,index) in refLineData" :key="index"></div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'refLine',
  data(){
    return{
      options:{
        gap:''
      }
    }
  },
  props:{
    refLineData:{
      type:Array
    }
  },
  computed: {
  }
};
</script>

<style>
.ref-line-wrap {
  width: 100%;
  height: 100%;
}
.ref-line {
  opacity: 0.7;
  position: absolute;
  background: #4daeff;
  z-index: 99999;
}
.ref-line-h {
  width: 100%;
  height: 1px;
  left: 0;
}
.ref-line-v {
  width: 1px;
  height: 100%;
  top: 0;
}
</style>