<template>
  <div v-show="successMessage">
    {{successMessage.message}}
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      successMessage: state => state.success.successMessage
    })
  }
}
</script> 

<style lang="scss" scoped>
div {
  background-color: $color-blue;
  width: 80%;
  color: white;
  margin: 0 auto;
  text-align: center;
  padding: 10px 8px;
  border-radius: 5px;
  letter-spacing: 1px;
  border-radius: 25px;
}
</style>