<template>
  <div id="flowLeftTool" class="flow-left-tool">
    <div class="flt-container">
      <div class="flt-search">
        <div class="flt-input-wrap">
          <input placeholder="搜索形状" type="text" class="flt-input" v-model="searchCont">
          <icon name="sousuo" :size="14" class="flt-search-icon"></icon>
        </div>
      </div>
      <div style="margin:10px">
        <div class="flt-input-svg" title="添加SVG" @drop.stop.prevent="dropHandle" @dragover.stop.prevent="dragoverHandle">
          <div class="flt-input-svg-box">添加SVG</div>
        </div>
      </div>
      <ul>
        <li class="flt-tool-list" v-for="(tool,index) in searchToolItems" :key="index">
          <div class="flt-list-tit" @click.stop="tool.show = !tool.show">
            <icon :name="tool.show?'down-arrow':'up-arrow'" :size="8" class="flt-icon"></icon>
            <span>{{tool.title}}</span>
          </div>
          <div class="flt-shape-list" v-show="tool.show">
            <div class="flt-item-box">
              <template v-if="tool.title==='自定义'">
                <div class="flt-list-item" draggable="true" v-for="(item,index) in userImages" :key="index" :title="item.title" @mousedown="selNode('SvgImage')" @dragstart="dragstart(item)">
                  <svg class="flt-list-svg">
                    <svg-image :imgSrc="item"></svg-image>
                  </svg>
                </div>
              </template>
              <template v-else>
                <div class="flt-list-item" draggable="true" v-for="(item,index) in tool.listData" :key="index" :title="item.title" @dragstart="selNode(item.type)" @dragend="nodeDragEnd">
                  <icon :name="item.type" :size="30" transform="translate(0.5,0.5)" />
                </div>
              </template>
            </div>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'flow-left-tool',
  data() {
    return {
      selItem: undefined,
      searchCont: '',
      toolItems: [
        {
          title: '流程图',
          listData: [
            {
              type: 'start',
              title: '开始'
            },
            {
              type: 'process',
              title: '流程'
            },
            {
              type: 'decision',
              title: '判断'
            },
            {
              type: 'document',
              title: '文档'
            },
            {
              type: 'terminator',
              title: '终端'
            },
            {
              type: 'data',
              title: '数据'
            },
            {
              type: 'manualInput',
              title: '输入'
            },
            {
              type: 'storeData',
              title: '状态数据'
            }
          ],
          show: true
        },
        {
          title: '物联网',
          listData: [
            {
              type: 'kongzhizhongxin',
              title: '控制中心'
            },
            {
              type: 'duidaoyi',
              title: '对刀仪机器人'
            },
            {
              type: 'chechuangjiqiren',
              title: '机器人'
            },
            {
              type: 'gongchang1',
              title: '工厂'
            },
            {
              type: 'gongchang',
              title: '折弯机'
            },
            {
              type: 'qichexuanfu',
              title: '汽车悬浮'
            },
            {
              type: 'dianji',
              title: '电机'
            },
            {
              type: 'qichemada',
              title: '汽车发动机'
            }
          ],
          show: true
        },
        {
          title: '网络图形',
          listData: [
            {
              type: 'network',
              title: '网络'
            },
            {
              type: 'virtual-device',
              title: '虚拟设备'
            },
            {
              type: 'middleware',
              title: '中间件'
            },
            {
              type: 'monitor',
              title: '显示器'
            },
            {
              type: 'dome-camera',
              title: '球形摄像机'
            },
            {
              type: 'gun-camera',
              title: '枪式摄像机'
            },
            {
              type: 'printer',
              title: '打印机'
            },
            {
              type: 'network-server',
              title: '网络服务器'
            },
            {
              type: 'host-hardware',
              title: '主机硬件'
            },
            {
              type: 'building',
              title: '建筑'
            },
            {
              type: 'business-services',
              title: '业务服务'
            },
            {
              type: 'database',
              title: '数据库'
            },
            {
              type: 'router',
              title: '路由器'
            },
            {
              type: 'switch',
              title: '交换机'
            },
            {
              type: 'hubs',
              title: '集线器'
            },
            {
              type: 'layer-three-switch',
              title: '三层交换机'
            },
            {
              type: 'unknown-device',
              title: '未知设备'
            },
            {
              type: 'server',
              title: '服务器'
            },
            {
              type: 'firewall-fire',
              title: '防火墙'
            },
            {
              type: 'standard-service',
              title: '标准服务器'
            }
          ],
          show: true
        },
        {
          title: '自定义',
          listData: [
            {
              type: 'start',
              title: '开始'
            }
          ],
          show: true
        }
      ],
      svgStyle: {},
      userImages: []
    };
  },
  computed: {
    ...mapState('flow', ['inDrawArea', 'selNodeType']),
    searchToolItems() {
      if (this.searchCont === '') {
        return this.toolItems;
      } else {
        let deepCopy = (s, t = {}) => {
          for (var i in s) {
            if (typeof s[i] === 'object') {
              t[i] = s[i].constructor === Array ? [] : {};
              deepCopy(s[i], t[i]);
            } else {
              t[i] = s[i];
            }
          }
          return t;
        };
        let list = this.toolItems.map(item => {
          return deepCopy(item);
        });
        list = list.filter(item => {
          if (item.title === '自定义') {
            return true;
          }
          let listData = item.listData.filter(item => {
            if (item.title.indexOf(this.searchCont) >= 0) {
              return true;
            }
          });
          if (listData.length !== 0) {
            item.listData = listData;
            return true;
          }
        });
        return list;
      }
    }
  },
  methods: {
    ...mapMutations('flow', ['SEL_NODETYPE', 'SET_DRAGGING', 'SET_INDRAWAREA']),
    selNode(type) {
      this.SEL_NODETYPE(type);
      event.dataTransfer.setData('Text', 'add');
    },
    nodeDragEnd() {
      if (this.selNodeType) {
        this.SEL_NODETYPE('');
      }
    },
    dropHandle(e) {
      let reader = new FileReader();
      let file = e.dataTransfer.files[0];
      reader.onload = e => {
        this.userImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    dragoverHandle() {},
    dragstart(imgSrc) {
      event.dataTransfer.setData('URL', imgSrc);
      event.dataTransfer.setData('Text', 'add');
    }
  }
};
</script>

<style lang="scss">
.flow-left-tool {
  width: 208px;
  position: absolute;
  top: 66px;
  bottom: 0;
  overflow: auto;
  background: whiteSmoke;
  box-shadow: -1px 0px 5px #bbb inset;
  border-right: 1px solid #ddd;
  .flt-list-svg {
    width: 36px;
    height: 36px;
    display: block;
    position: relative;
    overflow: hidden;
    cursor: move;
    left: 2px;
    top: 2px;
  }
  .flt-container {
    .flt-list-tit {
      color: #333;
      background: #eee;
      padding: 6px 0px 6px 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4em;
      font-size: 9pt;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    ul {
      margin-right: 3px;
    }
    .flt-icon {
      margin-right: 8px;
    }
    .flt-shape-list {
      display: flex;
      flex-wrap: wrap;
      background: #f5f5f5;
      .flt-item-box {
        display: flex;
        padding: 1px;
        flex-wrap: wrap;
        align-items: center;
        cursor: move;
        .flt-list-item {
          width: 36px;
          height: 36px;
          overflow: hidden;
          cursor: move;
          background: none;
          margin-left: 10px;
        }
      }
    }
  }
  .flt-input-svg {
    touch-action: none;
    cursor: pointer;
    border: 3px solid transparent;
  }

  .flt-input-svg-box {
    border-radius: 6px;
    border: 3px dotted lightgray;
    text-align: center;
    padding: 8px;
    color: rgb(179, 179, 179);
  }

  .flt-search {
    box-sizing: border-box;
    overflow: hidden;
    width: 100%;
    padding: 14px 15px 0px;
    .flt-input-wrap {
      white-space: nowrap;
      text-overflow: clip;
      padding-bottom: 8px;
      cursor: default;
    }
    .flt-input {
      font-size: 12px;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid rgb(213, 213, 213);
      border-radius: 4px;
      width: 100%;
      outline: none;
      padding: 6px 20px 6px 6px;
    }
    .flt-search-icon {
      position: absolute;
      top: 23px;
      right: 25px;
    }
  }
}
</style>
