<script>
  import Dashboard from './components/Dashboard.vue'
  import Browser from './components/Browser.vue'
  import Chart from './components/Chart.vue'

  export const routes = [
    { path: '/', component: Dashboard, title: 'Dashboard', icon: 'mdi-home' },
    { path: '/browse', component: Browser, title: 'Browser', icon: 'mdi-database-edit' },
    { path: '/chart', component: Chart, title: 'Chart', icon: 'mdi-chart-bar' }
  ]

  export default {
    components: { Browser },
    data() {
      return {
        routes,
        alertbox: {
          on: false
        }
      }
    },
    methods: {
      showAlert(text, color = 'success') {
        this.alertbox.text = text
        this.alertbox.color = color
        this.alertbox.on = true
      }
    }
  }
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent>
      <v-list nav>
        <v-list-item v-for="route in routes" :prepend-icon="route.icon" :title="route.title" :to="route.path"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view @alert="showAlert"/>
    </v-main>
  </v-app>

  <v-snackbar v-model="alertbox.on" :color="alertbox.color" :timeout="5000">
      {{ alertbox.text }}
  </v-snackbar>
</template>

<style scoped>
</style>
