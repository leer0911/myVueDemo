<template>
  <g v-bind="svgTransform">
    <slot></slot>
    <g transform="translate(0.5,0.5)">
      <path v-bind="style"></path>
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
  name: 'start',
  mixins: [tplMixin],
  data () {
    return {
      defaultStyle: {
        d: 'M 18 8 L 33 18 L 18 27 L 2 18 Z',
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 1,
        'cursor': 'move'
      },
      drawStyle: {
        d: 'M 0 -32 L 64 0 L 0 32 L -64 0 Z'
      }
    }
  }
}
</script>