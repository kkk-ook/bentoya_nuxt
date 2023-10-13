<template>
  <div>
    <!-- <CartFlow
      :isPayment="true">
    </CartFlow>
    <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>
    <div class="wrapper max-width-content">
      <p class="title-font">お支払い情報入力</p>
      <div class="content" v-if="!isLoading">

        <div class="price">
          <div class="row flex _a-center _j-between stotal">
            <p>小計</p>
            <p data-txt="円" class="small">{{orderData.order.subtotal_price}}</p>
          </div>

          <div class="row flex _a-center _j-between totalPrice">
            <p data-text="(税込)">合計</p>
            <p data-txt="円" class="big">{{orderData.order.subtotal_price}}</p>
          </div>
        </div>
      </div>

      <div class="pay">
        <div class="row flex _a-center _j-around card">
          <div class="txt">
            <p>利用可能なクレジットカード</p>
          </div>
          <div class="img">
            <img src="/fronts/front/cart/credit.png" alt="">
          </div>
        </div>

        <div class="content credit" v-show="payment_method === 1">
          <p class="note">
            本システムのカード決済は、SSLによってカード番号を暗号化し保護しています。<br>お客様のクレジットカード番号は、カード会社のみに送信され、ショップ側で確認することはできませんのでご安心ください。
          </p>

          <div class="payment_table">

            <div class="cell flex _a-center _j-between name">
              <div class="heading flex _a-center _j-between">
                氏名
              </div>
              <div class="detail">
                <input type="text" placeholder="TARO YAMADA" v-model="name">
                <p class="note">半角英字で入力してください</p>
              </div>
            </div>

            <div class="cell flex _a-center _j-between number">
              <div class="heading flex _a-center _j-between">
                カード番号
              </div>
              <div class="detail">
                <div id="card-number" class="input stripe-input"></div>
                <p class="note">半角数字で入力してください(ハイフン不要)</p>
              </div>
            </div>

            <div class="cell flex _a-center _j-between limit">
              <div class="heading flex _a-center _j-between">
                有効期限
              </div>
              <div class="detail flex _a-center">
                <div id="card-expiry" class="input stripe-input"></div>
              </div>
            </div>

            <div class="cell flex _a-center _j-between code">
              <div class="heading flex _a-center _j-between">
                セキュリティコード
              </div>
              <div class="detail">
                <div id="card-cvc" class="input stripe-input"></div>
                <p class="note">半角数字で入力してください</p>
                <div class="errorBox" v-show="codeCheckFlag">半角数字で入力してください</div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="next-btn">
        <button class="btn btn-parts2 _red" @click="submit">ご注文へ進む</button>
      </div>
      <div class="order-info">
        <nuxt-link to="/cart/info">ご注文情報入力へ戻る</nuxt-link>
      </div>
      <div class="cart">
        <button to="/cart" @click="backCart()">カートに戻る</button>
      </div>
    </div> -->
  </div>
</template>

<script>
// import {mapState} from 'vuex'
// import { log } from '@chenfengyuan/vue-qrcode'

