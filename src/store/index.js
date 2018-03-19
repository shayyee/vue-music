/**
 * Created by lenovo on 2018/3/19.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: debug? [createLogger()] : [],
  strict: debug  // 开发环境下 开启严格模式
})