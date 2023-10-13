<template>
  <div class="order_error">
    <p class="inner">クレジットカード決済に失敗しました。</p>
    <div class="btn">
      <nuxt-link to="/" class="link btn-parts2 _red">Topへ戻る</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `決済失敗`,
    };
  },
}
</script>

<style lang="scss" scoped>
  .order_error {
    font-family: 'Noto Sans JP'; 
    padding-top: 200px;
    min-height: 500px;
    color: $color-front;
    width: 90%;
    margin: 0 auto;
    font-size: 20px;
    @media #{$phone} {
      width: 95%;
      font-size: 16px;
    }
    > .inner{
      text-align: center;
    }
    > .btn{
      > .link{
        text-align: center;
        font-size: 16px;
        width: 200px;
        margin: 30px auto;
        color: white;
        letter-spacing: 3px;
        padding: 16px;
        border-radius: 5px;
        cursor: pointer;
        display: block;
        @media #{$phone} {
          width: 100%;
          font-size: 14px;
        }
      }
    }
  }
</style>