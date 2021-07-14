<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="~assets/img/logo.svg" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button @click="withdraw" type="info">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :style="{width:isCollapsed?'64px':'200px'}">
          <div @click="isCollapsed=!isCollapsed">|||</div>
          <el-menu background-color="#323744" text-color="#fff" active-text-color="#409EFF"
                   :unique-opened="true" :collapse="isCollapsed" router
                   :default-active="$route.path">
            <el-submenu :index="subItem.id+''" v-for="subItem in navData" :key="subItem.id">
              <template slot="title">
                <i :class="iconList[subItem.id]"></i>
                <span class="ml15">{{subItem.authName}}</span>
              </template>
              <el-menu-item :index="'/home/'+item.path" v-for="item in subItem.children" :key="item.id">
                  <i class="el-icon-menu"></i>
                  <span>{{item.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {getNavData} from "@/network/home";

  export default {
    name: "home",
    data() {
      return {
        navData: [],
        iconList:{
          '125':'iconfont icon-yonghu',
          '103':'iconfont icon-quanxianguanli',
          '101':'iconfont icon-shangpinguanli',
          '102':'iconfont icon-dingdan',
          '145':'iconfont icon-shujutongji',
        },
        isCollapsed:false
      }
    },
    created(){
      getNavData().then(res=>{
        this.navData=res.data
        // console.log(res)
      })
    },
    methods: {
      withdraw() {
        sessionStorage.removeItem('token')
        this.$router.push('/login')
      }
    },
  }
</script>

<style scoped lang="sass">
.home-container
  height: 100vh
  .el-header
    background-color: #373C41
    display: flex
    justify-content: space-between
    align-items: center
    div
      display: flex
      align-items: center
      img
        width: 40px
      span
        line-height: 1
        font-size: 20px
        color: #ffffff
        padding-left: 15px
  .el-aside
    background-color: #323744
    transition: 0.3s
    div
      text-align: center
      line-height: 64px
      color: #909399
      cursor: pointer
    div:hover
      color: #ffffff
      background-color: #282C36
    .el-menu
      border-right: none
      .el-submenu__title i
        padding-left: 5px
  .el-main
    background-color: #EAEDF2
.ml15
  margin-left: 15px
</style>