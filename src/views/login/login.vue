<template>
  <div class="login">
    <div class="login-form">
      <div class="form-avatar">
        <div class="form-avatar-img">
          <img src="~assets/img/logo.svg" alt="">
        </div>
      </div>
      <div class="form-main">
        <el-form :model="form" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" prefix-icon="iconfont icon-tubiao-06" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" prefix-icon="iconfont icon-denglumima" v-model="form.password" ></el-input>
          </el-form-item>
          <el-form-item class="form-main-button">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {loginRequest} from "@/network/login";

  export default {
    name: "login",
    data() {
      return {
        form: {
          username:'',
          password:''
        },
        rules:{
          username:[
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            { min: 3, message: '长度不能小于3个字符', trigger: 'blur' }
          ],
          password:[
            {required: true, message: '密码不能为空', trigger: 'blur'},
            { min: 6, message: '长度不能小于6个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginFormRef.validate(flag=>{
          if (!flag) return
          loginRequest(this.form.username,this.form.password).then(res=>{
            // console.log(res)
            if (res.meta.status !== 200) return this.$message('登录失败，账户名或密码错误')
            sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
            return this.$message('登录成功')
          })
        })
      },
      reset(){
        this.$refs.loginFormRef.resetFields()
      }
    },
  }
</script>

<style scoped lang="sass">
.login
  width: 100vm
  height: 100vh
  background-color: #051F37
  .login-form
    width: 630px
    height: 430px
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
    border-radius: 3px
    background-color: #ffffff
    .form-avatar
      width: 230px
      height: 230px
      background-color: #ffffff
      position: absolute
      left: 50%
      transform: translate(-50%,-50%)
      border-radius: 50%
      box-shadow: 0 0 10px #EDEDEC
      padding: 10px
      .form-avatar-img
        width: 100%
        height: 100%
        border-radius: 50%
        overflow: hidden
        background-color: #EDEEEC
        img
          width: 100%
          height: 100%
    .form-main
      margin-top: 30%
      padding: 0 20%
      .form-main-button
        display: flex
        justify-content: flex-end
</style>