export default {
  head() {
    return {
      script: [
        {
          src: this.url,
          type: "text/javascript"
        }
      ],
      title: "お支払い情報入力"
    }
  },
  // data() {
  //   return {
//       errorMessages: [],
//       codeCheckFlag: false,
//       orderData: {},
//       cartItems:{},
//       isLoading: true,
//       payment_method: 1,
//       url: "",
//       name: "",
//       numberElement: null,
//       expiryElement: null,
//     }
//   },
  // async mounted() {
//     const elements = this.$stripe.elements();
//     const elementStyles = {
//       base: {
//         fontSize: "16px",
//         "::placeholder": {
//           color: "#E5E5E5",
//         },
//       },
//     };
//     const number = elements.create("cardNumber", { style: elementStyles });
//     const expiry = elements.create("cardExpiry", { style: elementStyles });
//     const cvc = elements.create("cardCvc", { style: elementStyles });

//     number.mount("#card-number");
//     expiry.mount("#card-expiry");
//     cvc.mount("#card-cvc");
//     this.numberElement = number;
//     this.expiryElement = expiry;
//     this.cvcElement = cvc;
//     // カード番号のみ入力中にエラーを拾える
//     number.on("change", this.showCardError);

//     // 最初にローカルストレージから情報取ってくる
//     this.orderData = JSON.parse(localStorage.getItem("orderData"));
//     this.orderData.order.subtotal_price = this.orderData.order.subtotal_price.toLocaleString();

//     this.isLoading = false;

//     if(this.$config.env == "production") {
//       this.url = "https://token.sps-system.com/sbpstoken/com_sbps_system_token.js"
//     } else {
//       this.url = "https://stbtoken.sps-system.com/sbpstoken/com_sbps_system_token.js"
//     }

  // },
//   methods: {
//     backCart(){
//       if(confirm("入力したデータは保存されませんがカートへ戻りますか？")) {
//         localStorage.removeItem("orderData");
//         this.$router.push("/cart");
//       }
//     },
//     checkValidation() {
//       this.errorMessages = [];
//       if (!this.name) this.errorMessages.push("カード名義を入力してください。");
//       if (this.numberElement._empty)
//         this.errorMessages.push("カード番号を入力してください。");
//       if (this.numberElement._invalid)
//         this.errorMessages.push("カード番号が無効です。");
//       if (this.expiryElement._empty)
//         this.errorMessages.push("有効期限を入力してください。");
//       if (this.expiryElement._invalid)
//         this.errorMessages.push("有効期限が無効です。");
//       if (this.cvcElement._empty)
//         this.errorMessages.push("セキュリティコードを入力してください。");
//       if (this.cvcElement._invalid)
//         this.errorMessages.push("セキュリティコードが無効です。");

//       if(this.errorMessages.length){
//         this.$util.scrollToTop();
//       }

//       return this.errorMessages.length ? false : true;
//     },
//     async submit() {
//       if (!this.checkValidation()) return;
//       this.errorMessages = [];
//       this.isConfirmLoading = true;
//       this.orderData.order.total_price = this.orderData.order.subtotal_price;
//       localStorage.setItem("orderData", JSON.stringify(this.orderData));

//       const paymentMethod = await this.$stripe
//         .createPaymentMethod({
//           type: "card",
//           card: this.numberElement,
//           billing_details: {
//             name: this.name,
//           },
//         })
//         .then((res) => {
//           if (res.error) {
//             this.errorMessages = [paymentMethod.error.message] || [
//               "カード番号が無効です。",
//             ];
//             this.$util.scrollToTop();
//           } else {
//             const orderData = JSON.parse(localStorage.getItem("orderData"));
//             orderData.stripe_payment_method = res.paymentMethod.id;
//             orderData.last3 = res.paymentMethod.card.last4.slice(1, 4); // 確認画面で使う下3桁
//             orderData.order.payment_method =
//               this.$constants.PAYMENT_METHOD_CREDIT;
//             localStorage.setItem("orderData", JSON.stringify(orderData));
//             this.isConfirmLoading = false;

//             this.$router.push("/cart/confirm");
//           }
//         })
//         .catch((err) => {
//           this.errorMessages = ["エラーが発生しました。"];
//           this.$util.scrollToTop();
//         });
//         this.isConfirmLoading = false;
//     },
//     showCardError(event) {
//       if (event.error) {
//         this.errorMessages = [event.error.message];
//         this.$util.scrollToTop();
//       } else {
//         this.errorMessages = [];
//       }
//     },
//   },
}
</script>

<style lang="scss" scoped>
.cartflow {
  font-family: 'Noto Sans JP'; 
  padding-bottom: 50px;
  @media #{$phone} {
    padding-bottom: 20px;
  }
}

