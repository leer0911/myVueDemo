<template>
  <g v-bind="svgTransform">
    <slot></slot>
    <g transform="translate(0.5,0.5)">
      <rect v-bind="style">
      </rect>
    </g>
    <foreignObject :pointer-events="editable ? 'all': 'none'" v-if="inDraw">
      <div :contenteditable="editable" class="shape-text">
        {{text}}
      </div>
    </foreignObject>
  </g>
</template>

<script>
import tplMixin from './tplMixin'
export default {
  name: 'general',
  mixins: [tplMixin],
  data () {
    return {
      defaultStyle: {
        x: '2',
        y: '10',
        width: 31,
        height: 16,
        rx: '2',
        ry: '2',
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 1,
        'cursor': 'move'
      },
      drawStyle: {
        rx: '9',
        ry: '9',
        x: -53,
        y: -22,
        width: 106,
        height: 44
      }
    }
  }
}
</script>
<style>

</style>
