<template>
  <article class="wrapper" ref="scrollElem">
  <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>
    <div class="history" v-if="!isLoading && orders.length">
      <p v-if="orders.length" class="displayCount">1-{{totalAmount}}件を表示中</p>
      <section class="group" v-for="order in orders" :key="order.id">
        <div class="date">注文日：{{order.created_at}}</div>
        <div class="inner" v-for="state in order.orders" :key="state.id">
          <div class="content btn-shadow">
            <div class="cell-item flex">
              <div class="img">
                <div class="inner">
                  <img :src="state.product.product_images[0].image.url" alt="">
                </div>
              </div>
              <div class="body">
                <div class="name">{{state.product_name}}</div>
                <div class="price property">¥{{state.client_product_setting.price}}<span>（税込）</span></div>
                <div class="date">お届け日： 計{{state.order_details.length}}日 / 計{{order.total_count}}食</div>
                <div class="delivery_days flex">
                  <div class="delivery_day" v-for="detail in state.order_details" :key="detail.id">
                    <div class="btn">
                      {{ changeFormat(detail.provision_on) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer flex _j-around _a-start">
          <div class="inner payment">
            支払い方法 : <span>クレジットカード</span>
          </div>
          <div class="inner price">
            支払い金額 : <span>￥{{order.total_price}}</span>
          </div>
          <div class="inner cancel">
            <span v-if="order.status == 'success' && order.cancel_time == null"><button class="btn-parts2 _red" @click="orderCancel($event, order.id)">キャンセル</button></span>
            <span v-if="order.status == 'cancel'"><button class="btn-parts2 _gray disabled">キャンセル済</button></span>
            <span v-if="order.cancel_time"><button class="btn-parts2 _gray disabled">キャンセル</button></span>
          </div>
        </div>
      </section>
    </div>

    <div class="empty" v-else v-show="!isLoading">
      購入履歴はありません。
    </div>
  </article>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      products: [],
      isLoading: true,
      totalAmount: "",
      errorMessages: [],
    }
  },
  async mounted() {
    let userData = await this.$frontApi.getUserState();
    if(!userData.errorMessages.length){
      let orders = await this.$frontApi.getOrders();
      if(orders.length > 0){
        for(let i = 0; i < orders.length; i++){
          let date = new Date(orders[i].created_at);
          orders[i].created_at = this.formatDateTime(date);
        }
        for(let i = 0; i < orders.length; i++){
          // statusがnull以外のときthis.ordersに追加
          if(orders[i].status != null){
            this.orders.push(orders[i]);
              // 20件まで表示
              if(this.orders.length > 20){
                break;
              }
            }
        }
        this.totalAmount = this.orders.length;
      }
    }
    else{
      this.$util.isLostLogin();
    }
    this.isLoading = false;
  },
  methods: {
    formatDateTime(date) {
      if (date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        month = ("0" + month).slice(-2);
        day = ("0" + day).slice(-2);
        let formatted = date.getFullYear() +  "年" + month + "月" + day + "日 " + hour + "時" + min + "分";
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
        let formatted = month + "/" + day;
        return formatted;
      }
      return date;
    },
    changeFormat(provision_on){
      let week = [ "(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)" ];
      let date = new Date(provision_on);
      let weekDay = date.getDay();
      let weekday = week[weekDay];
      date = this.formatDate(date);
      date = date + weekday;
      return date;
    },
    totalPrice(order_state){
      let totalPrice = 0;
      for(let i = 0; i < order_state.length; i++){
        totalPrice += order_state[i].total_price;
      }
      return totalPrice.toLocaleString();
    },
    async orderCancel(e, orderId){
      if(confirm(`注文をキャンセルしてもよろしいですか？`)){
        this.errorMessages = await this.$frontApi.deleteOrder(e, orderId);
        if(!this.errorMessages.length){
          this.$showSuccessMessage(
            "注文をキャンセルしました。"
          );
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        }
        else{
          return;
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  color: $color-front;
  margin-bottom: 60px;
  @media #{$phone} {
    width: 100%;
  }
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

  > .history {
    > .displayCount {
      font-size: 15px;
      margin-bottom: 10px;
    }
    > .group {
      > .date {
        // font-family: "Noto Sans JP", sans-serif;
        // font-weight: 500;
        // font-style: normal;
        background-color: $color-red2;
        color: white;
        padding: 10px;
        border-radius: 5px;
        padding-left: 30px;
      }

      > .inner {
        > .content {
          border-radius: 5px;
          border-bottom: 1px solid $color-gray;
          margin: 30px auto 20px;
          width: 95%;
          @media #{$phone} {
            margin-top: 50px;
            width: 100%;
          }

          .cell-item {
            margin: 20px 0;
            @media #{$phone} {
              position: relative;
            }
  
            > .img {
              width: 13%;
              @media #{$phone} {
                width: 30%;
              }
  
              > .inner {
                @media #{$phone} {
                  aspect-ratio: 1;
                }
  
                > img {
                  object-fit: cover;
                  width: 100%;
                  height: 100%;
                  display: block;
                }
              }
            }
  
            > .body {
              width: 70%;
              padding-left: 20px;
              font-size: 13px;
  
              > .name {
                font-size: 14px;
                padding-bottom: 16px;
              }
  
              > .property {
                padding-top: 4px;
                > span {
                  padding-left: 5px;
                  font-size: 10px;
                }
              }
  
              > .price {
                padding-top: 15px;
                font-size: 15px;
  
                > span {
                  padding-left: 5px;
                  font-size: 12px;
                }
              }

              > .date{
                margin-top: 15px;
              }

              > .delivery_days{
                > .delivery_day{
                  width: calc((96% - 5px) / 4);
                  margin-right: 5px;
                  flex-wrap: wrap;
                  > .btn{
                    text-align: center;
                    transition: 0.5s;
                    margin: 15px auto 0;
                    padding: 10px 0;
                    border-radius: 3px;
                    color: $color-front;
                    font-size: 14px;
                    border: 1px solid $color-front;
                    @media #{$phone} {
                      font-size: 12px;
                    }
                  }
                }
              }
  
              > .code {
                font-size: 12px;
              }
            }
          }
        }
      }
      > .footer {
        color: $color-front;
        margin: 30px 0;
        font-size: 14px;
        @media #{$phone} {
          display: block;
        }

        span {
          color: $color-front;
          padding-left: 10px;
          &::after {
            content: attr(data-txt);
            font-size: 12px;
            padding-left: 3px;
          }
        }

        > .inner {
          @media #{$phone} {
            margin-top: 5px;
          }

          &:nth-child(n+2) {
            margin-left: 30px;
            @media #{$phone} {
              margin-left: 0;
            }
          }
        }

        > .cancel{
          span{
            @media #{$phone} {
              padding-left: 0;
            }
            > .btn-parts2{
              font-size: 12px;
              text-align: center;
              width: 120px;
              color: white;
              letter-spacing: 3px;
              padding: 10px;
              border-radius: 5px;
              cursor: pointer;
              @media #{$phone} {
                width: 100%;
                font-size: 14px;
                margin-top: 30px;
              }
            }
            > .disabled{
              pointer-events: none;
              border: 1px solid $color-gray;
              color: $color-front;
            }
          }
        }
      }
    }
  }
  > .empty {
    text-align: center;
    margin-bottom: 50px;
  }
}
</style>
