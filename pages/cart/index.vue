<template>
  <div>
    <CartFlow :isCart="true" v-show="!isLoading && cartItems.length" class="cartflow">
    </CartFlow>
    <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>

    <div class="wrapper">
      <div class="content max-width-content">
        <div class="cart">
          <p :class="{ cart_empty: !cartItems.length }">お客様のカート</p>

          <div class="product">
            <div class="left">

              <div class="cart_empty" v-if="!cartItems.length && !isLoading">
                <p>現在カートに商品は入っていません</p>
                <div class="btn">
                  <nuxt-link to="/product">ショッピングを続ける</nuxt-link>
                </div>
              </div>
              <div class="inCart" v-else-if="cartItems.length && !isLoading">
                <div
                  class="box"
                  v-for="(cartItem, index) in cartItems"
                  :key="index"
                >
                  <div class="cell flex _j-between">
                    <div class="img">
                      <img
                        :src="cartItem.product.product_images[0].image.url"
                        alt=""
                      />
                    </div>
                    <div class="txt">
                      <div class="name">{{ cartItem.product.name }}</div>
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
                              <button class="btn btn-parts2 disabled"
                                v-if="orderStopThatDay && detail_index == 0 && !purchaseable
                                || orderStopDayBefore && detail_index == 0
                                || orderStopDayBefore && detail_index == 1 && !purchaseable
                                || orderStopHolidayBefore && detail_index == 0
                                || orderStopHolidayBefore && detail_index == 1
                                || orderStopHolidayBefore && detail_index == 2 && !purchaseable
                                || detail.holiday
                                || detail.period_end" disabled>
                                {{ detail.date }}{{ detail.weekday }}
                              </button>
                              <button class="btn btn-parts2" :class="{on_order: detail.count > 0}" @click="plusCounter(detail)" v-else>{{ detail.date }}{{ detail.weekday }}</button>
                              <div class="count" v-if="detail.count > 0">
                                <p class="num">
                                  <span class="button"><button class="minus_btn" @click="minusCounter(detail)"><img class="img" src="/fronts/front/minus_btn.svg" alt=""></button></span>
                                  {{ detail.count }}
                                  <span class="button"><button class="plus_btn" @click="plusCounter(detail)"><img class="img" src="/fronts/front/plus_btn.svg" alt=""></button></span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="buttons flex _column _j-center">
                      <button
                        class="delete_btn"
                        @click="deleteItem(cartItem, $event)"
                      >
                        <p>削除</p>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class="right" v-show="cartItems.length && !isLoading">
              <div class="total">
                <div class="sum flex _a-center _j-between">
                  <p data-text="(税込)">小計</p>
                  <p data-text="円">{{ sTotalChange(sTotal) }}</p>
                </div>
              </div>
              <div
                class="next btn-parts2 btn"
                @click="goOrder()"
              >
                <button>ご注文へ進む</button>
              </div>
              <div class="product btn-parts2 btn">
                <nuxt-link to="/product" class="link"
                  >ショッピングを続ける</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "カート",
    };
  },
  data() {
    return {
      cartItems: [],
      oldCartItems: [],
      products: [],
      product_images: [],
      sTotal: 0,
      productCount: 0,
      addressLoad: false,
      errorMessages: [],
      orderData: {
        order: {},
      },
      isLoading: true,
      wrappings: [],
      noshis: [],
      years: [],
      deliveryDays: [],
      weekDays: [],
      test: [],
      orderStopDayBefore: false,
      orderStopThatDay: false,
      orderStopHolidayBefore: false,
      datetime_got_product: "",
      startGetItem: false,
      ordered: false,
      purchaseable: true,
    };
  },
  async mounted() {
    let data = await this.$frontApi.getUserState();
    if(!data.errorMessages.length){
      let cartItems = await this.$frontApi.getCarts();
      let orderStopDayBefore = JSON.parse(localStorage.getItem("orderStopDayBefore"));
      let orderStopThatDay = JSON.parse(localStorage.getItem("orderStopThatDay"));
      let orderStopHolidayBefore = JSON.parse(localStorage.getItem("orderStopHolidayBefore"));
      let purchaseable = JSON.parse(localStorage.getItem("purchaseable"));
      this.deliveryDays = JSON.parse(localStorage.getItem("deliveryDays"));
      if(cartItems.length > 0){
        if(orderStopDayBefore != undefined && orderStopThatDay != undefined && orderStopHolidayBefore != undefined && purchaseable != undefined && this.deliveryDays != undefined){
          this.orderStopDayBefore = orderStopDayBefore;
          this.orderStopThatDay = orderStopThatDay;
          this.orderStopHolidayBefore = orderStopHolidayBefore;
          this.purchaseable = purchaseable;
    
          for(let i = 0; i < cartItems.length; i++){
            cartItems[i].stringPrice = cartItems[i].price;
          }

          this.cartItems = cartItems;
          this.oldCartItems = this.cartItems;
          this.$store.commit("cart/setCartCount", this.cartItems.length);
          for (let i = 0; i < this.oldCartItems.length; i++) {
            // 日付形式を修正
            for (let j = 0; j < this.oldCartItems[i].cart_details.length; j++) {
              let delivery_day = new Date(this.oldCartItems[i].cart_details[j].delivery_day);
              this.oldCartItems[i].cart_details[j].delivery_day = this.formatMonthDay(delivery_day);
            }
          }

          // this.deliveryDaysのyearを格納（サーバーに投げるときに再使用）
          for(let i = 0; i <  this.deliveryDays.length; i++){
            this.years.push(this.deliveryDays[i].year);
          }
          this.getItem();
        }
        else{
          // カートの中身があるのにローカルストレージの必要な情報が削除されているとき
          this.logout();
        }
      }
      else{
        // カートの中身0なのにローカルストレージに情報が残っているときはすべて削除
        if(orderStopDayBefore != undefined && orderStopThatDay != undefined && orderStopHolidayBefore != undefined && purchaseable != undefined && this.deliveryDays != undefined){
          localStorage.removeItem('deliveryDays');
          localStorage.removeItem('orderStopDayBefore');
          localStorage.removeItem('orderStopThatDay');
          localStorage.removeItem('orderStopHolidayBefore');
          localStorage.removeItem('purchaseable');
          localStorage.removeItem('cartItems');
          localStorage.removeItem('orderData');
        }
      }
    }
    else{
      this.$util.isLostLogin();
    }
    this.isLoading = false;
  },
  methods: {
    async logout() {
      await this.$frontApi.logout();
      window.location.href = "/login";
    },
    formatMonthDay(date) {
      if (date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = ("0" + month).slice(-2);
        day = ("0" + day).slice(-2);
        let formatted = month + "/" + day;
        return formatted;
      }
      return date;
    },
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
    // ご注文へ進む
    async goOrder() {
      let userData = await this.$frontApi.getUserState();
      if(!userData.errorMessages.length){
        let errorCheck = false;
        for (let i = 0; i < this.cartItems.length; i++) {
          let cart_details = [];
          let delivery_days = [];
          let resData = [];
          this.errorMessages = [];
          this.cartItems[i].available = false;
          for (let j = 0; j < this.cartItems[i].cart_details.length; j++) {
            if(this.cartItems[i].cart_details[j].count > 0){
              this.cartItems[i].available = true;
              break;
            }
          }
          if(this.cartItems[i].available){
            for (let j = 0; j < this.cartItems[i].cart_details.length; j++) {
              let date = this.years[j] + "/" + this.cartItems[i].cart_details[j].date;
              date = new Date(date);
              delivery_days.push(this.formatDate(date)); 
  
              if(this.cartItems[i].cart_details[j].change || this.cartItems[i].cart_details[j].count > 0){
                cart_details.push({
                  "delivery_day": delivery_days[j],
                  "count": this.cartItems[i].cart_details[j].count
                });
              }
            }
            if(cart_details.length > 0){
              resData = await this.$frontApi.patchCart(cart_details, this.cartItems[i].id);
            }
            
            if(resData.errorMessages.length > 0){
              errorCheck = true;
              // this.errorMessages = resData.errorMessages;
              this.errorMessages.push(resData.errorMessages);
              this.$util.scrollToTop();
              // setTimeout(() => {
              //   this.errorMessages = [];
              // }, 2000);
              return;
            }
          }
          else{
            this.errorMessages.push("お届け日が選択されていない商品があります。商品を削除するか、お届け日を選択してください");
            this.$util.scrollToTop();
            return;
          }
        }
        if (!errorCheck) {
          this.ordered = true;
          this.cartItems = await this.$frontApi.getCarts();
          this.getItem();
          // ローカルストレージにセット(カート商品)
          localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
          // ローカルストレージにセット (小計)
          this.orderData.order.subtotal_price = this.sTotal;
          localStorage.setItem("orderData", JSON.stringify(this.orderData));
          this.$router.push("/cart/info");
        }
      }
      else{
        this.$util.isLostLogin();
      }
    },

    async deleteItem(item, e) {
      if (confirm(`${item.name}を本当にカートから削除しますか？`)) {
        this.errorMessages = await this.$frontApi.deleteCart(item.id, e);
        if(this.errorMessages.length){
          this.$util.scrollToTop();
        }
        else{
          this.cartItems = await this.$frontApi.getCarts();
          window.location.reload();
        }
      }
    },
    getItem(){
      this.sTotal = 0;
      for (let i = 0; i < this.cartItems.length; i++) {
        // this.cartItems.cart_details.delivery_dayの日付形式を変更する
        for (let j = 0; j < this.cartItems[i].cart_details.length; j++) {
          let delivery_day;
          if(!this.ordered){
            delivery_day = this.years[j] + "/" + this.cartItems[i].cart_details[j].delivery_day;
            delivery_day = new Date(delivery_day);
          }
          else{
            delivery_day = new Date(this.cartItems[i].cart_details[j].delivery_day);
          }
          
          this.cartItems[i].cart_details[j].delivery_day = this.formatMonthDay(delivery_day);
          this.sTotal += this.cartItems[i].cart_details[j].count * this.cartItems[i].price;
        }

        let deliveryDays = [];
        for(let j = 0; j < this.deliveryDays.length; j++){
          // 一致したらmatched.countを追加、一致しなかったら0を追加
          let matched = this.cartItems[i].cart_details.find((c) => c.delivery_day == this.deliveryDays[j].date);
          if(matched != undefined){
            deliveryDays.push({
              "date": this.deliveryDays[j].date,
              "count": matched.count,
              "weekday": this.deliveryDays[j].weekday,
              "holiday": this.deliveryDays[j].holiday,
              "added": true,
              "year": this.deliveryDays[j].year
            });
          }
          else{
            deliveryDays.push({
              "date": this.deliveryDays[j].date,
              "count": 0,
              "weekday": this.deliveryDays[j].weekday,
              "holiday": this.deliveryDays[j].holiday,
              "added": false,
              "year": this.deliveryDays[j].year
            });
          }
        }

        this.cartItems[i].cart_details = deliveryDays;
      }
      this.isLoading = false;
    },
    sTotalChange(sTotal){
      sTotal = 0;
      for (let i = 0; i < this.cartItems.length; i++){
        for (let j = 0; j < this.cartItems[i].cart_details.length; j++) {
          sTotal += this.cartItems[i].cart_details[j].count * this.cartItems[i].price;
        }
      }
      return sTotal.toLocaleString();
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
    plusCounter(detail){
      detail.count += 1;
      detail.change = true;
    },
    minusCounter(detail){
      if(detail.count > 0){
        detail.count -= 1;
        if(detail.added){
          detail.change = true;
        }
      }

      if(detail.count == 0 && !detail.added){
        detail.change = false;
      }
    },
  },
  computed: {
    faCircleMinus() {
      return faCircleMinus;
    },
    faCirclePlus() {
      return faCirclePlus;
    },
  }
};
</script>

