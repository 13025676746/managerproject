import request from './request'

/*
* 获取用户列表数据
* */
export function getHomeUserData(query,pagenum,pagesize) {
  return request({
    url:'users',
    method:'get',
    params:{
      query,
      pagenum,
      pagesize,
    }
  })
}
/*
* 修改用户数据
* */
export function updateUserState(uId,type) {
  return request({
    url:`users/${uId}/state/${type}`,
    method:'put'
  })
}
/*
* 修改用户信息
* */
export function updateUserInfo(id,email,mobile) {
  return request({
    url:`users/${id}`,
    method:'put',
    data:{
      email,
      mobile
    }
  })
}
/*
*添加用户
* */
export function addUser(userInfo) {
  return request({
    url:'users',
    method:'post',
    data:userInfo
  })
}
/*
* 删除用户
* */
export function deleteUser(id) {
  return request({
    url:`users/${id}`,
    method:'delete'
  })
}