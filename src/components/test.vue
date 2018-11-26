<template>
  <el-container>
  <el-header>
    <el-row >
      <el-col :span="2">9:00-18:30:</el-col>
      <el-col :span="4">
        <el-input
          placeholder="请选择日期"
          suffix-icon="el-icon-date"
          @focus="f1"
          v-model="input2">
        </el-input></el-col>
      <el-col :span="2">9:00-16:30:</el-col>
      <el-col :span="4">
        <el-input
          placeholder="请选择日期"
          suffix-icon="el-icon-date"
          @focus="f2"
          v-model="input3">
        </el-input></el-col>
      <el-col :span="2">查询日期:</el-col>
      <el-col :span="7">
        <el-date-picker style="width: 100%"
          v-model="value7"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="datePickChane"
          :picker-options="pickerOptions2">
        </el-date-picker></el-col>
      <el-col :span="3" >
        <el-row>
          <el-col :span="9" :offset="3">
            <el-button type="primary" size="small" v-on:click="query" icon="search">查 询</el-button>
          </el-col>
          <el-col :span="9" :offset="3">
            <el-button type="primary" size="small" v-on:click="exportExcel" icon="search">导 出</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
  <el-main>
    <el-dialog
      title="编辑9:00-18:30上班的日期 (默认选中日期为周一到周五)"
      :visible.sync="dialogVisible"
      center
      width="40%">
      <el-transfer v-model="value1" :data="data" :titles="['待选列表', '已选列表']"></el-transfer>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submit1">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="编辑9:00-16:30上班的日期 (默认选中日期为周六)"
      :visible.sync="dialogVisible2"
      center
      width="40%">
      <el-transfer v-model="value2" :data="data2" :titles="['待选列表', '已选列表']"></el-transfer>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="submit2">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="请验证你的管理员权限！"
      :visible.sync="dialogVisible3">
      <el-input v-model="inputpw" placeholder="请输入密码" type="password"></el-input>
      <span slot="footer" class="dialog-footer">
         <el-button  @click="nav">返回考勤查询</el-button>
    <el-button type="primary" @click="auth">确 定</el-button>
  </span>
    </el-dialog>
    <el-table
      v-loading="loading"
      :data="tableData"
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
        prop="TIME"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="CHECKTIME"
        label="打卡记录"
        width="280">
      </el-table-column>
      <el-table-column
        prop="errormsg"
        label="考勤异常信息">
      </el-table-column>
    </el-table>
  </el-main>
  </el-container>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
    export default {
      name: "test",
      data() {
        return {
          loading:false,
          bAuth:false,
          inputpw:'',
          dialogVisible3:true,
          tableData: [],
          input2:'',
          input3:'',
          dialogVisible2:false,
          value2:[],
          data2:[],
          value1:[],
          data:[],
          d_arr:[],//平常
          d_arr_sat:[],//加班
          d_arr_all:[],//所有
          dialogVisible:false,
          value7: [],
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
          input2: '',
          input3: '',
        }
      },
      methods:{
        nav(){
          this.$router.push({
            path:'/'
          })
        },
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
        iniTime(){
          // const end = new Date()
          // const start = new Date()
          // start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          // this.value7=[start, end]
          var firstdate = new Date(new Date().getFullYear(), new Date().getMonth()-1, 1);
          var date = new Date();
          var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
          var enddate = new Date(new Date().getFullYear(), new Date().getMonth()-1, day);
          this.value7=[firstdate, enddate]
        },
        datePickChane(){
          this.getAllTime()
        },
        indexOf(val,arr){
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) return i;
          }
          return -1;
        },
        remove(val,arr){
        var index = this.indexOf(val,arr);
        if (index > -1) {
          arr.splice(index, 1);
        }
        },
        deepClone(obj){
          let _obj = JSON.stringify(obj),
            objClone = JSON.parse(_obj);
          return objClone
        },
        auth(){
          if(this.inputpw=="ATTatt"){
            this.$store.commit('newAuth',true)
            this.bAuth=true
            this.dialogVisible3=false
            this.query()
          }else {
            this.$message.error('密码错误！')
          }
        },
        f1(){
          let that=this
          if(this.dialogVisible===false) {
            let temp=[]
            that.data=[]
            this.value1=[]
            temp=that.deepClone(that.d_arr_all)
            this.d_arr_sat.forEach(function (value, index) {
              that.remove(value,temp)
              that.data.push({
                key: value,
                label: value,
                disabled: true
              })
            })
            temp.forEach(function (value,index) {
              that.data.push({
                key: value,
                label: value,
                disabled: false
              })
            })
          //  console.log(that.data);
            this.value1=that.d_arr
          //  console.log('drr'+this.d_arr);
            this.dialogVisible = true
          }
        },
        f2(){
          let that=this
          if(this.dialogVisible2===false) {
            let temp=[]
            that.data2=[]
            this.value2=[]
            temp=that.deepClone(that.d_arr_all)
            this.d_arr.forEach(function (value, index) {
              that.remove(value,temp)
              that.data2.push({
                key: value,
                label: value,
                disabled: true
              })
            })
            temp.forEach(function (value,index) {
              that.data2.push({
                key: value,
                label: value,
                disabled: false
              })
            })
           // console.log(that.data);
            this.value2=that.d_arr_sat
           // console.log('d_arr_sat'+this.d_arr_sat);
            this.dialogVisible2= true
          }
        },
        submit1(){
          this.dialogVisible = false
          this.d_arr=this.value1
          this.$store.commit('newD_arr',this.d_arr)
         // console.log('submit1'+this.d_arr);
        },
        submit2(){
          this.dialogVisible2 = false
         this.d_arr_sat=this.value2
          this.$store.commit('newD_arr_sat',this.d_arr_sat)
        //  console.log('submit2'+this.d_arr);
        },
        getArr(a,b){
          let arr=[]
          let that=this
        //  console.log('alog'+a);
        //  console.log('blog'+b);
          a.forEach(function (value,index) {
            if(that.bIndexOf(value,b)==false){
         //    console.log('arr.push');
              arr.push(value)
            }
          })
         // console.log('arrlog'+arr);
          return arr;
        },
        bIndexOf(a,b){
          // b.forEach(function (vaule,index) {
          //   if(a==vaule){
          //     console.log('true');
          //     return true
          //   }
          // })
          // console.log('false');
          // return false
          for(let i=0;i<b.length;i++){
            if(b[i]==a){
              return true
            }
          }
          return false
        },
        readData(){
          this.d_arr=this.$store.state.d_arr
          this.d_arr_sat=this.$store.state.d_arr_sat
          this.d_arr_all=this.$store.state.d_arr_all
          this.value7=this.$store.state.value7s
          this.tableData=this.$store.state.tableData2
          this.input2=this.d_arr;
          this.input3=this.d_arr_sat;
          this.bAuth=this.$store.state.bAuth
        },
        getAllTime(){
          let start_time = this.value7[0]
          let end_time = this.value7[1]
          let bd = new Date(start_time),be = new Date(end_time)
          let bd_time = bd.getTime(), be_time = be.getTime(),time_diff = be_time - bd_time
          this.d_arr = []
          this.d_arr_sat=[]
          this.d_arr_all=[]
          for(let i=0; i<= time_diff; i+=86400000){
            let ds = new Date(bd_time+i)
            let  s=ds.getFullYear()+'-'+(ds.getMonth() + 1) + '-' + ds.getDate()
            let b = new Date(Date.parse(s.replace(/\-/g,"/")));
            let week=b.getDay()
            this.d_arr_all.push(ds.getFullYear()+'年'+(ds.getMonth() + 1) + '月' + ds.getDate() + '日')
            if(week==1||week==2||week==3||week==4||week==5) {
              this.d_arr.push(ds.getFullYear()+'年'+(ds.getMonth() + 1) + '月' + ds.getDate() + '日')
            }else if(week==6){
              this.d_arr_sat.push(ds.getFullYear()+'年'+(ds.getMonth() + 1) + '月' + ds.getDate() + '日')
            }
          }
          this.input2=this.d_arr;
          this.input3=this.d_arr_sat;
          this.$store.commit('newD_arr',this.d_arr)
          this.$store.commit('newD_arr_sat',this.d_arr_sat)
          this.$store.commit('newD_arr_all',this.d_arr_all)
          this.$store.commit('newValue7s',this.value7)
       //   console.log(this.d_arr);
       //   console.log(this.d_arr_sat);
        //  console.log(this.d_arr_all);
        },
        query(){
        //  console.log(this.value7);
          if(this.bAuth==true){
            this.dialogVisible3=false;
          }else {
            this.dialogVisible3=true;
            return
          }
          this.loading=true
          this.$http({
            method: 'post',
            url:'http://192.168.120.9:8090/ATT_API/api/ATT/ValidateATT',
            //url: 'http://localhost:56517/api/WxApplication/InsApplicationInfo',
            data: {
              workday:this.d_arr,
              satday: this.d_arr_sat,
              time:this.value7
            }
          }).then(res => {
         //   console.log(res);
            if(res.data.ErrorCode===0) {
              this.tableData=res.data.list
              this.$store.commit('newtableData2',this.tableData)
              this.loading=false
            }else {
              this.tableData=[]
              this.loading=false
            }
          }).catch(err => {
            console.log(err);
            this.loading=false
          })
        }
      },
      mounted(){
        if(this.value7==''){
         this.iniTime()
         this.getAllTime()
        }
      },created(){
        this.readData()
        //  console.log(this.value7);
        if(this.bAuth==true){
          this.dialogVisible3=false;
        }
      }
    }
</script>

<style scoped>
h1{
  text-align: center;
}
body {
  margin: 0;
}
</style>
