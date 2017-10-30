<template>
  <g v-bind="svgTransform">
    <slot></slot>
    <g transform="translate(0.5,0.5)">
      <image :href="imgSrc" v-bind="style"></image>
    </g>
    <foreignObject :pointer-events="editable ? 'all': 'none'" v-if="inDraw">
      <div contenteditable="plaintext-only" class="shape-text">
        {{text}}
      </div>
    </foreignObject>
  </g>
</template>

<script>
import tplMixin from './tplMixin'
export default {
  name: 'svgImage',
  mixins: [tplMixin],
  data() {
    return {
      defaultStyle: {
        x: 0,
        y: 0,
        width: 36,
        height: 36
      },
      drawStyle: {
        x: -36,
        y: -36,
        width: 72,
        height: 72
      }
    }
  },
  props: {
    imgSrc: {
      type: String
    }
  }
}
</script>