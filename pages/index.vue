import { default } from '../.nuxt/components/nuxt-loading.vue';
<template>
  <div class="main-content">
    <div class="top_image pc_only" v-if="!load && slidesArray.length">
      <client-only>
        <swiper :options="topSwiperOptions" ref="swiper">
          <swiper-slide v-for="slider in slidesArray" :key="slider.id">
            <!-- <img :src="slider.image.url" v-if="slider.image.url"/> -->
            <img :src="slider"/>
          </swiper-slide>
        </swiper>
      </client-only>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
      <div slot="pagination" class="swiper-pagination"></div>
    </div>
    <div class="top_image_s smart_only" v-if="!load && slidesArray.length">
      <client-only>
        <swiper :options="topSwiperOptionsSp" ref="swiper_s">
          <swiper-slide v-for="slider in slidesArray" :key="slider.id">
            <!-- <img :src="slider.image.url" alt=""/> -->
            <img :src="slider" alt=""/>
          </swiper-slide>
        </swiper>
      </client-only>
    </div>

    <div class="main" v-if="!load">
      <article class="box-menu">
        <section class="menu-wrap" v-if="!load && limitedProducts">
          <h3 class="menu-title">期間限定弁当</h3>
          <div class="menu-content flex _wrap">

            <div class="content-detail" v-for="limitedProduct in limitedProducts" :key="limitedProduct.id">
              <nuxt-link :to="`/product/${limitedProduct.id}`" class="link">
                <img :src="limitedProduct.product_images[0].image.url" alt="" class="img">
                <div class="name-content flex">
                  <p class="name">{{ limitedProduct.name }}</p>
                  <p class="category">{{ findCategory(limitedProduct.category_id) }}</p>
                </div>
                <p class="red-txt">{{ limitedDate(limitedProduct.period_start_on) }} 〜 {{ limitedDate(limitedProduct.period_end_on) }} 販売</p>

                <div class="price_area flex _a-end">
                  <p class="price">¥{{ limitedProduct.common_selling_price }}</p>
                  <!-- <p class="display_price" v-if="limitedProduct.display_price != null">¥{{ limitedProduct.display_price }}</p> -->
                </div>
              </nuxt-link>
            </div>
          </div>
        </section>
      </article>
      <div class="message">
        <div class="inner flex">
          <div class="left pc_only">
            <div class="box">
              <img class="img" src="/fronts/front/message.svg" alt="">
              <p class="inner_txt">食事づくりは愛</p>
            </div>
          </div>
          <div class="left smart_only">
            <div class="box">
              <img class="img" src="/fronts/front/message.svg" alt="">
              <p class="inner_txt">食事づくりは愛</p>
            </div>
          </div>
          <div class="right flex">
            <div class="inner">
              <p class="text">
                千成はあなたの会社まで、<br>
                簡単な注文操作で<br>
                お好みのお弁当をお届けします。
              </p>
              <div class="logo">
                <img class="img" src="/fronts/front/footer/logo.svg" alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <article class="box-menu">
        <section class="menu-wrap" v-if="!load && products">
          <h3 class="menu-title">お弁当メニュー</h3>
          <div class="menu-content flex _wrap">
            <div class="content-detail" v-for="product in products" :key="product.id">
              <nuxt-link :to="`product/${product.id}`" class="link">
                <img :src="product.product_images[0].image.url" alt="" class="img">
                <div class="name-content flex">
                  <p class="name">{{ product.name }}</p>
                  <p class="category">{{ findCategory(product.category_id) }}</p>
                </div>
                <p class="price">¥{{ product.common_selling_price }}</p>
              </nuxt-link>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>

</template>

