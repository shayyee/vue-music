import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = () => import('components/recommend/recommend.vue')
const Singer = () => import('components/singer/singer.vue')
const Rank = () => import('components/rank/rank.vue')
const Search = () => import('components/search/search.vue')
const SingerDetail = () => import('components/singer-detail/singer-detail.vue')
const Disc = () => import('components/disc/disc.vue')
const TopList = () => import('components/top-list/top-list.vue')
const UserCenter = () => import('components/user-center/user-center.vue')

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      redirect:'recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: "user",
      component: UserCenter
    }
  ]
})
