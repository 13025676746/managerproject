import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "@/views/login/login";

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:login},
  {
    path:'/home',
    component:()=>import('views/home/home'),
    redirect: '/home/welcome',
    children:[
      {path:'welcome',component:()=>import('views/home/children/home-welcome')},
      {path:'users',component:()=>import('views/home/children/home-users')},
      {path:'roles',component:()=>import('views/home/children/home-roles')},
      {path:'rights',component:()=>import('views/home/children/home-rights')},
      {path:'goods',component:()=>import('views/home/children/home-goods')},
      {path:'params',component:()=>import('views/home/children/home-params')},
      {path:'categories',component:()=>import('views/home/children/home-categories')},
      {path:'orders',component:()=>import('views/home/children/home-orders')},
      {path:'reports',component:()=>import('views/home/children/home-reports')},
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

/*
* 导航守卫，验证token
* */
router.beforeEach((to,from,next)=>{
  if (to.path === '/login')  return next()
  if (sessionStorage.getItem('token')) return next()
  next('/login')
})

export default router
