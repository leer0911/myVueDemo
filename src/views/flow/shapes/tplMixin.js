export default {
  computed: {
    svgTransform () {
      let obj = {
        transform: this.transform
      }
      return obj
    },
    style () {
      if (!this.inDraw) {
        return Object.assign({}, this.defaultStyle, this.shapeStyle)
      }
      return Object.assign({}, this.defaultStyle, this.shapeStyle, this.drawStyle)
    }
  },
  props: {
    shapeStyle: {
      type: Object
    },
    inDraw: {
      type: Boolean,
      default: false
    },
    transform: {
      type: String
    },
    text: {
      type: String
    },
    editable: {
      type: Boolean
    }
  }
}