<script>
import HeaderSComponent from "~/components/HeaderSComponent.vue";
export default {
  data() {
    return {
      menus: this.$constants.FRONTMENUS,
      childID: false,
      slidesArray: [],
      categories: [],
      products: [],
      limitedProducts: [],
      load: true,
      userClientId: "",
      firstLoad: true,

      /* スワイパー設定 */
      topSwiperOptions: {
        centeredSlides: true,
        spaceBetween: 0,
        slidesPerView: 1.3,
        loop: true,
        fadeEffect: {
          crossFade: true,
        },
        speed: 3000,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      topSwiperOptionsSp: {
        centeredSlides: true,
        slidesPerView: 1.2,
        loop: true,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        speed: 3000,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      },
      /* スワイパー設定 */
    }
  },
  async mounted() {
    let userData = await this.$frontApi.getUserState();

    if(!userData.errorMessages.length){
      let products = await this.$frontApi.getProducts();
      let user = userData.user;
      this.userClientId = user.client.id;
      let date = await this.$frontApi.getDate();

      for (let i = 0; i < 3; i++) {
        this.slidesArray.push("/fronts/front/slider/banner0" + (i + 1) + ".jpg");
      }
  
      let today = new Date(date);
  
      // 商品だけ取得
      for(let i = 0; i < products.length; i++){
        // カテゴリー追加
        this.categories.push({
          id: products[i].id,
          name: products[i].name
        });
        for(let j = 0; j < products[i].products.length; j++){
           // 顧客ごとの表示価格を取得
          let matched = products[i].products[j].client_product_settings.find((p) => p.client_id == this.userClientId);
          if(matched != undefined && matched.price != null){
            products[i].products[j].common_selling_price = matched.price.toLocaleString();
          }
          // 期間内だったら期間限定商品を追加
          if (products[i].products[j].period_start_on != null && products[i].products[j].period_end_on != null) {
            let start = new Date(products[i].products[j].period_start_on);
            let end = new Date(products[i].products[j].period_end_on);
            if(start <= today && end >= today){
              this.limitedProducts.push(products[i].products[j]);
              this.products.push(products[i].products[j]);
            }
          }
          else if(products[i].products[j].period_start_on != null && products[i].products[j].period_end_on == null){
            let start = new Date(products[i].products[j].period_start_on);
            if(start <= today){
              this.limitedProducts.push(products[i].products[j].period_start_on);
              this.products.push(products[i].products[j]);
            }
          }
          else if(products[i].products[j].period_start_on == null &&  products[i].products[j].period_end_on != null){
            if(end >= today){
              this.limitedProducts.push(products[i].products[j].period_end_on);
              this.products.push(products[i].products[j]);
            }
          }
          // 期間限定以外の商品を追加
          else{
            this.products.push(products[i].products[j]);
          }
        }
      };
    }
    else{
      this.$util.isLostLogin();
    }

    this.load = false;
  },
  methods: {
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
    // カテゴリーidと一致するカテゴリー名を取得
    findCategory(category_id){
      let category = this.categories.find((c) => c.id == category_id);
      return category.name;
    },
  },
  components: {HeaderSComponent},
}
</script>


<style lang="scss" scoped>
.main-content {
  font-family: 'Noto Sans JP'; 
  color:$color-front;
  max-width: 1500px;
  margin: 0 auto;
  >.top_image_s {
    margin-top: 80px;
  }
  > .main{
    width: min(95%,1050px);
    margin: 30px auto 0;
    > .box-menu {
      > .menu-wrap {
        > .menu-title {
          padding: 10px 0;
          margin: 90px auto 50px;
          text-align: center;
          font-size: clamp(18px, 5vw,28px);
          letter-spacing: 0.1em;
          font-weight: bold;
          border-top: solid 2px $color-red2;
          border-bottom: solid 2px $color-red2;
          @media #{$phone} {
            margin: 50px auto 30px;
          }
        }
        > .menu-content {
          > .content-detail {
            margin-bottom: 50px;
            margin-right: 40px;
            width: calc((100% - 40px) / 2);
            @media #{$phone} {
              margin-bottom: 35px;
              margin-right: 20px;
              width: calc((100% - 20px) / 2);
            }
            &:nth-child(2n) {
              margin-right: 0;
            }

            .red-txt{
              font-family: "Noto Sans JP", sans-serif;
              font-weight: 500;
              font-style: normal;
              margin-top: 10px;
              color: $color-red2;
              @media #{$phone} {
                font-size: 0.8rem;
                margin-top: 12px;
              }
            }
            .name-content {
              margin-top: 26px;
              @media #{$phone} {
                flex-direction: column;
                margin-top: 20px;
              }
              .name {
                font-size: clamp(14px, 3.8vw, 20px);
                margin-right: 20px;
                @media #{$phone} {
                font-size: .95rem;
                }
              }
              .category {
                color: #fff;
                font-size: clamp(11px,3vw,14px);
                padding: 5px 10px;
                width: fit-content;
                letter-spacing: 0.1em;
                background-color: $color-orange;
                @media #{$phone} {
                  font-size: .5rem;
                  padding: 3px 10px;
                  margin-top: 10px;
                }
              }
            }
            .img {
              width: 100%;
              aspect-ratio: 4/3;
              object-fit: cover;
            }
            .price, .display_price {
              font-family: "Noto Sans JP", sans-serif;
              font-weight: 500;
              font-style: normal;
              margin-top: 30px;
              font-size: 22px;
              @media #{$phone} {
                margin-top: 20px;
                font-size: 15px;
              }
            }
            .display_price {
              margin-left: 10px;
              text-decoration: line-through;
              font-size: 16px;
              color: $color-gray2;
              @media #{$phone} {
                margin-top: 20px;
                font-size: 15px;
              }
            }
          }
        }
      }
      &:first-child{
        margin-bottom: 100px;
        @media #{$phone} {
          margin-bottom: 50px;
        }
      }
    }
    > .message{
      background-color: $color-red2;
      color: $color-wh;
      align-items: stretch;
      > .inner{
        padding: 70px 40px;
        @media #{$phone} {
          display: block;
          padding: 0;
        }
        > .left{
          width: calc((100% - 80px) / 2);
          height: 150px;
          > .box {
            position: relative;
            top: -100%;
            margin: auto;
            width: 70%;
            padding-top: 60%;
            background-color: $color-wh;
            box-shadow: 7px 6px 12px -8px $color-txt2;
            @media #{$tablet} {
              top: -80%;
            }
            > .img{
              position: absolute;
              top: 0;
              right: -40%;
              width: 80%;
              @media #{$tablet} {
                top: -8%;
              }
            }
            > .inner_txt{
              font-family: Hiragino;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              -webkit-transform: translate(-50%, -50%);
              -ms-transform: translate(-50%, -50%);
              color: $color-front;
              font-size: clamp(15px, 3vw,30px);
              white-space: nowrap;
            }
          }

          &.smart_only {
            width: 100%;
            > .box {
              position: static;
              margin: auto;
              width: 100%;
              padding-top: 0;
              box-shadow: none;
              > .img{
                position: static;
                display: flex;
                justify-content: flex-end;
                width: 40%;
                margin-left: auto;
                margin-bottom: -20px;
              }
              > .inner_txt {
                position: static;
                font-size: 1.75rem;
                -webkit-transform: none;
                text-align: center;
                padding: 34px 0;
                font-family: Hiragino;
                // box-shadow:0 0 5px #fff, 0 0 5px #ccc, 0 0 1px #aaa;
                // -webkit-box-shadow:0 0 5px #fff, 0 0 5px #ccc, 0 0 1px #aaa;
                // -moz-box-shadow:0 0 5px #fff, 0 0 5px #ccc, 0 0 1px #aaa;
              }
            }
          }
        }
        > .right{
          margin-left: 40px;
          width: calc((100% - 80px) / 2);
          flex-direction: column;
          @media #{$phone} {
          display: block;
          width: 100%;
          margin: 0 auto;
          text-align: center;
          }
          > .inner{
            padding-left: 10%;
            @media #{$phone} {
              padding: 50px 20px 15px;
            }
            > .text{
              line-height: 2;
              font-size: clamp(15px, 2vw,25px);
              @media #{$phone} {
                font-size: 18px;
                font-weight: bold;
                line-height: 2.25;
              }
            }
            > .logo{
              margin-top: 40px;
              @media #{$phone} {
                margin: 40px auto 20px;
              }
              > .img{
                width: 200px;
                @media #{$phone} {
                  width: 150px;
                }
              }
            }
          }
        }
      }
    }
  }
  .swiper-button-next::after, .swiper-button-prev::after {
    content: none !important;
  }
  .swiper-pagination{
    display: none;
  }
}

</style>