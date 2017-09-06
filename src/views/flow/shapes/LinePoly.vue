<template>
  <g v-bind="gStyle">
    <slot></slot>
    <g>
      <polyline v-bind="style" />
    </g>
  </g>
</template>

<script>
export default {
  name: 'LinePoly',
  data () {
    return {
      defaultStyle: {
        points: '0,0',
        stroke: '#333',
        'stroke-width': 1.2,
        'fill': 'none',
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