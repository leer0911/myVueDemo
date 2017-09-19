<template>
  <g v-bind="gStyle">
    <slot></slot>
    <g>
      <line v-bind="style" />
      <line v-bind="shadowStyle" />
    </g>
    <foreignObject :pointer-events="editable ? 'all': 'none'" :transform="textStyle">
      <div contenteditable="plaintext-only" class="line-text">
        {{text}}
      </div>
    </foreignObject>
  </g>
</template>

<script>
export default {
  name: 'StraightLine',
  data () {
    return {
      defaultStyle: {
        x1: '0',
        y1: '0',
        x2: '0',
        y2: '0',
        stroke: '#333',
        'stroke-width': 1.2,
        'marker-end': 'url(#markerArrow)'
      },
      defaultShadow: {
        'stroke-width': 15,
        'visibility': 'hidden',
        'pointer-events': 'stroke',
        'marker-end': ''
      }
    }
  },
  computed: {
    svgTransform () {
      let obj = {
        transform: this.transform
      }
      return obj
    },
    textStyle () {
      let { x1, x2, y1, y2 } = this.lineStyle
      let x = +((x2 - x1) / 2) + x1
      let y = +((y2 - y1) / 2) + y1
      return `translate(${x},${y})`
    },
    style () {
      return Object.assign({}, this.defaultStyle, this.lineStyle)
    },
    shadowStyle () {
      return Object.assign({}, this.defaultStyle, this.defaultShadow, this.lineStyle)
    }
  },
  props: {
    lineStyle: {
      type: Object
    },
    gStyle: {
      type: Object
    },
    editable: {
      type: Boolean
    },
    text: {
      type: String
    }
  }
}
</script>