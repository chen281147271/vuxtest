<template>
    <div style="height: 100%">
      <ViewBox>
       <h2> {{ author}}</h2>
        <x-input v-model="name" @on-change="changeName"></x-input>
        <x-button @click.native="getMedList"> 按钮</x-button>
        <group title="cell demo">
          <div v-for="item in medList">
        <cell :title="item.med_id"  is-link @click.native="clickMed(item)">{{item.med_name_ch}}</cell>
          </div>
        </group>
      </ViewBox>
    </div>
</template>

<script>
    import { Group, Cell,ViewBox } from 'vux'
    import XInput from "vux/src/components/x-input/index";
    import XButton from "vux/src/components/x-button/index";
    import XTable from "vux/src/components/x-table/index";
    export default {
      name: "HelloWorldVux-1",
      components: {XTable, XButton, XInput,Group,Cell,ViewBox},
      data(){
        return{
          name:'哈哈哈哈',
          medList:[]
        }
      },
      methods:{
        getMedList:function () {
          let that=this;
          this.$http({
            method:'get',
            url:'http://172.16.75.166:8082/api/Drug/GetDrugInfo?Key=&OperCode=0',
          }).then(function (res) {
            console.log(res.data.DrugInfo)
            that.medList=res.data.DrugInfo

          }).catch(function (err) {
            console.log(err)
          })
        },
        changeName:function () {
          this.$store.commit('newAuthor',this.name)
        },
        clickMed:function(item) {
          this.$router.push({
            path:'/component/loc_info',
            query:{
              id:item.med_id,
              name:item.med_name_ch
            }
          })
        }
      },
      computed:{
        author(){
          return this.$store.state.author
        }
      }
    }
</script>

<style lang="less">
  @import '../styles/weui/widget/weui_cell/weui_cell_global';
  @import '../styles/weui/widget/weui_cell/weui_access';
  @import '../styles/weui/widget/weui_panel/weui_panel';
  @import '../styles/weui/widget/weui_media_box/weui_media_box';
</style>