.wrapper {
  min-height: 600px;
  color: $color-front;
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
      font-size: 18px;
      margin-top: 30px;
    }
  }

  > .content {
    margin: 50px auto 30px;
    @media #{$phone} {
      display: block;
    }

    > .price {
      margin: auto;
      background-color: $color-gray;
      padding: 50px 100px;
      border-radius: 5px;
      @media #{$phone} {
        width: 100%;
        background-color: transparent;
        padding: 0;
      }

      > .row {
        &:not(:last-child) {
          padding: 10px 0;
          @media #{$phone} {
            padding: 20px 0;
            font-size: 14px;
          }
        }

        &:last-child, &:nth-child(5) {
          padding-top: 50px;
          font-size: 23px;
          @media #{$phone} {
            padding: 20px 0;
          }
        }

        &:last-child {
          font-size: 22px;
        }

        > .small {
          font-family: "Noto Sans JP", sans-serif;
          font-weight: 500;
          font-style: normal;
          &::after {
            content: attr(data-txt);
            font-size: 12px;
            padding-left: 4px;
          }
        }

        > .big {
          font-family: "Noto Sans JP", sans-serif;
          font-weight: 500;
          font-style: normal;
          &::after {
            content: attr(data-txt);
            font-size: 16px;
            padding-left: 4px;
          }
        }

        > p {
          &::after {
            content: attr(data-text);
            font-size: 11px;
            padding-left: 6px;
          }
        }
      }

      > .stotal{
        border-top: 1px dashed $color-txt2;
        border-bottom: 1px dashed $color-txt2;
      }
    }
  }

  > .pay {
    > .row {
      padding: 12px 10px;
      border-radius: 5px;
      font-size: 15px;
      border-top: 1px solid $color-red2;
      border-bottom: 1px solid $color-red2;
      @media #{$phone} {
        width: 100%;
        flex-direction: column;
        padding: 20px 30px;
        font-size: 12px;
        &:not(:first-child) {
          margin-top: 10px;
        }
      }

      > .img{
        width: 30%;
        @media #{$phone} {
          margin-top: 20px;
          width: 60%;
        }
      }
    }

    > .content {
      padding: 20px 0 80px;
      margin: 0 auto;

      > .errorMessage {
        position: fixed;
        width: 100%;
        top: 30px;
        left: 50%;
        transform: translateY(-50%);
        animation: slideIn 2s;
        @media #{$phone} {
          width: 100%;
          position: fixed;
          bottom: 30px;
          top: auto;
          left: 0;
          animation: slideUp 2s;
        }
      }

      > .note {
        font-size: 13px;
        line-height: 20px;
        @media #{$phone} {
          font-size: 12px;
        }
      }
    }
  }

  .payment_table {
    margin-top: 80px;

    > .cell {
      margin-top: 10px;
      align-items: stretch;
      @media #{$phone} {
        display: block;
        margin-top: 0px;
      }

      > .heading {
        width: 26%;
        background-color: $color-gray;
        border-radius: 3px;
        padding: 30px;
        font-size: 15px;
        @media #{$phone} {
          width: 100%;
          padding: 15px;
          font-size: 14px;
          justify-content: left;
        }
      }

      > .detail {
        width: 72%;
        padding: 20px 0 10px 14px;
        @media #{$phone} {
          width: 100%;
          padding: 30px 10px;
        }

        input {
          border: 1px solid $color-gray;
          padding: 10px;
          border-radius: 3px;

          &:not(:first-child) {
            margin-left: 14px;
          }
          &::placeholder{
            color: $color-gray;
          }
        }

        > .note {
          font-size: 12px;
          margin: 20px 0 0 0;
          @media #{$phone} {
            font-size: 12px;
            margin: 20px 0 0;
          }

          > span {
            display: block;
            margin-top: 10px;
          }
        }
      }
    }

    > .name, .number {
      input {
        width: 60%;
        @media #{$phone} {
          width: 100%;
        }
      }
    }

    > .limit {
      .select {
        width: 20%;

        > select {
          padding: 10px;
        }

        &:last-child {
          margin-left: 20px;
        }
      }
    }

    .select-triangle {
      &::after {
        right: 6%;
      }
    }

    > .code {
      > .detail {
        position: relative;

        > .errorBox {
          position: absolute;
          animation: poyo 2s;
          top: 50px;
          left: 13px;
        }
      }

      input {
        width: 20%;
      }
    }
  }
  > .next-btn{
    >.btn{
      text-align: center;
      font-size: 16px;
      width: 350px;
      margin: 0 auto;
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
  > .cart {
    width: fit-content;
    margin: 20px auto 100px;
    border-bottom: 2px solid $color-txt2;
  }
  > .order-info {
    width: fit-content;
    margin: 40px auto 0;
    border-bottom: 2px solid $color-txt2;
  }
}

.stripe-input {
  border: 1px solid $color-gray;
  padding: 8px;
  width: 250px;
}
</style>
