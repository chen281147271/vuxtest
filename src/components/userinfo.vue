<template>
  <div>
  <el-transfer
    :titles="['全部人员', '出勤人员']"
    filterable
    filter-placeholder="请输入名字"
    v-model="value2"
    :data="data2">
  </el-transfer>
  <el-button type="primary" style="margin-top: 20px" @click="submit">提交修改</el-button>
  <el-button  @click="Refresh">刷新</el-button>
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
  </div>
</template>
<!--:filter-method="filterMethod"-->
<script>
    export default {
        name: "userinfo",
      data() {
        return {
          data2: [],
          value2: [],
          list:[],
          listALL:[],
          bAuth:false,
          dialogVisible3:true,
          inputpw:'',
        }
      },
      methods:{
          nav(){
            this.$router.push({
              path:'/'
            })
          },
          getUserList(){
            let that =  this
            this.$http({
              method:'get',
              url:'http://113.98.232.85:8080/ATTAPI/api/GetUserInfo_ATT'
            }).then(res=>{
              that.list=res.data.list
              that.listALL=res.data.listAll
              that.getData()
              //this.saveData()
            })
          },
        getData(){
          let that =  this
          this.listALL.forEach(function (value, index) {
            that.data2.push({
              key: value.USERID,
              label: value.NAME,
            })
          })
          this.list.forEach(function (value, index) {
            that.value2.push(
              value.USERID
            )
          })
        },
        submit(){
          this.$http({
            method: 'post',
            url:'http://113.98.232.85:8080/ATTAPI/api/Up_UserInfo',
            //url: 'http://localhost:56517/api/WxApplication/InsApplicationInfo',
            data: {
              value:this.value2,
            }
          }).then(res => {
            console.log(res);
            if(res.data===0) {
              this.$message({
                message: '已成功提交！',
                type: 'success'
              });
            }else {
              this.$message.error('提交失败！');
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('提交异常！');
          })
        },
        readData(){
          this.bAuth=this.$store.state.bAuth
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
        Refresh(){
          this.getUserList()
        }
      },
      mounted(){
      }
      ,created(){
        this.readData()
        if(this.bAuth==true){
          this.dialogVisible3=false;
          this.getUserList()
        }
      }
    }
</script>

<style scoped>

</style>
