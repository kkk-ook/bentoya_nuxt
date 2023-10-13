import { mapState } from 'vuex';
<template>
  <div>
    <CartFlow :isInfo="true" v-show="!isLoading && user != null" class="cartflow"></CartFlow>
    
    <div class="wrapper" ref="scrollElem" v-if="user != null && !isLoading">
      <div class="content max-width-content">
        <div class="info">
          <p class="title-font">ご注文者情報確認</p>
          <div class="giver_info">
            <div class="delivery_table">
              <div class="cell flex _a-center _j-between usage">
                <div class="heading flex _a-center _j-between">
                  ご注文者様
                </div>
                <div class="detail">
                  <p data-txt="様" class="name">{{user.last_name}} {{user.first_name}}</p>
                  <p class="email">{{user.email}}</p>
                </div>
              </div>
            </div>
          </div>

          <p class="title-font">お届け先情報</p>

          <div class="giver_info">
            <div class="delivery_table">
              <div class="cell flex _a-center _j-between usage">
                <div class="heading flex _a-center _j-between">
                  お届け先
                </div>
                <div class="detail">
                  <p class="name">{{user.client}}</p>
                  <p class="address">{{user.delivery_location}}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="buttons flex _column">
            <button class="next btn-parts2" @click="goOrder">
              次に進む
            </button>
            <div class="cart">
              <nuxt-link to="/cart" class="link btn-parts2">カートに戻る</nuxt-link>
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
      title: "ご注文情報確認",
    };
  },
  data() {
    return {
      user: {},
      cartItems: [],
      client: "",
      delivery_location: "",
      isLoading: true,
    }
  },
  async mounted() {
    let userData = await this.$frontApi.getUserState();
    if(!userData.errorMessages.length){
      let user = userData.user;
      this.user.last_name = user.last_name;
      this.user.first_name = user.first_name;
      this.user.delivery_location = user.delivery_location.name;
      this.user.client = user.client.company_name;
      this.user.email = user.email;
    }
    else{
      this.$util.isLostLogin();
    }

    this.isLoading = false;
  },
  methods: {
    goOrder(){
      const orderData =  {
        order: {}
      }

      const getData = JSON.parse(localStorage.getItem("orderData"));

      orderData.order.last_name = this.user.last_name;
      orderData.order.first_name = this.user.first_name;
      orderData.order.client = this.user.client;
      orderData.order.delivery_location = this.user.delivery_location;
      orderData.order.email = this.user.email;
      orderData.order.subtotal_price = getData.order.subtotal_price;
      orderData.order.total_price = getData.order.subtotal_price;

      localStorage.setItem("orderData", JSON.stringify(orderData));

      this.$router.push("/cart/confirm");
    }
  }
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
  color:  $color-front;
  max-width: 1200px;
  position: relative;
  width: 90%;
  margin: 0 auto;
  @media #{$phone} {
    width: 95%;
  }
  > .content{
    > .info{
      > .title-font {
        font-size: 28px;
        margin-top: 100px;
        text-align: center;
        @media #{$phone} {
          font-size: 21px;
          margin-top: 30px;
        }
      }

      > .giver_info {
        width: 95%;
        margin: 80px auto;

        @media #{$phone} {
          font-size: 14px;
          margin: 20px auto 50px;
        }

        > .title-font {
          font-size: 20px;
          @media #{$phone} {
            font-size: 18px;
          }
        }

        input[type=text] {
          border: 1px solid $color-gray;
          color: $color-front;
        }

        .detail {
          line-height: 25px;
          > .name {
            &::after {
              content: attr(data-txt);
              padding-left: 10px;
              font-size: 14px;
            }
          }
          > .postal {
            font-size: 13px;
            padding-top: 20px;
            line-height: 0px;

            &::before {
              content: attr(data-txt);
              padding-right: 3px;
              font-size: 12px;
            }
          }
          > .address {
            font-size: 14px;
            padding-top: 5px;
          }
        }
      }

      > .buttons {
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
          background-color: $color-red2;
        }
        > .cart {
          .link{
            background-color: $color-gray;
            margin: 20px auto 100px;
          }
        }
      }
    }
  }

  .delivery_table {
    margin-top: 50px;
    > .cell {
      margin-top: 10px;
      align-items: stretch;
      > .heading {
        width: 26%;
        background-color: $color-gray;
        color: $color-front;
        border-radius: 3px;
        padding: 30px;
        font-size: 15px;
        @media #{$phone} {
          width: 50%;
          font-size: 14px;
          justify-content: left;
        }
      }
      > .detail {
        width: 72%;
        padding: 20px 0 10px 14px;
        position: relative;
        @media #{$phone} {
          width: 100%;
          padding: 20px 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
