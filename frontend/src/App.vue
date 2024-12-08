<script>
  import Browser from './components/Browser.vue'

  export default {
    components: { Browser },
    data() {
      return {
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
  <Browser ref="browserRef" @alert="showAlert"/>

  <v-snackbar v-model="alertbox.on" :color="alertbox.color" :timeout="5000">
      {{ alertbox.text }}
  </v-snackbar>

</template>

<style scoped>
</style>
