<template>
  <div>
    <CartFlow :isConfirm="true"></CartFlow>
    <div class="wrapper">
      <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>
      <p class="title-font">最終注文確認</p>
      <p class="detail-font">ご注文内容を確認いただき、間違いがございましたら<br
          class="smart_only">「変更する」ボタンを押して修正してください。<br>「注文を確定する」ボタンを押すとクレジット情報入力画面に移動します。</p>

      <div class="content" v-if="!isLoading">

        <div class="top flex _a-start _j-between">
          <div class="left">
            <div class="confirm_table">

              <div class="cell flex _a-center _j-between">
                <div class="heading">ご注文者様</div>
                <div class="detail">
                  <div class="content">
                    <p>{{orderData.order.last_name + orderData.order.first_name}}様</p>
                    <p class="email">{{orderData.order.email}}</p>
                  </div>
                </div>
              </div>

              <div class="cell flex _a-center _j-between">
                <div class="heading">お届け先</div>
                <div class="detail">
                  <div class="content">
                    <p>{{orderData.order.client}}</p>
                    <p>{{orderData.order.delivery_location}}</p>
                  </div>
                </div>
              </div>

              <div class="cell flex _a-center _j-between credit">
                <div class="heading">支払い方法</div>
                <div class="detail flex _a-center">
                  <div class="content">
                    <p>{{payment}}</p>
                    <p class="red-txt">※お支払い方法はクレジットカードのみとなります。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="right">
            <div class="row stotal flex _a-center _j-between">
              <p>小計</p>
              <p data-txt="円">{{orderData.order.subtotal_price}}</p>

            </div>
            <div class="row flex _a-center _j-between">
              <p>合計<span>(税込)</span></p>
              <p class="price" data-txt="円">{{orderData.order.subtotal_price}}</p>
            </div>
          </div>
        </div>

        <div class="bottom">
          <ul class="cart_collections">
            <li class="cell flex _j-between" v-for="cartItem in cartItems" :key="cartItem.id">
              <div class="img">
                <img :src="cartItem.product.product_images[0].image.url" alt="">
              </div>
              <div class="txt">
                <p class="name">{{ cartItem.product.name }}</p>
                <div class="center">
                  <div class="price">
                    <p data-text="(税込、配送料込み)">
                      ¥{{ cartItem.stringPrice }}
                    </p>
                  </div>
                  <div class="delivery_days">
                    <p class="txt">お届け日：<span class="inner">計{{ totalDays(cartItem.cart_details) }}日 / 計{{ allCount(cartItem.cart_details) }}食</span></p>
                    <div class="delivery_days_area flex">
                      <div class="inner" v-for="(detail, detail_index) in cartItem.cart_details" :key="detail_index">
                        <div class="btn" v-if="detail.count > 0">{{ detail.date }}{{ detail.weekday }}</div>
                        <div class="count" v-if="detail.count > 0">
                          <p class="num">
                            {{ detail.count }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="buttons flex _column _j-center">
                <button class="change_btn">
                  <nuxt-link to="/cart">変更</nuxt-link>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="order-btn" v-show="!isLoad">
        <button class="btn btn-parts2 _red" v-show="!isLoad" @click="confirmOrder($event)">注文確定する</button>
        <div class="loader" v-show="isLoad"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `最終注文確認`,
      meta: [
        { hid: "robots", name: "robots", content: "noindex" }
      ],
    };
  },
  data() {
    return {
      cartItems: "",
      isLoading: true,
      orderData: "",
      subTotalPrice: 0,
      payment: "",
      errorMessages: [],
      isLoad: false,
      isConfirmLoading: false,
      order: [],
    }
  },
  async mounted() {
    this.orderData = JSON.parse(localStorage.getItem("orderData"));
    this.cartItems = JSON.parse(localStorage.getItem("cartItems"));
    for(let i = 0; i < this.cartItems.length; i++){
      this.cartItems[i].stringPrice = this.cartItems[i].price;
    }

    for(let i = 0; i < this.cartItems.length; i++){
      let needItem = [];
      for(let j = 0; j < this.cartItems[i].cart_details.length; j++){
        if(this.cartItems[i].cart_details[j].count > 0){
          needItem.push(this.cartItems[i].cart_details[j]);
        }
      }
      this.cartItems[i].cart_details = needItem;
      this.cartItems[i].stringPrice = this.cartItems[i].price.toLocaleString();
    }

    // 支払い方法
    this.payment = "クレジットカード"

    this.isLoading = false;
  },
  methods: {
    formatDate(date) {
      if (date) {
          let month = date.getMonth() + 1;
          let day = date.getDate();
          month = ("0" + month).slice(-2);
          day = ("0" + day).slice(-2);
          let formatted = date.getFullYear() +  "-" + month + "-" + day;
          return formatted;
      }
      return date;
    },
    allCount(cart_details){
      let count = 0;
      for (let i = 0; i < cart_details.length; i++) {
        count += cart_details[i].count;
      }
      return count;
    },
    totalDays(cart_details){
      let count = 0;
      for (let i = 0; i < cart_details.length; i++) {
        if(cart_details[i].count > 0){
          count += 1
        }
      }
      return count;
    },
    async confirmOrder(e) {
      let data = await this.$frontApi.getUserState();

      if(!data.errorMessages.length){
        // ローディング処理
        this.isConfirmLoading = true;
        let state = "";

        let orders = [];

        for(let i = 0; i < this.cartItems.length; i++){
          let order_details_attributes = [];

          for(let j = 0; j < this.cartItems[i].cart_details.length; j++){
            let formatedDate = this.formatDate(new Date(this.cartItems[i].cart_details[j].year + "/" + this.cartItems[i].cart_details[j].date));
            order_details_attributes.push({
              "count": this.cartItems[i].cart_details[j].count,
              "provision_on": formatedDate
            });
          }

          orders.push({
            "product_id": this.cartItems[i].product_id,
            "product_name": this.cartItems[i].product.name,
            "product_price": this.cartItems[i].price,
            "order_details_attributes": order_details_attributes
          });
        }

        let order_header = {
          "total_price": this.orderData.order.subtotal_price,
          "total_count": this.cartItems.length,
          "orders_attributes": orders,
        }

        state = await this.$frontApi.postOrder(e, order_header);

        if (state.errors.length > 0) {
          this.$util.scrollToTop();
          this.errorMessages = state.errors;
        }
        else {
          // this.$router.push("/cart/payment");
          window.location.href = state.url;
          this.isConfirmLoading = false;
          // this.$router.push("/cart/complete");
          
        }
      }
      else{
        this.$util.isLostLogin();
      }

      this.isConfirmLoading = false;
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  font-family: "Noto Sans JP", sans-serif; 
  color: $color-txt;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  color: $color-front;
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
  > .errorMessage {
    position: fixed;
    top: 50px;
    left: 50%;
    width: 80%;
    transform: translateX(-50%);
    margin: 0 auto;
    animation: slideIn 2s;
  }
  > .detail-font {
    margin-top: 50px;
    line-height: 25px;
    text-align: center;
    color: $color-red2;
    @media #{$phone} {
      font-size: 12px;
    }
  }
  > .btn {
    text-align: center;
    width: 20%;
    margin: 0 auto 100px;
    font-size: 20px;
    @media #{$phone} {
      width: 60%;
    }
    > button {
      padding: 15px 0;
      letter-spacing: 3px;
    }
  }
  > .content {
    width: 95%;
    margin: 50px auto;
    @media screen and (max-width: 800px) {
      flex-direction: column-reverse;
    }
    @media #{$phone} {
      width: 100%;
    }
    > .top{
      @media #{$phone} {
        display: block;
      }
      > .left {
        width: 62%;
        @media screen and (max-width: 800px) {
          width: 100%;
        }
        > .confirm_table {
          @media screen and (max-width: 800px) {
            margin-top: 50px;
          }
          > .cell {
            border-top: 1.8px solid $color-gray;
            padding: 20px 15px;
            font-size: 14px;
            @media #{$phone} {
              padding: 0;
            }
            > .heading {
              width: 25%;
              @media #{$phone} {
                width: 45%;
              }
            }
            > .detail {
              width: 75%;
              line-height: 20px;
              @media #{$phone} {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 95%;
                padding: 10px 0;
              }
              > .content {
                > .red-txt{
                  color: $color-red2;
                }
                @media #{$phone} {
                  width: 80%;
                  font-size: 14px;
                  line-height: 20px;
                  padding: 5px 0;
                }
              }
              > .btn {
                width: 18%;
                max-width: 60px;
                > button {
                  padding: 5px 0;
                  font-size: 15px;
                }
              }
            }
            > .btn {
              width: 8%;
              > button {
                padding: 4px 0;
              }
            }
            &:last-child {
              border-bottom: 1.8px solid $color-gray;
            }
          }

          @media #{$phone} {
            > .credit {
              .detail {
                padding: 15px 0;
              }
            }
            > .point, .remarks {
              .detail {
                padding: 20px 0;
              }
            }
          }
        }
        > .change {
          margin-top: 20px;
          > .order_change {
            &:first-child {
              margin-right: 10px;
            }
            > .btn-parts3 {
              padding: 10px 5px;
            }
          }
        }
      }
      > .right {
        width: 33%;
        background-color: rgba(94, 84, 83, 0.1);
        padding: 55px 20px;
        border-radius: 5px;
        @media screen and (max-width: 800px) {
          margin-top: 50px;
          width: 100%;
          flex-direction: column-reverse;
        }

        > .row {
          > p {
            &::after {
              content: attr(data-txt);
              font-size: 12px;
              padding-left: 4px;
            }
          }
          &:last-child {
            padding-top: 50px;
            font-size: 23px;
            @media #{$phone} {
              font-size: 16px;
              padding-top: 20px;
            }
            > .price {
              font-family: "Noto Sans JP", sans-serif;
              font-weight: 500;
              font-style: normal;
              color: $color-front;
            }
            span {
              font-size: 14px;
            }
          }
          &:not(:last-child) {
            padding: 10px 0;
            @media #{$phone} {
              padding: 20px 0;
            }
          }
        }
        > .stotal{
          font-family: "Noto Sans JP", sans-serif;
          font-weight: 500;
          font-style: normal;
          border-top: 1px dashed $color-txt2;
          border-bottom: 1px dashed $color-txt2;
          @media #{$phone} {
            font-size: 14px;
          }
        }
      }
    }
    > .bottom{
      > .cart_collections {
        margin: 60px auto 80px;
        @media #{$phone} {
          margin-bottom: 0;
        }
        > .cell {
          border: 1px solid $color-gray;
          border-radius: 3px;
          padding: 30px;
          margin-top: 20px;
          position: relative;
          @media #{$phone} {
            flex-direction: column;
            padding: 10px;
          }
          > .img {
            width: 90%;
            @media #{$phone} {
              width: 100%;
            }
            @media #{$tablet} {
              width: 80%;
            }
            > img {
              object-fit: cover;
              @media #{$tablet} {
                aspect-ratio: 1;
              }
            }
          }
          > .txt {
            margin-left: 10px;
            width: 77%;
            @media #{$tablet} {
              width: 100%;
            }
            @media #{$phone} {
              margin-left: 0px;
              width: 100%;
            }
            > .name {
              font-size: 20px;
              padding: 10px 0 20px;
              @media #{$phone} {
                margin-top: 20px;
                font-size: 17px;
              }
            }
            > .center {
              > .price {
                font-family: "Noto Sans JP", sans-serif;
                font-weight: 500;
                font-style: normal;
                width: 70%;
                font-size: 22px;
                @media #{$phone} {
                  font-size: 25px;
                }
                > p {
                  &::after {
                    content: attr(data-text);
                    font-size: 11px;
                    padding-left: 6px;
                  }
                }
              }

              > .delivery_days{
                margin-top: 5%;
                > .txt{
                  > .inner{
                    margin-left: 15px;
                  }
                }
                > .delivery_days_area{
                  flex-wrap: wrap;
                  > .inner{
                    width: calc((96% - 5px) / 4);
                    margin-right: 5px;
                    &:nth-child(4n) {
                      margin-right: 0px;
                    }
                    > .btn{
                      color: $color-front;
                      text-align: center;
                      margin: 0 auto;
                      border: 1px solid $color-front;
                      width: 100%;
                      padding: 10px 0;
                      border-radius: 3px;
                      color: $color-front;
                      font-size: 14px;
                      margin-top: 15px;
                      @media #{$phone} {
                        font-size: 12px;
                      }
                    }
                    > .count{
                      margin-top: 5px;
                      @media #{$phone} {
                        font-size: 12px;
                      }
                      .num{
                        background-color: $color-gray;
                        display: block;
                        text-align: center;
                        @media #{$phone} {
                          padding: 5px 0;
                        }
                        > .button{
                          > .minus_btn, > .plus_btn{
                            margin-bottom: 4px;
                            > .img{
                              width: 10px;
                              height: auto;
                              vertical-align: middle;
                            }
                            &:hover {
                              transition: 0.5s;
                              filter: brightness(60%);
                            }
                          }
                        }
                      }
                      .none{
                        padding: 2px 0;
                      }
                    }
                  }
                }
              }
            }
          }
          > .buttons{
            width: 20%;
            @media #{$tablet} {
              width: 30%;
            }
            @media #{$phone} {
              width: 100%;
              margin: 50px auto 0;
              align-items: center;
            }
            > .change_btn{
              margin-bottom: 10px;
              width: 100px;
              transition: 0.4s;
              width: fit-content;
              padding: 8px 25px 6px;
              border-radius: 3px;
              margin-left: auto;
              margin-right: 0;
              font-size: 13px;
              background-color: $color-red2;
              color: white;
              &:hover {
                filter: brightness(50%);
              }
              @media #{$phone} {
                margin-left: 0;
                padding: 15px 30px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
  > .order-btn{
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
}
</style>