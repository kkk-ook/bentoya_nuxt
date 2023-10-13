<template>
  <div class="wrapper max-width-content">
    <CartFlow :isComplete="true"> </CartFlow>
    <div class="process"></div>
    <div class="content">
      <p class="title-font">注文完了</p>
      <p class="detail">
        ご注文を承りました。<br />ご登録頂いておりますメールアドレス宛に<br />注文詳細を送らせていただきました。
      </p>
      <div class="btn btn-parts2 _red">
        <nuxt-link to="/">トップに戻る</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "cart",
    head() {
    return {
      title: `注文完了`,
      meta: [
        { hid: "robots", name: "robots", content: "noindex" }
      ],
    };
  },
  async mounted() {
  this.$store.commit("cart/setCartCount", 0);
  localStorage.removeItem('orderData');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('orderStopDayBefore');
  localStorage.removeItem('orderStopThatDay');
  localStorage.removeItem('orderStopHolidayBefore');
  localStorage.removeItem('purchaseable');
  localStorage.removeItem('deliveryDays');
  localStorage.removeItem('years')
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  font-family: 'Noto Sans JP'; 
  color: $color-txt;

  > .process {
    margin: 80px 0;
  }
  > .content {
    width: 90%;
    margin: 0 auto;
    @media #{$phone} {
      width: 95%;
    }
    > .title-font{
      font-size: 28px;
      margin-top: 100px;
      text-align: center;
      @media #{$phone} {
        font-size:18px;
        margin-top: 30px;
      }
    }
    > p {
      text-align: center;
      @media #{$phone} {
        font-size: 14px;
      }
    }
    > .detail {
      line-height: 25px;
      letter-spacing: 2px;
      margin-top: 40px;
    }
    > .btn {
      width: 25%;
      margin: 0 auto;
      border-radius: 5px;
      margin-top: 40px;
      @media #{$phone} {
        width: 100%;
        font-size: 14px;
      }
      > a {
        display: block;
        padding: 10px;
        @media #{$phone} {
          padding: 15px 0;
        }
      }
    }
  }
}
</style>
