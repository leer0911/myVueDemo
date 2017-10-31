<template>
  <div id="FlowNodeDarw" class="node-draw" ref="FlowNodeDarw">
    <flow-node v-for="(item,index) in nodeData" :key="index" :option="item" @nodeDragStart="nodeDragStart" @nodeDragging="nodeDragging" @nodeDragEnd="nodeDragEnd"></flow-node>
    <flow-ref-line :refLineData="refLineData"></flow-ref-line>
  </div>
</template>

<script>
import FlowNode from './FlowNode';
import FlowRefLine from './FlowRefLine';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'FlowNodeDarw',
  data() {
    return {
      dragNodeId: '',
      dragging: false,
      dragNodeInfo: {},
      checkNodesData: [],
      refLineData: [],
      mouseInfo: {
        left: '',
        top: ''
      }
    };
  },
  components: {
    FlowNode,
    FlowRefLine
  },
  computed: {
    ...mapState('flow', ['nodeData'])
  },
  watch: {
    dragNodeId() {
      this.dragNodeInfo = {
        ...this.nodeData[this.dragNodeId]
      };
    }
  },
  methods: {
    nodeDragEnd(payload) {
      this.dragging = false;
    },
    nodeDragging(payload) {
      let { event } = payload;
      let { offsetLeft: left, offsetTop: top } = payload.event.target;
      let { x, y, height, width } = this.nodeData[payload.id];
      left += x;
      top += y;
      let right = left + width;
      let bottom = top + height;
      let dragData = {
        left,
        top,
        right,
        bottom,
        width,
        height,
        halfHeight: height / 2,
        halfWidth: width / 2
      };

      this.checkNodesData.forEach(target => {
        let {
          id,
          left,
          top,
          right,
          bottom,
          halfWidth,
          halfHeight,
          width,
          height
        } = target;
        if (id === payload.id) {
          return;
        }
        let conditions = {
          h: [
            // 水平参考线 - 上
            {
              isNearly: this.isNearly(dragData.top, top),
              refLine: {
                type: 'h',
                top: top
              }
            }
            // {
            //   isNearly: this.isNearly(dragData.top, bottom),
            //   refLine: {
            //     type: 'h',
            //     top: bottom
            //   }
            // },
            // // 水平参考线 - 中
            // {
            //   isNearly: this.isNearly(
            //     dragData.top + dragData.halfHeight,
            //     top + halfHeight
            //   ),
            //   refLine: {
            //     type: 'h',
            //     top: top + halfHeight
            //   }
            // },
            // // 水平参考线 - 下
            // {
            //   isNearly: this.isNearly(dragData.bottom, top),
            //   refLine: {
            //     type: 'h',
            //     top: top
            //   }
            // },
            // {
            //   isNearly: this.isNearly(dragData.bottom, bottom),
            //   refLine: {
            //     type: 'h',
            //     top: bottom
            //   }
            // }
          ]
          // v: [
          //   // 垂直参考线 - 左
          //   {
          //     isNearly: this.isNearly(dragData.left, left),
          //     refLine: {
          //       type: 'v',
          //       left: left
          //     }
          //   },
          //   {
          //     isNearly: this.isNearly(dragData.left, right),
          //     refLine: {
          //       type: 'v',
          //       left: right
          //     }
          //   },
          //   // 垂直参考线 - 右
          //   {
          //     isNearly: this.isNearly(dragData.right, left),
          //     refLine: {
          //       type: 'v',
          //       left: left
          //     }
          //   },
          //   {
          //     isNearly: this.isNearly(dragData.right, right),
          //     refLine: {
          //       type: 'v',
          //       left: right
          //     }
          //   },
          //   // 垂直参考线 - 中
          //   {
          //     isNearly: this.isNearly(
          //       dragData.left + dragData.halfWidth,
          //       left + halfWidth
          //     ),
          //     refLine: {
          //       type: 'v',
          //       left: left + halfWidth
          //     }
          //   }
          // ]
        };

        for (let key in conditions) {
          // 遍历符合的条件并处理
          conditions[key].forEach(condition => {
            if (!condition.isNearly) return;
            console.log(condition.refLine);
          });
        }
      });
    },
    isNearly(dragValue, targetValue) {
      // console.log(`dragValue:${dragValue}`);
      // console.log(`targetValue:${targetValue}`);
      return Math.abs(dragValue - targetValue) <= 3;
    },
    nodeDragStart(id) {
      this.dragging = true;
      this.checkNodes(id);
    },
    checkNodes(id) {
      // console.log(this.nodeData);
      let checkNodes = Object.values(this.nodeData);
      let top, height, bottom, left, width, right;

      this.checkNodesData = checkNodes.map(element => {
        let { width, height, left, top, x, y, id } = element;
        let right, bottom, halfWidth, halfHeight;
        left += x;
        top += y;
        right = left + width;
        bottom = top + height;
        halfWidth = width / 2;
        halfHeight = height / 2;
        return {
          id,
          left,
          top,
          right,
          bottom,
          halfWidth,
          halfHeight,
          width,
          height
        };
      });
    }
  },
  mounted() {}
};
</script>

<style scoped>
.node-draw {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
</style>