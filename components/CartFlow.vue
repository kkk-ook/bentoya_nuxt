<template>
  <div>
    <div class="flow_area">
      <div class="flow_list flex _a-center _j-between pc_only">
        <div class="flow">
          <img v-if="isCart" src="/fronts/front/cart/flow/cart_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/cart.svg" alt="">
          <p>01.<br class="smart_only">商品確認</p>
        </div>
        <span></span>
        <div class="flow">
          <img v-if="isInfo" src="/fronts/front/cart/flow/info_confirm_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/info_confirm.svg" alt="">
          <p>02.<br class="smart_only">ご注文者情報確認</p>
        </div>
        <span class="pc_only"></span>
        <div class="flow">
          <img v-if="isConfirm" src="/fronts/front/cart/flow/order_confirm_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/order_confirm.svg" alt="">
          <p>03.<br class="smart_only">ご注文情報確認</p>
        </div>
        <span></span>
        <div class="flow">
          <img v-if="isPayment" src="/fronts/front/cart/flow/cash_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/cash.svg" alt="">
          <p>04.<br class="smart_only">お支払い情報入力</p>
        </div>
        <span></span>
        <div class="flow">
          <img v-if="isComplete" src="/fronts/front/cart/flow/complete_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/complete.svg" alt="">
          <p>05.<br class="smart_only">ご注文完了</p>
        </div>
      </div>
    </div>
    <div class="smart_only">
      <div class="flow_list flex _a-center _j-center">
        <div class="flow">
          <img v-if="isCart" src="/fronts/front/cart/flow/cart_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/cart.svg" alt="">
          <p>01.<br class="smart_only">商品確認</p>
        </div>
        <span></span>
        <div class="flow">
          <img v-if="isInfo" src="/fronts/front/cart/flow/info_confirm_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/info_confirm.svg" alt="">
          <p>02.<br class="smart_only">ご注文情報入力</p>
        </div>
        <span></span>
        <div class="flow">
          <img v-if="isConfirm" src="/fronts/front/cart/flow/order_confirm_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/order_confirm.svg" alt="">
          <p>03.<br class="smart_only">ご注文情報確認</p>
        </div>
      </div>
      <div class="flow_list flex _a-center _j-center">
        <div class="flow">
          <img v-if="isPayment" src="/fronts/front/cart/flow/cash_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/cash.svg" alt="">
          <p>04.<br class="smart_only">お支払い情報入力</p>
        </div>
        <span></span>
        <div class="flow">
          <img v-if="isComplete" src="/fronts/front/cart/flow/complete_active.svg" alt="">
          <img v-else src="/fronts/front/cart/flow/complete.svg" alt="">
          <p>05.<br class="smart_only">ご注文完了</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
      isCart: Boolean,
      isInfo: Boolean,
      isPayment: Boolean,
      isConfirm: Boolean,
      isComplete: Boolean,
    }
}
</script>

<style scoped lang="scss">
.flow_area {
  margin: 30px auto 50px;
  max-width:1000px;
  width: 80%;
  text-align: center;
  > .flow_list {
    @media #{$phone} {
      flex-wrap: wrap;
      justify-content: center;
    }
    > .flow {
      display: flex;
      flex-direction: column;
      width: 45px;
      align-items: center;
      height: 45px;
      @media #{$phone} {
      width: 35px;
      height: 100%;
      &:nth-of-type(4),
      &:nth-of-type(5){
        > img {
            margin-top: 18px;
          }
        }
      }
      > img {
        height: 45px;
        margin-bottom: 28px;
        @media #{$phone} {
          margin-bottom: 9px;
        }
      }
      > p {
      color: $color-red2;
      white-space: nowrap;
      font-size: 14px;
      @media #{$tablet} {
        white-space: initial;
        width: 100px;
        }
      }
    }
    > span {
        align-self: start;
        border-bottom: 0.5px solid $color-red2;
        width: 15%;
        height: 24px;
      }
    }
  }
  .smart_only {
    > .flow_list {
    width: 86%;
    margin: 0 auto;
    &:nth-of-type(1){
      margin-top: 100px;
    }
    > .flow {
      width: 35px;
      > p {
        display: flex;
        justify-content: center;
        font-size: 11px;
        color: $color-red2;
        margin: 9px 0 18px;
        white-space: nowrap;
        text-align: center;
      }
    }
    > span {
      border-bottom: 1px solid #C30D23;
      width: 22%;
      height: 19px;
      align-self: baseline;
      &:nth-of-type(4),
      &:nth-of-type(5){
        height: 38px;
      }
    }
  }
}
</style>