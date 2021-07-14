<template>
  <div class="home-users">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--表单-->
      <el-form :model="form" :inline="true">
        <el-form-item>
          <el-input placeholder="请输入搜索姓名" v-model="form.searchContent">
            <el-button slot="append" icon="el-icon-search"
            @click="_handleSearch"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="_handleAddUser">添加用户</el-button>
        </el-form-item>
      </el-form>
      <!--表格-->
      <el-table border :data="usersData.users" height="655px">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!--作用域插槽-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="_handleStateChange(scope.row.id,scope.row.mg_state)"
                       ref="switchRef"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" class="el-icon-edit" size="small"
              @click="_handleUserDataEdit(scope.row)"></el-button>
              <el-button type="danger" class="el-icon-delete" size="small"
              @click="_handleDeleteUser(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" class="el-icon-setting" size="small"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="usersData.total"
                     :page-size="3" :page-sizes="[3,6,9,12,15]" @size-change="_handleSizeChange"
                     @current-change="_handleCurrentChange"></el-pagination>
    </el-card>
    <!--编辑用户信息对话框-->
    <el-dialog title="修改用户信息" :visible="dialog.isShowEditDialog"
               @close="dialog.isShowEditDialog = false">
      <template>
        <el-form :model="currentEditData" :rules="rules" label-width="70px"
        ref="editFormRef">
          <el-form-item label="用户名">
            <el-input v-model="currentEditData.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="currentEditData.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="currentEditData.mobile"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <el-button @click="dialog.isShowEditDialog = false">取消</el-button>
        <el-button type="primary" @click="_handleEditDialogConfirm">确认</el-button>
      </template>
    </el-dialog>
    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible="dialog.isShowAddDialog"
               @close="_handleAddDialogClose">
      <template>
        <el-form :model="addUserInfo" :rules="rules" label-width="70px"
        ref="addUserFormRef">
          <el-form-item label="用户名" prop="username">
            <el-input placeholde="请输入用户名" v-model="addUserInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input placeholde="请输入密码" v-model="addUserInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholde="请输入邮箱" v-model="addUserInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input placeholde="请输入手机" v-model="addUserInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <el-button @click="dialog.isShowAddDialog = false">取消</el-button>
        <el-button type="primary" @click="_handleAddDialogConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {getHomeUserData, updateUserState,updateUserInfo,addUser,
  deleteUser} from "@/network/home-users";

  export default {
    name: "home-users",
    data() {
      //自定义验证规则-begin
      const checkEmail=(rule,value,callback)=>{
        const emailReg=/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        if (!emailReg.test(value)) return callback(new Error('请输入正确格式的邮箱'))
        callback()
      }
      const checkMobile=(rule,value,callback)=>{
        const mobileReg=/^1\d{10}$/
        if (!mobileReg.test(value)) return callback(new Error('请输入正确格式的手机'))
        callback()
      }
      //自定义验证规则-end
      return {
        form: {
          searchContent: '',
        },
        rules: {
          username:[
            {required:true,trigger:'blur',message:'用户名不能为空'},
          ],
          password:[
            {required:true,trigger:'blur',message:'密码不能为空'},
            {min:6,trigger:'blur',message:'密码不能小于6位'},
          ],
          email:[
            {required:true,trigger:'blur',message:'邮箱不能为空'},
            {validator:checkEmail,trigger: "blur"}
          ],
          mobile:[
            {required:true,trigger:'blur',message:'手机不能为空'},
            {validator:checkMobile,trigger: "blur"}
          ]
        },
        usersData: {},
        pagination: {
          num: 1,
          size: 3
        },
        dialog: {
          isShowEditDialog: false,
          isShowAddDialog:false
        },
        currentEditData:{},
        addUserInfo:{
          username:'',
          password:'',
          email:'',
          mobile:''
        }
      }
    },
    created() {
      this._getHomeUserData()
    },
    methods: {
      _getHomeUserData() {
        getHomeUserData(this.form.searchContent,this.pagination.num, this.pagination.size)
        .then(res => {
          this.usersData = res.data
          // console.log(this.usersData)
        })
      },
      _handleSizeChange(size) {
        this.pagination.size = size
        this._getHomeUserData()
      },
      _handleCurrentChange(num) {
        this.pagination.num = num
        this._getHomeUserData()
      },
      _handleStateChange(id, state) {
        updateUserState(id, state).then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('更改状态失败')
            this.$refs.switchRef.value = !this.$refs.switchRef.value
          } else {
            this.$message.success('更改状态成功')
          }
        })
      },
      _handleUserDataEdit(data){
        this.currentEditData=JSON.parse(JSON.stringify(data))
        this.dialog.isShowEditDialog = true
      },
      _handleEditDialogConfirm(){
        this.$refs.editFormRef.validate(valid=>{
          if (!valid) {
            this.$message.error('信息格式错误，修改用户信息失败')
          }else{
            updateUserInfo(this.currentEditData.id,this.currentEditData.email,
            this.currentEditData.mobile).then(res=>{
              if(res.meta.status!==200) {
                this.$message.error(`${res.meta.msg}，修改用户信息失败`)
                this.dialog.isShowEditDialog = false
              }else{
                this._getHomeUserData()
                this.$message.success('修改用户信息成功')
                this.dialog.isShowEditDialog = false
              }
            })
          }
        })
      },
      _handleAddUser(){
        this.dialog.isShowAddDialog=true
      },
      _handleAddDialogConfirm(){
        this.$refs.addUserFormRef.validate(valid=>{
          if (!valid) return this.$message.error('信息格式有误，添加用户失败')
          addUser(this.addUserInfo).then(res=>{
            if (res.meta.status!==201) return this.$message.error(`${res.meta.msg}，添加用户失败`)
            this.$message.success('添加用户成功')
            this._getHomeUserData()
            this.dialog.isShowAddDialog=false
          })
        })
      },
      _handleAddDialogClose(){
        this.$refs.addUserFormRef.resetFields()
        this.dialog.isShowAddDialog=false
      },
      _handleDeleteUser(id){
        this.$confirm('确认删除？','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(()=>{
          deleteUser(id).then(res=>{
            if (res.meta.status!==200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this._getHomeUserData()
          })
        }).catch(()=>{
          this.$message.error('删除用户失败')
        })
      },
      _handleSearch(){
        this._getHomeUserData()
      }
    },
  }
</script>

<style scoped lang="sass">
.el-breadcrumb
  margin-bottom: 20px

.el-table
  margin-bottom: 15px

.el-pagination
  text-align: center
</style>