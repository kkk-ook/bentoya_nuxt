<template>
  <!-- エラーメッセージある分だけ表示 -->
  <div v-show="errorMessages.length > 0" class="admin-error">
    <ul v-for="error in errorMessages" :key="error">
      <li class="error_txt _errorFadeIn">{{ error }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    errorMessages: []
  },
}
</script>

<style lang="scss" scoped>
.admin-error {
  width: fit-content;
  margin: 0 auto;
  >ul {
    >.error_txt {
      font-size: 1.4rem;
      background-color: red;
      color: white;
      margin: 0 auto;
      text-align: center;
      padding: 10px 22px;
      border-radius: 5px;
      letter-spacing: 1px;
      border-radius: 25px;
      z-index: 4;
      &:nth-child(n+1) {
        margin: 5px 0 0 0;
      }
    }
  }
}
</style>
