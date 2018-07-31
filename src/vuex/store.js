import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    restaurants: [],
    tableData: [],
    value7: '',
    SKey:'',
    tbCount:0,
    currentPage:1,
    pageSize:15
  },
  mutations:{
    newRestaurants(state,msg){
      state.restaurants=msg
    },
    newTableData(state,msg){
      state.tableData=msg
    },
    newValue7(state,msg){
      state.value7=msg
    },
    newTbCount(state,msg){
      state.tbCount=msg
    },
    newCurrentPage(state,msg){
      state.currentPage=msg
    },
    newSKey(state,msg){
      state.SKey=msg
    },
    newPageSize(state,msg){
      state.pageSize=msg
    }

  }
})

export default store
