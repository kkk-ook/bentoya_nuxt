<template>
  <div class="product adminContent">
    <AdminTitle :title="'商品一覧'" :create_link="'/admin/product/create'" :create_btn_active="true"></AdminTitle>
    <ErrorFlash :errorMessages="errorMessages"></ErrorFlash>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="searchBox">
      <div class="box btn-shadow">
        <div class="flex _a-center">
          <div class="product">
            <label for="product">商品名</label>
            <div class="input">
            <input type="text" placeholder="商品名" id="product" v-model="search.name">
            </div>
          </div>
          <div class="price">
            <label for="price">標準価格</label>
            <div class="input-area flex _a-center">
              <div class="input">
                <input type="number" placeholder="0" id="price" v-model="search.low_price">
              </div>
              <p class="yen">円</p>
              <span class="tilde">〜</span>
              <div class="input">
                <input type="number" placeholder="0" id="price" v-model="search.high_price">
              </div>
              <p class="yen">円</p>
            </div>
          </div>
          <div class="category">
            <label for="category">カテゴリ</label>
            <div class="select select-triangle">
              <select class="select-parts" name="category" v-model="searchCategoryName">
                <option value="" disabled selected style="display:none;">カテゴリを選択</option>
                <option v-for="category in categories" :key="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="product"></div>
          <div class="shop">
            <label for="shopping-date">登録日</label>
            <div class="flex _a-center inner">
              <date-picker
                v-model="search.date_min"
                type="date"
                format="YYYY/MM/DD">
              </date-picker>
              <span class="tilde">〜</span>
              <date-picker
                v-model="search.date_max"
                type="date"
                format="YYYY/MM/DD">
              </date-picker>
            </div>
          </div>
          <div class="status">
            <label for="">公開</label>
            <div class="flex _a-center">
              <div class="radio">
                    <input
                        type="radio"
                        name=""
                        id="public"
                        class="radio-input"
                        v-model="search.is_public"
                        checked
                    />
                    <label for="public" class="radio-txt">全て</label>
                </div>
                <div class="radio">
                    <input
                        type="radio"
                        name=""
                        id="public"
                        :value="true"
                        class="radio-input"
                        v-model="search.is_public"
                    />
                    <label for="public" class="radio-txt">公開</label>
                </div>
                <div class="radio">
                    <input
                        type="radio"
                        name=""
                        id="private"
                        :value="false"
                        class="radio-input"
                        v-model="search.is_public"
                    />
                    <label for="private" class="radio-txt">非公開</label>
                </div>
            </div>
          </div>
        </div>

        <div class="searchBtn">
          <button class="circle-btn" @click="searchBtn()">上記条件で検索</button>
        </div>
      </div>
    </div>

    <p class="table_num" v-if="products.length">表示件数1-{{ products.length }}件表示</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>
    <div v-if="flag && products.length" ref="list" class="product_table">
      <div class="thead">
        <div class="tr">
          <div class="inner flex _a-center">
            <!-- <div class="th code">商品コード</div> -->
            <div class="th img"></div>
            <div class="th name">商品名</div>
            <div class="th category">カテゴリ</div>
            <div class="th price">標準価格</div>
            <div class="th publish">公開</div>
            <div class="th button"></div>
          </div>
        </div>
      </div>
      <div class="tbody">
        <draggable v-model="products">
          <div v-for="product in products" :key="product.id" class="tr">
            <div class="inner flex _a-center">
              <!-- <div class="code td">{{ product.id }}</div> -->
              <div class="img td" v-if="product.product_images.length">
                <img :src="product.product_images[0].image.url" alt="">
              </div>
              <div class="name item td">{{ product.name }}</div>
              <div class="category td">
                <div class="categories flex_column _j-between">
                  <p class="inner">{{ findCategoryName(product.category_id) }}</p>
                </div>
              </div>
              <div class="price td">
                <div class="content flex _a-center">
                  <p>{{ product.common_selling_price }}</p>
                  <span>円</span>
                </div>
              </div>
              <div class="publish td">
                <p v-if="product.is_public">公開</p>
                <p v-else>非公開</p>
              </div>
              <div class="buttons td">
                <div class="content">
                  <div class="inner flex _a-center">
                    <div class="button edit btn-parts2 _red">
                      <nuxt-link :to="`/admin/product/${product.id}`"><button>編集</button></nuxt-link>
                    </div>
                    <div class="button delete btn-parts2 _gray2">
                      <button @click="remove(product.id)">削除</button>
                    </div>
                  </div>
                </div>
                <div class="loader" v-show="product.deleteFlag"></div>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <!-- <table v-if="flag && products.length" ref="list" class="product_table">
      <thead>
        <tr>
          <th>商品コード</th>
          <th></th>
          <th>商品名</th>
          <th>カテゴリ</th>
          <th>標準価格</th>
          <th>公開</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" :draggable="true">
          <td class="code">{{ product.id }}</td>
          <td class="img" v-if="product.product_images.length">
            <img :src="product.product_images[0].image.url" alt="">
          </td>
          <td class="name item">{{ product.name }}</td>
          <td class="category">
            <div class="categories flex_column _j-between">
              <p class="inner">{{ findCategoryName(product.category_id) }}</p>
            </div>
          </td>
          <td class="price">
            <div class="content flex _a-center">
              <p>{{ product.common_selling_price }}</p>
              <span>円</span>
            </div>
          </td>
          <td class="publish">
            <p v-if="product.is_public">公開</p>
            <p v-else>非公開</p>
          </td>
          <td class="buttons">
            <div class="content flex _a-center">
              <div class="button edit btn-parts2 _red">
                <nuxt-link :to="`/admin/product/${product.id}`"><button>編集</button></nuxt-link>
              </div>
              <div class="button delete btn-parts2 _gray2">
                <button @click="remove(product.id)">削除</button>
              </div>
            </div>
            <div class="loader" v-show="product.deleteFlag"></div>
          </td>
        </tr>
      </tbody>
    </table> -->
    <div class="empty" v-else>
      商品が登録されていません。
    </div>
    <div class="button sortBtn btn-parts2 _red">
      <button @click="sortBtn()">並び替え</button>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      isShowCategory: false,
      products: [],
      categories: [],
      flag: false,
      search: {
        name: "",
        category_id: "",
        low_price: "",
        high_price: "",
        date_min: "",
        date_max: "",
        is_public: "",
      },
      searchCategoryName: "",
      selects: [],
      errorMessages: [],
      categories: [],
      searchBox: false,
      /* ページネーション */
      currentPage: 1,
      parPage: 10,
    }
  },
  async mounted() {
    this.flag = false;

    this.products = await this.$adminApi.getProducts();
    this.categories = await this.$adminApi.getCategories();

    this.search.date_min = this.formatDate(this.search.date_min);
    this.search.date_max = this.formatDate(this.search.date_max);

    this.flag = true;
  },
  methods:{
    clickCallback: function (pageNum) {
      this.currentPage = Number(pageNum);
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
    // 削除
    async remove(id){
      if (confirm("本当に削除してもよろしいですか？")) {
        const success = await this.$adminApi.deleteProduct(id);
        if (success) {
          this.products = await this.$adminApi.getProducts();
          this.$showSuccessMessage("商品を削除しました");
        }
      }
    },
    // 商品の順番並べ替え
    async sortBtn(){
      let productIds = [];
      for(let i = 0; i < this.products.length; i++){
        productIds.push(this.products[i].id);
      }
      this.errorMessages = await this.$adminApi.sortProducts(productIds);
      if(!this.errorMessages.length){
        this.$showSuccessMessage("商品の並べ替えに成功しました");
      }
      else{
        this.$util.scrollToTop();
      }
    },
    // 検索
    async searchBtn(){
      let searchUrl;
      if(this.search.name){
        searchUrl = `name=${this.search.name}`;
      }
      if(this.search.category_id){
        if(searchUrl != undefined){
          searchUrl += `&category_id=${this.search.category_id}`;
        }
        else{
          searchUrl = `category_id=${this.search.category_id}`;
        }
      }
      if(this.search.low_price){
        if(searchUrl != undefined){
          searchUrl += `&low_price=${this.search.low_price}`;
        }
        else{
          searchUrl = `low_price=${this.search.low_price}`;
        }
      }
      if(this.search.high_price){
        if(searchUrl != undefined){
          searchUrl += `&high_price=${this.search.high_price}`;
        }
        else{
          searchUrl = `high_price=${this.search.high_price}`;
        }
      }
      if(this.search.date_min){
        this.search.date_min = this.formatDate(this.search.date_min);
        if(searchUrl != undefined){
          searchUrl += `&created_at_1=${this.search.date_min}`;
        }
        else{
          searchUrl = `created_at_1=${this.search.date_min}`;
        }
      }
      if(this.search.date_max){
        this.search.date_max = this.formatDate(this.search.date_max);
        if(searchUrl != undefined){
          searchUrl += `&created_at_2=${this.search.date_max}`;
        }
        else{
          searchUrl = `created_at_2=${this.search.date_max}`;
        }
      }
      if(this.search.is_public || !this.search.is_public){
        if(searchUrl != undefined){
          searchUrl += `&is_public=${this.search.is_public}`;
        }
        else{
          searchUrl = `is_public=${this.search.is_public}`;
        }
      }
      if(searchUrl != undefined){
        let productsData = await this.$adminApi.searchProducts(searchUrl);
        this.products = productsData.products;

        if(productsData.created_at_1 != null){
          this.search.date_min = new Date(productsData.created_at_1);
        }
        if(productsData.created_at_2 != null){
          this.search.date_max = new Date(productsData.created_at_2);
        }
      }
      // 検索に何も入力されていなかったらページネーションごとにデータ取得
      else{
        this.products = await this.$adminApi.getProducts();
        this.search = {
          date_min: "",
          date_max: "",
          name: "",
          category_id: "",
          low_price: "",
          high_price: "",
          is_public: "",
        }
      }
    },
  },
  computed:{
    findCategoryName() {
      return function (id) {
        if (this.flag) {
          let category = this.categories.find((p) => p.id == id);
          if(category != undefined){
            return category.name;
          }
        }
      }
    },
    findCategoryId() {
      return function (id) {
        if (this.flag) {
          let category = this.categories.find((p) => p.id == id);
          if(category != undefined){
            return category.name;
          }
        }
      }
    },
  },
  watch: {
    'searchCategoryName':function(newVal){
      let searchId = this.categories.find((p) => p.name == newVal);
      this.search.category_id = searchId.id;
    },
    deep: false,
    immediate: false
  }
}
</script>
<style lang="scss" scoped>
.product{
  color: $color-txt;
  margin-bottom: 200px;
  .searchBox{
    // 検索
    border: 1px solid $color-gray2;
    border-radius: 3px;
    padding: 20px;
    margin: 30px 0;
    > .box {
      > .flex {
        flex-wrap: wrap;
        > .product{
          width: 48%;
          margin-right: 2%;
          margin-bottom: 15px;
          .input {
            margin-top: 10px;
            width: 95%;
            border: 1px solid $color-gray2;
            border-radius: 3px;
            padding: 5px;
            ::placeholder{
              color: $color-gray;
            }
          }
        }
        > .category{
          width: 48%;
          margin-right: 2%;
          margin-bottom: 15px;
          label{
            display: block;
          }
          > .select{
            width: 50%;
            margin-top: 10px;
          }
          select {
            // margin-top: 10px;
            width: 100%;
            border: 1px solid $color-gray2;
            border-radius: 3px;
            padding: 5px;
          }
          select:invalid { color: $color-gray; }
          select option { color: $color-txt; }
          select option:first-child { color: $color-gray; }
        }
        > .price {
          width: 48%;
          margin-bottom: 15px;
          > .input-area{
            .input {
              margin-top: 10px;
              width: 30%;
              border: 1px solid $color-gray2;
              border-radius: 3px;
              padding: 5px;
              ::placeholder{
                color: $color-gray;
              }
            }
            > .yen{
              margin-left: 3px;
              align-self: flex-end;
            }
            > .tilde{
              margin: 10px 10px 0;
              color: $color-gray2;
            }
          }
        }
        > .shop {
          width: 48%;
          margin-right: 2%;
          margin-bottom: 15px;
          > .inner {
            flex-wrap: nowrap;
            margin-top: 10px;
            .tilde{
              margin: 0 10px;
              color: $color-gray;
            }
          }
        }
        > .status {
          width: 48%;
          .radio {
            margin-top: 10px;
            margin-right: 10px;
          }
        }
      }
      > .searchBtn{
        margin-top: 50px;
        > .circle-btn{
          margin: 0 auto;
        }
      }
    }
  }

  >.table_num{
    font-size: 12px;
    display: inline-block;
  }

  > .product_table {
    margin-top: 10px;
    width: 100%;
    border:1px solid $color-gray;
    border-radius: 7px;
    .tr:last-child .th,
    .tr:last-child .td {
      border-bottom: none;
    }

    > .thead{
      background-color: $color-gray;
      > .tr {
        height: 60px;
        > .inner {
          width: 90%;
          margin: 0 auto;
        }
      }
    }

    > .tbody{
      .tr {
        > .inner {
          width: 90%;
          margin: 0 auto;
        }
      }
    }

    .th {
      font-size: 17px;
      font-family: "MinchoB";
      font-weight: 600;
      padding: 20px 6px 20px 10px;
      white-space: nowrap;
    }
    .td {
      font-size: 15px;
      padding: 20px 6px 20px 10px;
    }
    .tr {
      border-bottom: 1px solid $color-gray;
      position: relative;
      // height: 110px;
      &:last-child {
        border-bottom: none;
      }
    }

    // それぞれ幅指定
    // .code {
    //   width: 10%;
    // }
    .img {
      width: 10%;
      > img {
        width: 90%;
        aspect-ratio: 1;
        object-fit: cover;
      }
    }
    .name {
      width: 20%;
    }
    .category {
      width: 20%;
      > .categories {
        width: 90%;
        > p {
          height: 25px;
          background-color: $color-gray;
          padding: 4px 6px;
          &:not(:first-child) {
            margin-top: 8px;
          }
        }
        > .inner{
          background-color: $color-red;
          color: white;
          border-radius: 25px;
          text-align: center;
          white-space: nowrap;
        }
      }
    }
    .price {
      width: 20%;
    }
    .publish{
      width: 15%;
    }
    .buttons {
      width: 15%;
      white-space: nowrap;
      .content{
        width: 150px;
        margin: 0 auto;
        button {
          padding: 3px 15px;
          width: 100%;
          font-size: 15px;
          height: 25px;
        }
        > .loader {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  > .empty {
    margin: 80px 0 50px;
    text-align: center;
  }
  > .btn {
    margin-bottom: 80px;
  }

  > .sortBtn{
    margin-top: 100px;
    width: 250px;
    padding: 10px 0;
  }
}
</style>