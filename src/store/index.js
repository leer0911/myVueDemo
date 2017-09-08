import Vue from 'vue'
import Vuex from 'vuex'
import flow from './flow'
// import _ from 'lodash'
import { cloneDeep } from 'lodash/fp'
// import { fromJS } from 'immutable'

const undoRedoPlugin = (store) => {
  let firstState = cloneDeep(store.state);

  undoRedoHistory.init(store);
  undoRedoHistory.addState(firstState);

  store.subscribe((mutation, state) => {

    let filterMuation = [
      'flow/SEL_NODETYPE',
      // 'flow/UPDATE_NODE'
      'flow/UPDATE_HISTORY',
      'flow/UPDATE_HISTORYINDEX',
      'flow/UNDO',
      'flow/REDO'
    ]
    let type = mutation.type
    let condition = filterMuation.indexOf(type)
    let length = undoRedoHistory.history.length
    let index = undoRedoHistory.currentIndex
    // 只有新增
    if (condition <= -1) {
      undoRedoHistory.addState(cloneDeep(state));
    }
    switch (type) {
      case 'flow/UNDO':
        if (index > 0) {
          undoRedoHistory.undo()
        }
        break;
      case 'flow/REDO':
        if (index !== length - 1) {
          undoRedoHistory.redo()
        }
        break;
      default:
        break;
    }
    if (index > 0) {
      store.commit('flow/UPDATE_HISTORY', true)
    } else {
      store.commit('flow/UPDATE_HISTORY', false)
    }

    if (index !== length - 1) {
      store.commit('flow/UPDATE_HISTORYINDEX', true)
    } else {
      store.commit('flow/UPDATE_HISTORYINDEX', false)
    }

  });
}

class UndoRedoHistory {
  store
  history = []
  currentIndex = -1

  init(store) {
    this.store = store;
  }

  addState(state) {
    if (this.currentIndex + 1 < this.history.length) {
      this.history.splice(this.currentIndex + 1);
    }
    this.history.push(state);
    this.currentIndex++;
  }

  undo() {
    const prevState = this.history[this.currentIndex - 1];
    this.store.replaceState(cloneDeep(prevState));
    this.currentIndex--;
  }

  redo() {
    const nextState = this.history[this.currentIndex + 1];
    this.store.replaceState(cloneDeep(nextState));
    this.currentIndex++;
  }
}

const undoRedoHistory = new UndoRedoHistory();

Vue.use(Vuex)
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
  plugins: [undoRedoPlugin],
  modules: {
    flow
  }
})
