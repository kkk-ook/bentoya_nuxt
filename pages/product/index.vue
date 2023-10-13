import { default } from '../.nuxt/components/nuxt-loading.vue';
<template>
  <div class="main-content">
    <div class="top-img">
      <img class="img" src="/fronts/front/product_top.jpg" alt="">
      <h2 class="title">商品一覧</h2>
    </div>
    <Pankuzu :pans="pans"></Pankuzu>
    <article class="box-menu">
      <section class="menu-wrap" v-if="!load && products">
        <div class="menu-content flex _wrap">
          <div class="content-detail" v-for="product in products" :key="product.id">
            <nuxt-link :to="`/product/${product.id}`" class="link">
              <img :src="product.product_images[0].image.url" alt="" class="img">
              <div class="name-content flex">
                <h3 class="name">{{ product.name }}</h3>
                <p class="category">{{ findCategory(product.category_id) }}</p>
              </div>
              <div class="price_area flex">
                <p class="price">¥{{ product.common_selling_price }}</p>
                <!-- <p class="display_price" v-if="product.display_price != null">¥{{ product.display_price }}</p> -->
              </div>
            </nuxt-link>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
import HeaderSComponent from "~/components/HeaderSComponent.vue";
export default {
  head() {
    return {
      title: "商品一覧",
    };
  },
  data() {
    return {
      slidesArray: [],
      categories: [],
      products: [],
      limitedProducts: [],
      load: true,
      userClientId: "",
      pans: [
        {
          path: "/product",
          name: "商品一覧",
        },
      ],
    }
  },
  async mounted() {
    let data = await this.$frontApi.getUserState();

    if(!data.errorMessages.length){
      let products = await this.$frontApi.getProducts();
      let user = data.user;
      this.userClientId = user.client.id;

      let date = await this.$adminApi.getDate();
      let today = new Date(date);

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
  width: min(95%,1050px);
  margin: 30px auto 0;
  @media #{$phone} {
    margin: 80px auto 0;
    }
  .top-img{
    position: relative;
    margin: 0 calc(50% - 50vw);
    width: 100vw;
    .title{
      font-size: 38px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba( 255, 255, 255, 0.55 );
      width: 100vw;
      text-align: center;
      padding: 10px 0;
      color: $color-red2;
      @media #{$phone} {
        font-size: 18px;
        padding: 5px 0;
      }
    }
  }
  .box-menu {
    @media #{$phone} {
      margin-top: 36px;
    }
    .menu-wrap {
      .menu-title {
        padding: 10px 0;
        margin: 90px auto 50px;
        text-align: center;
        font-size: clamp(18px, 32vw,28px);
        font-weight: bold;
        border-top: solid 2px $color-red2;
        border-bottom: solid 2px $color-red2;
      }
      .menu-content {
        .content-detail {
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
            margin-top: 10px;
            color: $color-red2;
            @media #{$phone} {
              margin-top: 12px;
              font-size: 12px;
            }
          }
          .name-content {
            margin-top: 26px;
            @media #{$phone} {
              flex-direction: column;
              margin-top: 20px;
            }
            .name {
              font-size: 20px;
              margin-right: 20px;
              @media #{$phone} {
                font-size: .95rem;
              }
            }
            .category {
              color: #fff;
              font-size: 14px;
              padding: 5px 10px;
              width: fit-content;
              padding: 5px 10px;
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
  }
  .swiper-button-next::after, .swiper-button-prev::after {
    content: none !important;
  }
  .swiper-pagination{
    display: none;
  }
}

</style>