<template>
  <g v-bind="gStyle">
    <slot></slot>
    <g>
      <line v-bind="style" />
    </g>
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
    style () {
      return Object.assign({}, this.defaultStyle, this.lineStyle)
    }
  },
  props: {
    lineStyle: {
      type: Object
    },
    gStyle: {
      type: Object
    }
  }
}
</script>

<style>

</style>