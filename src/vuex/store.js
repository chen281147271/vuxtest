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
    pageSize:15,
    d_arr:[],
    d_arr_sat:[],
    d_arr_all:[],
    value7s: [],
    tableData2: [],
    bAuth:false,
    tableDataYG: [],
    tbCountYG:0,
    currentPageYG:1,
    pageSizeYG:15,
  },
  mutations:{
    newAuth(state,msg){
      state.bAuth=msg
    },
    newtableData2(state,msg){
      state.tableData2=msg
    },
    newValue7s(state,msg){
      state.value7s=msg
    },
    newD_arr(state,msg){
      state.d_arr=msg
    },
    newD_arr_sat(state,msg){
      state.d_arr_sat=msg
    },
    newD_arr_all(state,msg){
      state.d_arr_all=msg
    },
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
    },
    newTbCountYG(state,msg){
      state.tbCountYG=msg
    },
    newCurrentPageYG(state,msg){
      state.currentPageYG=msg
    },
    newPageSizeYG(state,msg){
      state.pageSizeYG=msg
    },
    newTableDataYG(state,msg){
      state.tableDataYG=msg
    },

  }
})

export default store
