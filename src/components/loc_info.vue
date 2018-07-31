<template>
  <!--<h1>这个是明细{{this.$route.query.id}},{{this.$route.query.name}}  </h1>-->
  <div style="height: 100%">
    <keep-alive>
      <view-box >
        <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" @on-click-back="ClickGoBack" :left-options="{preventGoBack:true}" :title="strTitle" ></x-header>
        <group style="padding-top: 25px">
          <div v-for="item in medList">
            <cell :title="item.cur_quantity|myCur" >{{item.max_capacity}}</cell>
          </div>
        </group>
      </view-box>
    </keep-alive>
  </div>
</template>

<script>
  import { Group, Cell,ViewBox} from 'vux'
  import XHeader from "vux/src/components/x-header/index";

    export default {
        name: "loc_info",
      components:{
        XHeader,
        Group,
        Cell,
        ViewBox
      },
      data(){
          return{
            medList:[],
            strTitle:''
          }
      },
      created(){
          // this.getLocInfo(),
          // this.changeIndexUrl()
      },
      mounted(){
        this.getLocInfo(),
        this.changeIndexUrl()
      },
      watch:{
        '$route' (to, from) {
          // 对路由变化作出响应...
          if(to.path=='/component/loc_info'&&from.path=='/'){
            this.getLocInfo()
          }
        }
      },
      methods:{
          getLocInfo:function () {
            let that=this;
            this.$http({
              method:'get',
              url:'http://172.16.75.166:8082/api/Drug/GetLocInfo',
              params:{
                Key:this.$route.query.id
              }
            }).then(res=>{
              console.log( res.data)
              that.medList=res.data.DrugLocInfo
              that.strTitle=res.data.DrugLocInfo[0].med_name_ch
            })
          },
        changeIndexUrl:function () {
          this.$store.commit('newIndexUrl','/component/loc_info')
        },
        ClickGoBack:function () {
          this.$router.push({
            path:'/'
          })
        }
      },
      filters:{
        myCur:function (cur) {
          if(cur==0){
            return cur='0'
          }else {
            return cur
          }
        }
      }
    }
</script>

<style scoped>
  .html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
</style>
