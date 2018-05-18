<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'FlowLine',
  render(h) {
    const realLine = {
      attrs: {
        ...this.style
      }
    };
    const shadowLine = {
      attrs: {
        ...this.shadowStyle
      }
    };
    const changeLineType = type => {
      switch (type) {
        case 'StraightLine':
          return (
            <g>
              <line {...realLine} />
              <line {...shadowLine} />
            </g>
          );
          break;
        case 'LinePoly':
          return (
            <g>
              <polyline {...realLine} />
              <polyline {...shadowLine} />
            </g>
          );
          break;
      }
    };
    return <g>{changeLineType(this.option.type)}</g>;
  },
  data() {
    return {
      defaultStyle: {
        stroke: '#333',
        'stroke-width': 1.2,
        'marker-end': 'url(#markerArrow)'
      },
      defaultShadow: {
        'stroke-width': 15,
        visibility: 'hidden',
        'pointer-events': 'stroke',
        'marker-end': ''
      }
    };
  },
  components: {},
  props: {
    option: {
      type: Object
    }
  },
  computed: {
    style() {
      let { x: x1, y: y1 } = this.option.startPosition;
      let { x: x2, y: y2 } = this.option.endPosition;
      return {
        ...this.defaultStyle,
        x1,
        y1,
        x2,
        y2
      };
    },
    shadowStyle() {
      return {
        ...this.style,
        ...this.defaultShadow
      };
    }
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss">
</style>