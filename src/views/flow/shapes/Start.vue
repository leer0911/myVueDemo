<template>
  <g v-bind="svgTransform">
    <slot></slot>
    <g>
      <ellipse v-bind="style"></ellipse>
    </g>
  </g>
</template>

<script>
export default {
  name: 'start',
  data () {
    return {
      defaultStyle: {
        cx: '18',
        cy: '18',
        rx: '15',
        ry: '9',
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 1,
        'cursor': 'move'
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
      return Object.assign({}, this.defaultStyle, this.shapeStyle)
    }
  },
  props: {
    shapeStyle: {
      type: Object
    },
    transform: {
      type: String
    }
  }
}
</script>

<style>

</style>