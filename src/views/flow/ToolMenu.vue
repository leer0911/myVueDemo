<template>
  <div class="tool-menu-container" v-show="visible">
    <ul id="toolMenu" class="tool-menu" :style="ulStyle">
      <li class="tool-menu-item" v-for="(item,index) in menuData" :key="index" @click.stop="clickFn(item)">
        {{item.title}}
      </li>
    </ul>
    <!-- <div class="tool-menu-mask" @click="close"></div> -->
  </div>
</template>

<script>
export default {
  name: 'ToolMenu',
  components: {
  },
  props: {
    visible: {
      type: Boolean
    },
    menuData: {
      type: Array
    },
    ulStyle: {
      type: String
    }
  },
  methods: {
    clickFn (item) {
      this.$emit(
        'selItme', item
      )
    },
    close () {
      if (this.visible) {
        this.$emit('update:visible', false)
      }
    },
    documentClick () {
      this.$emit('update:visible', false)
    }
  },

  mounted () {
    document.addEventListener('click', this.documentClick)
  }
}
</script>

<style lang="scss">
.tool-menu {
  border: 3px solid #e0e0e0;
  box-shadow: 2px 2px 3px #d5d5d5;
  background: #fff;
  position: absolute;
  border: 3px solid #e7e7e7;
  padding: 3px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 483px;
  z-index: 999;
  .tool-menu-item {
    transition: all 0.1s ease-in-out;
    padding: 5px;
    border-radius: 10px;
    border: whiteSmoke solid 3px;
    .z999 {
      z-index: 999;
    }
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}

.tool-menu-mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 998
}
</style>