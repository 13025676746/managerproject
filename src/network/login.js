import request from './request'

export function loginRequest(username,password) {
  return request({
    url:'login',
    method:'post',
    data:{
      username,
      password
    }
  })
}