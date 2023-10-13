<template>
  <div class="product">
    <ErrorFlash
    :errorMessages="errorMessages"></ErrorFlash>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <Pankuzu :pans="pans"></Pankuzu>
    <div class="main">
      <div v-if="!load && product" class="main-content flex _j-between">
        <div class="left">
          <img :src="selectImgUrl" alt="" class="select_img">
          <client-only>
            <swiper :options="swiperThumbs" ref="swiperThumbs" class="swiperThumbs">
              <swiper-slide v-for="(product_image, image_index) in product.product_images" :key="image_index">
                <img @click="selectImg(image_index)" :src="product_image.image.url" alt="" class="img">
              </swiper-slide>
            </swiper>
          </client-only>
        </div>
        <div class="right">
          <p class="catch_phrase">{{ product.catch_phrase }}</p>
          <h3 class="name">{{ product.name }}</h3>
          <p class="category">{{ product.category.name }}</p>
          <div class="period" v-if="product.period_start_on || product.period_end_on">
            <p class="red-txt">{{ limitedDate(product.period_start_on) }} 〜 {{ limitedDate(product.period_end_on) }} 販売</p>
          </div>
          <p class="price">¥ {{ product.stringPrice }}<span class="tax">（税込、配送料込み）</span></p>
          <div class="description smart_only" v-if="product.description">
            <h4 class="title">商品説明</h4>
            <p class="text">{{ product.description }}</p>
          </div>
          <div class="delivery_day">
            <p class="text">お届け日</p>
            <div class="button_area flex">
              <div class="inner" v-for="(deliveryDay, index) in deliveryDays" :key="index">
                <button class="btn btn-parts2 disabled" 
                  v-if="orderStopThatDay && index == 0 && !purchaseable
                  || orderStopDayBefore && index == 0
                  || orderStopDayBefore && index == 1 && !purchaseable
                  || orderStopHolidayBefore && index == 0
                  || orderStopHolidayBefore && index == 1
                  || orderStopHolidayBefore && index == 2 && !purchaseable
                  || deliveryDay.holiday
                  || deliveryDay.period_end" disabled
                >
                {{ deliveryDay.date }}{{ deliveryDay.weekday }}
                </button>
                <button class="btn btn-parts2" :class="{on_order: deliveryDay.count > 0}" @click="plusCounter(index)" v-else>{{ deliveryDay.date }}{{ deliveryDay.weekday }}</button>
                <div class="count" v-if="deliveryDay.count > 0">
                  <p class="num">
                    <span class="button"><button class="minus_btn" @click="minusCounter(index)"><img class="img" src="/fronts/front/minus_btn.svg" alt=""></button></span>
                    {{ deliveryDay.count }}
                    <span class="button"><button class="plus_btn" @click="plusCounter(index)"><img class="img" src="/fronts/front/plus_btn.svg" alt=""></button></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="cart">
            <button class="btn btn-parts2 _red" @click="addCart()">カートに追加</button>
          </div>
        </div>
      </div>
      <div class="description pc_only" v-if="product.description">
        <h4 class="title">商品説明</h4>
        <p class="text">{{ product.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSComponent from "~/components/HeaderSComponent.vue";
export default {
  head() {
    return {
      title: this.product.name,
    }
  },
  data() {
    return {
      product: [],
      holidays: [],
      years: [],
      errorMessages: [],
      deliveryDays: [],
      orderStopDayBefore: false,
      orderStopThatDay: false,
      orderStopHolidayBefore: false,
      load: true,
      weekDay: [],
      selectImgUrl: "",
      slideImgCount: 0,
      datetime_got_product: "",
      pans: [
        {
          path: "/product",
          name: "商品一覧",
        },
        {
          path: "",
          name: "",
        },
      ],
      swiperThumbs: {
        loop: false,
        loopedSlides: 4, //loopedSlidesは同じ値にする
        slidesPerView: 4,
        slideToClickedSlide: true
      },
      cart: {},
      cartItems: [],
      today: "",
      purchaseable: true,
    }
  },
  async mounted() {
    let data = await this.$frontApi.getUserState();

    if(!data.errorMessages.length){
      let details = await this.$frontApi.getProductDetail(this.$route.params.id);
      let date = await this.$frontApi.getDate();
      this.product = details.product;
      this.purchaseable = details.purchaseable;
      this.today = new Date(date);
      const today = new Date(date);
      let tomorrow = today.setDate(today.getDate() + 1);
      this.tomorrow = this.formatDate(new Date(tomorrow));

      // this.product = await this.$frontApi.getProductDetail(this.$route.params.id);

      let user = data.user;
      this.userClientId = user.client.id;

      this.datetime_got_product = this.$dayjs(new Date(details.today)).format("YYYY-MM-DD HH:mm:ss");

      // 顧客ごとの表示価格を取得
      let matched = this.product.client_product_settings.find((p) => p.client_id == this.userClientId);
      if(matched != undefined && matched.price != null){
        this.product.common_selling_price = matched.price;
        this.product.stringPrice = matched.price.toLocaleString();
      }

      let holidays = await this.$frontApi.getHolidays();

      for(let i = 0; i < holidays.length; i++){
        this.holidays.push(holidays[i].holiday_date);
      }

      this.pans[1].name = this.product.name;

      // deliveryDayの取得
      let week = [ "(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)" ];

      // 今日から１週間分の日付取得
      for(let i = 0; i < 7; i++){
        if(i == 0){
            this.deliveryDays.push({
            "date": this.today.setDate(this.today.getDate())
          });
        }
        else{
          this.deliveryDays.push({
            "date": this.today.setDate(this.today.getDate() + 1)
          });
        }
      }

      let holidayCheck = [];
      let period_end = this.product.period_end_on;

      // 曜日の追加 / 表示形式の変更
      for(let i = 0; i < this.deliveryDays.length; i++){
        this.deliveryDays[i].date = new Date(this.deliveryDays[i].date);
        holidayCheck.push(this.formatDate(this.deliveryDays[i].date));
        let weekDay = this.deliveryDays[i].date.getDay();
        this.deliveryDays[i].weekday = week[weekDay];
        this.deliveryDays[i].date = this.formatMonthDay(this.deliveryDays[i].date);
        this.$set(this.deliveryDays[i], "count", 0);
        this.$set(this.deliveryDays[i], "holiday", false);
        this.$set(this.deliveryDays[i], "period_end", false);
      }

      // 休日設定されてたらthis.deliveryDaysのholidayをtrueにする
      for(let i = 0; i < holidayCheck.length; i++){
        let check = this.holidays.find((h) => h == holidayCheck[i]);
        if(check != undefined){
          this.deliveryDays[i].holiday = true;
        }

        // 期間限定商品は終了日以降をお届け日に設定できないようにする
        if(period_end != null && holidayCheck[i] > period_end){
          this.deliveryDays[i].period_end = true;
        }
      }

      // 当日注文できる弁当の場合
      if(this.product.category.is_same_day_reservation){
        this.orderStopThatDay = true;
      }
      // 当日注文できない弁当の場合
      else{
        let matched = this.holidays.find((h) => h == this.tomorrow);
        if(matched != undefined){
          this.orderStopHolidayBefore = true;
        }
        else{
          this.orderStopDayBefore = true;
        }
      }

      this.selectImgUrl = this.product.product_images[0].image.url;
    }
    else{
      this.$util.isLostLogin();
    }
    this.load = false;
  },
  methods: {
    formatMonthDay(date) {
      if (date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = ("0" + month).slice(-2);
        day = ("0" + day).slice(-2);
        let formatted = month + "/" + day;
        this.years.push(date.getFullYear());
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
    limitedDate(date) {
      if (date) {
        let format = new Date(date);
        let month = format.getMonth() + 1;
        let day = format.getDate();
        month = ("0" + month).slice(-2);
        day = ("0" + day).slice(-2);
        let formatted = format.getFullYear() + "年" + month + "月" + day + "日";
        return formatted;
      }
      return date;
    },
    plusCounter(index){
      this.deliveryDays[index].count += 1;
    },
    minusCounter(index){
      if(this.deliveryDays[index].count > 0){
        this.deliveryDays[index].count -= 1;
      }
    },
    selectImg(image_index){
      this.selectImgUrl = this.product.product_images[image_index].image.url;
    },
    async addCart() {

      // if(!this.product.is_same_day_reservation && !this.orderStopDayBefore || this.orderStopThatDay && this.deliveryDays[0].count > 0){
      //   this.deliveryDays[0].count = 0;
      //   this.errorMessages = [];
      //   this.errorMessages.push("注文可能日時を過ぎているお届け日を解除しました");
      //   this.$util.scrollToTop();
      // }
      // else{
        for(let i = 0; i < this.deliveryDays.length; i++){
          this.deliveryDays[i].year = this.years[i];
        }

        this.cart = {
          "product_id": this.product.id,
          "price": this.product.common_selling_price,
          "datetime_got_product":this.datetime_got_product,
          "cart_details": []
        };

        for(let i = 0; i < this.deliveryDays.length; i++){
          if(this.deliveryDays[i].count > 0){
            let date = this.years[i] + "/" +  this.deliveryDays[i].date;
            date = new Date(date);
            date = this.formatDate(date);
            this.cart.cart_details.push({
              "delivery_day": date,
              "count": this.deliveryDays[i].count
            });
          }
        }

        // 個数はローカルストレージに追加したくない為一旦削除
        this.deliveryDays.forEach(element => delete element.count);

        localStorage.setItem("deliveryDays", JSON.stringify(this.deliveryDays));
        localStorage.setItem("orderStopDayBefore", JSON.stringify(this.orderStopDayBefore));
        localStorage.setItem("orderStopThatDay", JSON.stringify(this.orderStopThatDay));
        localStorage.setItem("orderStopHolidayBefore", JSON.stringify(this.orderStopHolidayBefore));
        localStorage.setItem("purchaseable", JSON.stringify(this.purchaseable));
        // localStorage.setItem("datetime_got_product", JSON.stringify(this.datetime_got_product));

        this.deliveryDays.forEach(element => this.$set(element, "count", 0));

        if(this.cart.cart_details.length != 0){
          this.errorMessages = [];
          let resData = [];

          resData = await this.$frontApi.postCart(this.cart);

          if (!this.errorMessages.length) {
            const cart = await this.$frontApi.getCarts();
            this.$store.commit("cart/setCartCount", cart.length);
            this.$showSuccessMessage(`商品をカートに追加しました`);
          } else {
            this.errorMessages.push(resData.errorMessages);
            this.$util.scrollToTop();
            // setTimeout(() => {
            //   this.errorMessages = [];
            // }, 2000);
          }
          this.cart = {};
        }
        else{
          this.errorMessages = [];
          this.errorMessages.push("商品を選択してください");
          this.$util.scrollToTop();
        }
      }
    // }
  },
  computed: {
    faCircleMinus() {
      return faCircleMinus;
    },
    faCirclePlus() {
      return faCirclePlus;
    },
  }
}
</script>

<style lang="scss" scoped>
.product {
  font-family: 'Noto Sans JP'; 
  width: min(95%,1050px);
  margin: 30px auto 0;
  color: $color-front;
  > .main{
    > .main-content{
      @media #{$phone} {
        display: block;
      }
      > .left {
        width: 55%;
        @media #{$phone} {
          width: 100%;
        }
        > .select_img{
          width: 100%;
          height: auto;
        }
        .swiper-slide{
          display: flex;
          margin-top: 10px;
          > .img {
            width: 90%;
            aspect-ratio: 16 / 9;
            object-fit: cover;
          }
        }
      }
      > .right {
        width: 43%;
        @media #{$phone} {
          width: 100%;
        }
        > .catch_phrase{
          @media #{$phone} {
            font-size: 12px;
            margin-top: 15px;
          }
        }
        > .name {
          font-size: 30px;
          margin-top: 20px;
          margin-right: 20px;
          @media #{$phone} {
            font-size: 17px;
            margin-top: 10px;
          }
        }
        > .category {
          margin-top: 10px;
          color: #fff;
          font-size: 12px;
          padding: 5px 10px;
          background-color: #D67C00;
          display: inline-block;
        }
        > .period {
          margin-top: 10px;
          > .red-txt{
            font-family: "Noto Sans JP", sans-serif;
            font-weight: 500;
            font-style: normal;
            color: $color-red2;
          }
        }
        > .price{
          font-family: "Noto Sans JP", sans-serif;
          font-weight: 500;
          font-style: normal;
          margin-top: 40px;
          font-size: 32px;
          @media #{$phone} {
            font-size: 25px;
            margin-top: 30px;
          }
          > .tax{
            font-size: 12px;
          }
        }
        > .description {
          @media #{$phone} {
            margin-top: 20px;
            > .title{
              font-size: 14px;
            }
            > .text{
              margin-top: 10px;
              font-size: 13px;
              line-height: 20px;
            }
          }
        }
        > .delivery_day{
          font-family: "Noto Sans JP", sans-serif;
          font-weight: 500;
          font-style: normal;
          margin-top: 20px;
          border-top: 1px solid $color-red2;
          border-bottom: 1px solid $color-red2;
          padding: 20px 0 15px;
          > .button_area{
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
              > .disabled{
                pointer-events: none;
                border: 1px solid $color-gray;
                color: $color-gray;
              }
            }
          }
        }
        > .cart{
          margin-top: 20px;
          > .btn{
            width: 100%;
            padding: 13px;
            &::before{
              content: "";
              width: 30px;
              height: 30px;
              margin-right: 10px;
              vertical-align: middle;
              display: inline-block;
              background-image: url("/fronts/front/cart_icon.svg");
            }
          }
        }
      }
    }
    > .description {
      margin-top: 70px;
      > .title{
        font-size: 18px;
      }
      > .text{
        margin-top: 20px;
        width: 80%;
      }
    }
  }
  .swiperTop .swiper-slide {
    text-align: center;
  }

  .swiperThumbs .swiper-slide {
    text-align: center;
  }
}

</style>