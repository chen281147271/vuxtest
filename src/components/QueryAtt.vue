<template>
  <el-container>
    <el-header>
      <el-autocomplete
        clearable
        popper-class="my-autocomplete"
        v-model="SKey"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect">
        <i
          class="el-icon-edit el-input__icon"
          slot="suffix"
          @click="handleIconClick">
        </i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.NAME }}</div>
        </template>
      </el-autocomplete>
      日期：
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="query"
          :picker-options="pickerOptions2">
        </el-date-picker>
      <el-button type="primary" size="small" v-on:click="query" icon="search">查 询</el-button>
      <el-button type="primary" size="small" v-on:click="exportExcel" icon="search">导 出</el-button>
    </el-header>
    <el-main>
      <template>
        <el-table
          :hidden="true"
          :data="Print_tableData"
          stripe
          id="out-table"
          style="width: 100%">
          <el-table-column
            prop="USERID"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="NAME"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="CHECKTIME"
            :formatter="dateFormat"
            label="日期">
          </el-table-column>
        </el-table>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="USERID"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="NAME"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="CHECKTIME"
            :formatter="dateFormat"
            label="日期">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,15,20,25]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tbCount">
        </el-pagination>
      </template>
    </el-main>
  </el-container>
</template>

<script>
  import moment from 'moment'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
    export default {
        name: "QueryAtt",
      data() {
        return {
          restaurants: [],
          tableData: [],
          Print_tableData:[],
          pickerOptions2: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          value7: '',
          SKey:'',
          tbCount:0,
          currentPage:1,
          pageSize:15
        }
      },
      methods: {
        exportExcel () {
          /* generate workbook object from table */
          var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
          /* get binary string as output */
          var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
          try {
            FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          return wbout
        },
        getATTList(){
          this.getATTListPrint()
          let that=this
          let sTime=that.value7[0]
          let eTime=that.value7[1]
          let currentPage=that.currentPage
          let pageSize=that.pageSize
          sTime=moment(sTime).format('YYYY-MM-DD')
          eTime=moment(eTime).format('YYYY-MM-DD')
          this.$http({
            method:'get',
            url:'http://113.98.232.85:8080/ATTAPI/api/ATT/GetDrugInfo',
            params:{
              Key:that.SKey,
              sTime:sTime,
              eTime:eTime,
              PageSize:pageSize,
              CurPage:currentPage
            }
          }).then(res=>{
            that.tableData=res.data.list
            that.tbCount=res.data.tbCount
            this.saveData()
          })
        },
        getATTListPrint(){
          let that=this
          let sTime=that.value7[0]
          let eTime=that.value7[1]
          sTime=moment(sTime).format('YYYY-MM-DD')
          eTime=moment(eTime).format('YYYY-MM-DD')
          this.$http({
            method:'get',
            url:'http://113.98.232.85:8080/ATTAPI/api/ATT/GetDrugInfo',
            params:{
              Key:that.SKey,
              sTime:sTime,
              eTime:eTime,
              PageSize:9999999,
              CurPage:0
            }
          }).then(res=>{
            that.Print_tableData=res.data.list
          })
        },
        getNameList(){
          let that=this;
          this.$http({
            method:'get',
            url:'http://113.98.232.85:8080/ATTAPI/api/ATT/GetNameInfo'
          }).then(res=>{
            that.restaurants=res.data.list
          })
        },
        querySearch(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        },
        createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.USERID.toLowerCase().indexOf(queryString.toLowerCase()) === 0||restaurant.NAME.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        handleSelect(item) {
          this.SKey=item.NAME
        },
        handleIconClick(ev) {

          //console.log(ev);
        },
        iniTime(){
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.value7=[start, end]
        },
        handleSizeChange(val) {
          this.pageSize=val
          this.getATTList()
        },
        handleCurrentChange(val) {
          this.currentPage=val
          this.getATTList()
        },
        query(){

          this.currentPage=1;
          this.getATTList()
        },
        saveData(){
          this.$store.commit('newRestaurants',this.restaurants)
          this.$store.commit('newTableData',this.tableData)
          this.$store.commit('newValue7',this.value7)
          this.$store.commit('newTbCount',this.tbCount)
          this.$store.commit('newCurrentPage',this.currentPage)
          this.$store.commit('newSKey',this.SKey)
          this.$store.commit('newPageSize',this.pageSize)
        },
        readData(){
          this.restaurants=this.$store.state.restaurants
          this.tableData=this.$store.state.tableData
          this.value7=this.$store.state.value7
          this.tbCount=this.$store.state.tbCount
          this.currentPage=this.$store.state.currentPage
          this.SKey=this.$store.state.SKey
          this.pageSize=this.$store.state.pageSize
        },
        dateFormat:function(row, column) {
          var date = row[column.property];
          if (date == undefined) {
            return "";
          }
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
        }

      },
      mounted(){
        this.readData()
        if(this.value7==''){
          this.getNameList()
          this.iniTime()
          this.query()
        }
      }
    }
</script>

<style>

</style>
