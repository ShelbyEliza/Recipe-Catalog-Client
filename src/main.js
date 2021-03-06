/**
 * main.js declares dependencies and initalizes apollo gql requests. 
 */

import Vue from 'vue'
import './assets/styles/custom.scss'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import App from './App.vue'
import router from './router'


import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueApollo)

const hostname = process.env.VUE_APP_ROOT_API
Vue.prototype.$hostname = hostname

// Use this during production so the back-end can communicate with front-end securely:

// const getHeaders = () => {
//   const headers = {}
//   const token = window.localStorage.getItem('apollo-token')
//   if (token) {
//     headers.authorization = `Bearer ${token}`
//   }
//   return headers
// }

// Create an http link:
const link = createUploadLink({
  uri: hostname + 'graphql'
})

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true
  })
})

const apolloProvider = new VueApollo({
  defaultClient: client
})

/* eslint-disable no-new */
new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
