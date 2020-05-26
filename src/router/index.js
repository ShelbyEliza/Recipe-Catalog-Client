import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import NewRecipe from '@/components/NewRecipe'
import Recipe from '@/components/Recipe'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      props: true
    },
    {
      path: '/new/:darkMode',
      name: 'NewRecipe',
      component: NewRecipe,
      props: true
    },
    {
      path: '/recipe/:recipeId',
      name: 'Recipe',
      component: Recipe,
      props: true
    }
  ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
