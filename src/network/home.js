import request from './request'

/*
* 获取导航栏数据
* */
export function getNavData() {
  return request({
    url:'menus',
    method:'get'
  })
}