<style lang="scss" scoped>
.errorMessages {
  position: fixed;
  width: 100%;
  z-index: 2;
  top: 10px;
  animation: slideIn2 2s;
  @media #{$phone} {
    top: auto;
    bottom: 20px;
    z-index: 1000;
    font-size: 12px;
    animation: slideUp 2s;
  }
}
.cartflow {
  padding-bottom: 50px;
  @media #{$phone} {
    padding-bottom: 20px;
  }
}

.wrapper {
  min-height: 600px;
  color: $color-front;
  > .content {
    width: 90%;
    margin: 0 auto;
    @media #{$phone} {
      width: 95%;
    }
    > .cart {
      color: $color-front;
      position: relative;
      > p {
        text-align: center;
        margin-top: 60px;
        font-size: 25px;
        @media #{$phone} {
          font-size: 21px;
          margin-top: 10px;
        }
        &.cart_empty {
          margin-top: 100px;
        }
      }
      > .product {
        margin-bottom: 5px;
        @media #{$phone} {
          display: block;
        }
        > .left {
          margin: 60px 0;
          width: 100%;
          @media #{$phone} {
            width: 100%;
            font-size: 15px;
          }
          > .cart_empty {
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translateX(-50%);
            @media #{$phone} {
              margin-top: 50px;
              width: 100%;
            }
            > p {
              margin-top: 50px;
              @media #{$phone} {
                text-align: center;
              }
            }

            > .btn {
              transition: 0.4s;
              font-size: 14px;
              text-align: center;
              margin: 70px auto 0;
              color: white;
              border-radius: 5px;
              width: fit-content;

              &:hover {
                filter: brightness(50%);
              }
              > a {
                padding: 14px 30px;
                font-size: 17px;
                background-color: $color-red2;
                border-radius: 5px;
              }
            }
          }

          > .inCart{
            > .box {
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
                    width: auto;
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
                      @media #{$phone} {
                        margin-top: 20px;
                      }
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
                            width: 100%;
                            padding: 10px 0;
                            border-radius: 3px;
                            color: $color-front;
                            font-size: 14px;
                            border: 1px solid $color-front;
                            margin-top: 15px;
                            @media #{$phone} {
                              width: 100%;
                              font-size: 12px;
                            }
                          }
                          > .disabled{
                            pointer-events: none;
                            border: 1px solid $color-gray;
                            color: $color-gray;
                          }
                          > .on_order{
                            background-color: #0D4B6D;
                            color: white;
                          }
                          > .count{
                            margin-top: 5px;
                            .num{
                              background-color: $color-gray;
                              display: block;
                              text-align: center;
                              > .button{
                                > .minus_btn, > .plus_btn{
                                  margin-bottom: 4px;
                                  > .img{
                                    width: 10px;
                                    height: auto;
                                    vertical-align: middle;
                                    @media #{$phone} {
                                      width: 15px;
                                    }
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
                  .delete_btn{
                    margin-bottom: 10px;
                    > p {
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
        }
        > .right {
          width: 100%;
          margin-top: 5px;
          @media #{$phone} {
            margin-bottom: 30px;
          }
          > .total {
            font-family: "Noto Sans JP", sans-serif;
            font-weight: 500;
            font-style: normal;
            background-color: $color-gray;
            padding: 10px 40px 20px;
            border-radius: 5px;
            @media #{$phone} {
              margin: 0;
            }
            .sum {
              border-bottom: 1px dashed $color-red2;
              padding: 10px 0 10px;
              > p {
                &::after {
                  content: attr(data-text);
                  font-size: 12px;
                  padding-left: 4px;
                }
              }
            }
          }
          .next, .link {
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
          > .next {
            margin-top: 50px;
            background-color: $color-red2;
          }
          > .product {
            .link{
              background-color: $color-gray;
              margin: 20px auto 100px;
            }
          }
        }
      }
    }
    > .cart_s {
      color: $color-front;
      > p {
        text-align: center;
        font-size: 1.5rem;
        margin: 40px 0;
      }
      > .product {
        > p {
          margin-bottom: 10px;
          font-size: 1rem;
        }
        > .cell {
          border: 2px solid $color-front;
          border-radius: 5px;
          padding: 20px;
          > .l {
            > .img {
              width: 30%;
            }
            > .txt {
              width: 66%;
            }
          }
          > .s {
            > .left {
              width: 22%;
              > .select {
                height: 54px;
                &::before {
                  top: 6px;
                  left: 8%;
                }
                &::after {
                  right: 9%;
                }
                > select {
                  border-radius: 3px;
                }
              }
            }
            > .right {
              width: 73%;
              > .price {
                font-family: "Noto Sans JP", sans-serif;
                font-weight: 500;
                font-style: normal;
                font-size: 1.25rem;
                > span {
                  padding-left: 20px;
                }
              }
              > .fee {
                padding-top: 4px;
              }
            }
          }
          .delete {
            text-align: right;
            margin-top: 20px;
            display: inline;
            border-bottom: 1px solid $color-gray;
            color: $color-gray;
          }
        }
      }
    }
  }
}
</style>
