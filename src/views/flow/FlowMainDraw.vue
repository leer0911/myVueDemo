<template>
  <div id="flowMainCont"
    class="flow-main-cont">
    <div id="drawContainer"
      class="draw-wrap">
      <flow-crumbs></flow-crumbs>
      <div id="draw"
        class="main-bg"
        :style="{transform:`scale(${drawStyle.zoomRate})`,transformOrigin:`${drawStyle.origin}`}"
        @drop.prevent="dropHandle"
        @dragover.stop.prevent
        @mousewheel.alt.prevent="wheelHandle">
        <flow-node-draw></flow-node-draw>
        <flow-line-draw></flow-line-draw>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import FlowNodeDraw from './FlowNodeDraw';
import FlowLineDraw from './FlowLineDraw';
import FlowCrumbs from './FlowCrumbs';

export default {
  name: 'flowMainDraw',
  data() {
    return {
      zoomType: 'zoomIn'
    };
  },

  components: {
    FlowNodeDraw,
    FlowLineDraw,
    FlowCrumbs
  },
  computed: {
    ...mapState('flow', [
      'nodeData',
      'selNodeType',
      'lineData',
      'selLineType',
      'drawStyle'
    ])
  },
  methods: {
    ...mapMutations('flow', ['UPDATE_NODE', 'UPDATE_DRAWSTYLE']),
    wheelHandle(ev) {
      if (ev.deltaY < 0) {
        this.zoomType = 'zoomIn';
      } else {
        this.zoomType = 'zoomOut';
      }
      let x = ev.offsetX;
      let y = ev.offsetY;
      if (this.zoomType === 'zoomIn') {
        if (this.drawStyle.zoomRate < 3) {
          let zoomRate = this.drawStyle.zoomRate + 0.25;
          this.UPDATE_DRAWSTYLE({
            zoomRate,
            origin: `${x}px ${y}px`
          });
        }
      } else if (this.zoomType === 'zoomOut') {
        if (this.drawStyle.zoomRate > 0.25) {
          let zoomRate = this.drawStyle.zoomRate - 0.25;
          this.UPDATE_DRAWSTYLE({
            zoomRate,
            origin: `${x}px ${y}px`
          });
        }
      }
    },
    dropHandle(ev) {
      // 防止拖拽速度过快导致定位错误
      if (ev.target.tagName !== 'DIV') return;
      let cont = event.dataTransfer.getData('Text'),
        // 为了解决节点移动时位置问题，节点位置为 update:nodeID的形式
        key = cont.replace(/\:.*/g, ''),
        x = ev.offsetX - 40, // 这边的50是设置dragImage时的偏移量，(由于使 iconfont 实际icon与svg存在间隙)
        y = ev.offsetY - 40;
      ev.dataTransfer.dropEffect = 'copy';
      let fn = {
        update() {
          let id = cont.replace(/.*\:/g, '');
          this.UPDATE_NODE({
            [id]: {
              ...this.nodeData[id],
              top: y,
              left: x
            }
          });
        },
        add() {
          let id = 'node-' + new Date().getTime();
          let imgSrc = ev.dataTransfer.getData('URL');
          this.UPDATE_NODE({
            [id]: {
              id: 'node-' + new Date().getTime(),
              type: this.selNodeType,
              top: y,
              left: x,
              text: '',
              imgSrc
            }
          });
        }
      };
      if (typeof key !== 'undefined') {
        fn[key].call(this);
      }
    }
  },
  mounted() {
    document.addEventListener('contextmenu', ev => {
      ev.preventDefault();
    });
  }
};
</script>

<style lang="scss">
.flow-main-cont {
  right: 0;
  left: 208px;
  top: 66px;
  bottom: 0;
  overflow: auto;
  background: #ebebeb;
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .main-bg {
    overflow: hidden;
    width: 5000px;
    height: 5000px;
    background: url('../../assets/bg.png') #fff;
  }
  .draw-wrap {
    flex: 1;
    overflow: auto;
  }
}
</style>