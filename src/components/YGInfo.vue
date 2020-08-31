<template>
  <el-container>
    <el-header>
      <el-autocomplete
        clearable
        popper-class="my-autocomplete"
        v-model="SKey"
        :fetch-suggestions="querySearch"
        placeholder="请输入姓名"
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
      &nbsp;&nbsp;&nbsp;&nbsp;

      所有员工：
      <el-switch @change="query"
        v-model="value1"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="primary" size="small" v-on:click="query" icon="search">查 询</el-button>
    </el-header>
    <el-main>
      <template>
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
            prop="Name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="OPHONE"
            label="电话"
            width="180">
          </el-table-column>
          <el-table-column
            label="需要打卡"
            >
            <template slot-scope="scope" >
              <span style=""><img :src="formatref(scope.row.StateATT)" height="25" width="25"/></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope" >
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
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
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="ID" :label-width="formLabelWidth">
        <el-input v-model="form.USERID" :disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth">
        <el-input v-model="form.Name" ></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="form.OPHONE" ></el-input>
      </el-form-item>
      <el-form-item label="是否需要打卡" :label-width="formLabelWidth">
      <el-switch
        v-model="form.StateATT"
        active-text="需要"
        inactive-text="不需要">
      </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="SetYGInfo">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
      title="请验证你的管理员权限！"
      :visible.sync="dialogVisible3"
      width="40%">
      <el-input v-model="inputpw" placeholder="请输入密码" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
      <el-button  @click="nav">返回考勤查询</el-button>
       <el-button type="primary" @click="auth">确 定</el-button>
     </span>
  </el-dialog>
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
        pageSize:15,
        value1: false,
        dialogFormVisible:false,
        form:{
          StateATT:false,
          USERID:0,
          Name:'',
          OPHONE:0

        },
        formLabelWidth: '120px',
        value4:'',
        inputpw:'',
        dialogVisible3:true,
        bAuth:false,
      }
    },
    methods: {
        nav(){
          this.$router.push({
            path:'/'
          })
        },
       auth(){
        if(this.inputpw=="ATTatt"){
          this.$store.commit('newAuth',true)
          this.bAuth=true
          this.dialogVisible3=false
          this.getUserList()
        }else {
          this.$message.error('密码错误！')
        }
      },
      wokedaychange(){
        console.log(this.value4)
      },
      formatStateATT(v){
        if(v==1){
          return true
        }else{
          return false
        }
      },
      handleEdit(index, row){
        console.log(row)
        this.dialogFormVisible=true
        this.form.USERID=row.USERID
        this.form.Name=row.Name
        this.form.OPHONE=row.OPHONE
        this.form.StateATT=this.formatStateATT(row.StateATT)
        this.form.index=index
      },
      formatref(v){
        if(v>0){
          return require( '../assets/ok.png')
        }else {
          return require('../assets/error.png')
        }
      },
      SetYGInfo(){
        let that=this
         this.$http({
          method:'get',
          url:'http://113.98.232.85:8080/ATTAPI/api/SetYGInfo',
          params:{
            USERID:that.form.USERID,
            Name:that.form.Name,
            OPHONE:that.form.OPHONE==null?'':that.form.OPHONE,
            StateATT:that.form.StateATT==true?1:0
          }
        }).then(res=>{
          console.log(that.form.index)
          that.tableData[that.form.index].OPHONE=that.form.OPHONE
          that.tableData[that.form.index].Name=that.form.Name
          that.tableData[that.form.index].StateATT=that.form.StateATT==true?1:0
          that.dialogFormVisible=false
        })
      },
      getATTList(){
        let that=this
        let sTime=that.value7[0]
        let eTime=that.value7[1]
        let currentPage=that.currentPage
        let pageSize=that.pageSize
        sTime=moment(sTime).format('YYYY-MM-DD')
        eTime=moment(eTime).format('YYYY-MM-DD')
        this.$http({
          method:'get',
          url:'http://113.98.232.85:8080/ATTAPI/api/GetYGInfo',
          params:{
            Key:that.SKey,
            isall:that.value1,
            PageSize:pageSize,
            CurPage:currentPage
          }
        }).then(res=>{
          console.log(res)
          that.tableData=res.data.all
          that.tbCount=res.data.tbCount
          that.value4=res.data.listtime
          console.log(that.value4)
          this.saveData()
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
        this.query()
      },
      handleIconClick(ev) {

        //console.log(ev);
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
        this.$store.commit('newTbCountYG',this.tbCount)
        this.$store.commit('newCurrentPageYG',this.currentPage)
        this.$store.commit('newPageSizeYG',this.pageSize)
        this.$store.commit('newTableDataYG',this.tableData)
        this.$store.commit('newRestaurants',this.restaurants)
      },
      readData(){
        this.restaurants=this.$store.state.restaurants
        this.tableData=this.$store.state.tableDataYG
        this.tbCount=this.$store.state.tbCountYG
        this.currentPage=this.$store.state.currentPageYG
        this.pageSize=this.$store.state.pageSizeYG
      },
      dateFormat:function(row, column) {
        var date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      },
      readData(){
        this.bAuth=this.$store.state.bAuth
      },

    },
    mounted(){
      this.readData()
      if(this.tbCount==0){
        console.log(111)
        this.getNameList()
       // this.iniTime()
        this.query()
      }
    },
    created(){
      this.readData()
      if(this.bAuth==true){
        this.dialogVisible3=false;
        this.getUserList()
      }
    }
  }
</script>

<style>

</style>
