<template>
  <div ref="scrollElem">
    <ErrorFlash :errorMessages="errorMessages"></ErrorFlash>
    <div class="row_table">
      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          公開<span>必須</span>
        </div>
        <div class="detail">
          <div class="radios flex _a-cetner _j-between">
            <div class="radio">
              <input
                type="radio"
                name="public"
                id="public"
                :value="true"
                v-model="product.is_public"
                class="radio-input"
              />
              <label for="public" class="radio-txt">公開</label>
            </div>
            <div class="radio">
              <input
                type="radio"
                name="public"
                id="private"
                :value="false"
                v-model="product.is_public"
                class="radio-input"
              />
              <label for="private" class="radio-txt">非公開</label>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          当日予約<span>必須</span>
        </div>
        <div class="detail">
          <div class="radios flex _a-cetner _j-between">
            <div class="radio">
              <input
                type="radio"
                name="possible"
                id="possible"
                :value="true"
                v-model="product.is_same_day_reservation"
                class="radio-input"
              />
              <label for="possible" class="radio-txt">可</label>
            </div>
            <div class="radio">
              <input
                type="radio"
                name="impossible"
                id="impossible"
                :value="false"
                v-model="product.is_same_day_reservation"
                class="radio-input"
              />
              <label for="impossible" class="radio-txt">不可</label>
            </div>
          </div>
        </div>
      </div> -->

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          期間限定
        </div>
        <div class="detail">
          <div class="limited flex _a-center inner">
            <date-picker
              v-model="product.period_start_on"
              type="date"
              format="YYYY/MM/DD">
            </date-picker>
            <span class="tilde">〜</span>
            <date-picker
              v-model="product.period_end_on"
              type="date"
              format="YYYY/MM/DD">
            </date-picker>
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          商品名<span>必須</span>
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="商品名" v-model="product.name">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          商品名略式名<span>必須</span>
        </div>
        <div class="detail omit">
          <div class="input">
            <input type="text" placeholder="略式名" v-model="product.abbreviated_name">
          </div>
          <p class="note">3文字以内の略式名称を登録してください</p>
          <div class="errorBox" v-if="product.abbreviated_name.length > 3">3文字以内で入力してください</div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">キャッチコピー</div>
        <div class="detail">
          <div class="textarea _catch">
            <textarea name="catch_copy" id="catch_copy" placeholder="キャッチコピー" v-model="product.catch_phrase"></textarea>
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          商品カテゴリ<span>必須</span>
        </div>
        <div class="detail">
          <div class="row_s">
            <div class="selects flex _a-center _j-start">
              <div class="select select-triangle">
                <select v-model="selectCategoryName" class="select-parts">
                  <option :value="null" disabled>カテゴリーを選択</option>
                  <option v-for="category in categories" :key="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          商品詳細画像<span>必須</span>
        </div>
        <div class="detail">
          <div class="flex _a-center">
            <div class="img_block flex _a-center">
              <div
                class="img_cell"
                v-for="(image, index) in image_url"
                :key="index">
                <div class="img" @click="selectFile($event)">
                  <label class="surface flex _a-center _j-center">
                  </label>
                  <img :src="image.url" alt="" />
                </div>
                <fa
                  :icon="faCircleXmark"
                  class="icon"
                  @click="deleteImg(index)"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  class="file"
                  @change="updateImg($event, index)"
                />
              </div>
            </div>
            <div class="img_block flex _a-center">
              <div class="img_cell">
                <!-- 新規追加用 -->
                <div class="img" @click="selectFile($event)">
                  <div class="img_btn" :class="{ no_border: load }">
                    <label for="file" v-show="!load">
                      <fa :icon="faCamera" class="icon" />
                      <p>画像を追加</p>
                    </label>
                    <div class="loader" v-show="load"></div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  class="file"
                  multiple
                  @change="selectImg($event)"/>
              </div>
            </div>
          </div>
          <p class="note">・対応ファイルはjpg/png/gifです。</p>
          <p class="note">・推奨サイズは1200px×1200pxです。</p>
          <p class="note">・1枚あたり1MB以内を目安に画像を用意してください。</p>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          標準価格(税込)<span>必須</span>
        </div>
        <div class="detail flex _a-end">
          <div class="input price_input">
            <input type="text" placeholder="1000" v-model="product.common_selling_price" />
          </div>
          <p class="price_p">円</p>
          <div class="errorBox2" v-show="!numCheck(product.common_selling_price)">
            半角数字で入力してください
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          値引き前価格(税込)
        </div>
        <div class="detail flex _a-end">
          <div class="input price_input">
            <input type="text" placeholder="1000" v-model="product.display_price" />
          </div>
          <p class="price_p">円</p>
        </div>
        <div class="errorBox2" v-show="!numCheck(product.standard_price)">
          半角数字で入力してください
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">商品説明</div>
        <div class="detail">
          <div class="textarea _catch">
            <textarea name="description" id="description" placeholder="商品説明" v-model="product.description"></textarea>
          </div>
        </div>
      </div>

      <div
        class="productBtn btn-parts2 _red font-minchoB"
        @click="registerProduct(product.name)"
        v-if="!btnLoad"
        v-show="!edit"
        >
        <button>登録</button>
      </div>

      <div
        class="productBtn btn-parts2 _red font-minchoB"
        @click="editProduct(product.name)"
        v-if="!btnLoad"
        v-show="edit"
      >
        <button>更新</button>
      </div>
      <div class="loader" v-else></div>
    </div>

  </div>
</template>

<script>
import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
export default {
  props: {
    edit: Boolean,
  },
  data() {
    return {
      products: {},
      errorMessages: [],
      flag: false,
      test: false,
      load: false,
      btnLoad: false,
      selectCategoryName: null,
      categories: [],
      product: {
        category_id: null,
        name: "",
        abbreviated_name: "",
        catch_phrase: "",
        display_price: "",
        common_selling_price:"",
        is_public: true,
        // is_same_day_reservation: false,
        period_start_on: "",
        period_end_on: "",
        description: "",
      },
      productLength: null,
      product_images: [],
      image_url: [],
      // editNewImgs: [],
      product_id: null,
    };
  },
  async mounted() {
    this.categories = await this.$adminApi.getCategories();

    if (this.edit) {
      this.$set(this.product, "product_images", []);
      this.product = await this.$adminApi.getProductEdit(this.$route.params.id);
      this.product_images = this.product.product_images;
      this.product_id = this.product.id;

      if(this.product.period_start_on != undefined){
        this.product.period_start_on = new Date(this.product.period_start_on);
      }
      if(this.product.period_end_on != undefined){
        this.product.period_end_on = new Date(this.product.period_end_on);
      }

      // 今登録されている画像取ってくる
      for (let i = 0; i < this.product.product_images.length; i++) {
        this.image_url.push(this.product.product_images[i].image);
      }
      // 今選択されているカテゴリ取ってくる
      if(this.product.category_id){
        let selectCategory = this.categories.find((p) => p.id == this.product.category_id);
        if(selectCategory != undefined){
          this.selectCategoryName = selectCategory.name;
        }
      }
    }

    this.flag = true;
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
    validationCheck() {
      if (
        !this.product.category_id ||
        !this.product.name ||
        !this.product.abbreviated_name ||
        !this.product.common_selling_price ||
        this.product_images.length == 0
      ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
        return false;
      }
      else if(this.product.abbreviated_name.length > 3){
        this.errorMessages.push("商品名略式名は3文字以内で入力してください。");
        this.$util.scrollToTop();
        return false;
      }
      else{
        return true;
      }
    },
    //商品登録
    async registerProduct(name) {
      this.btnLoad = true;
      this.errorMessages = [];
      this.products = {};

      if(this.product.period_start_on != undefined){
        this.product.period_start_on = this.formatDate(this.product.period_start_on);
      }
      if(this.product.period_end_on != undefined){
        this.product.period_end_on = this.formatDate(this.product.period_end_on);
      }

      if (this.validationCheck()) {
        this.products = await this.$adminApi.postProduct(this.product);
        this.errorMessages = this.products.errorMessages;
        const productImgId = this.products.product_id;
        for (let i = 0; i < this.product_images.length; i++) {
          await this.$adminApi.postProductImg(productImgId, this.product_images[i].image);
        }
        if (!this.errorMessages.length) {
          this.$router.push("/admin/product");
          this.$showSuccessMessage(`${name}の商品情報を登録しました`);
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.btnLoad = false;
    },
    //商品編集
    async editProduct(name) {
      this.btnLoad = true;
      this.errorMessages = [];
      if(this.product.period_start_on != undefined){
        this.product.period_start_on = this.formatDate(this.product.period_start_on);
      }
      if(this.product.period_end_on != undefined){
        this.product.period_end_on = this.formatDate(this.product.period_end_on);
      }

      if (this.validationCheck()) {
          this.errorMessages = await this.$adminApi.putProduct(
          this.product_id,
          this.product,
        );
        for(let product_image of this.product_images){
          if(product_image.id){
            if(product_image.is_discard){
              this.errorMessages = await this.$adminApi.deleteProductImg(product_image.id)
            } else if(product_image.is_edit){
              this.errorMessages = await this.$adminApi.putProductImg(product_image.id, product_image.image)
            }
          } else {
            this.errorMessages = await this.$adminApi.postProductImg(this.product_id, product_image.image)
          }
        }

        if (!this.errorMessages.length) {
          this.$router.push("/admin/product");
          this.$showSuccessMessage(`${name}の商品情報を更新しました`);
        }
        else{
          this.$util.scrollToTop();
        }
      };
      this.btnLoad = false;
    },

    // 画像選択
    selectFile(e){
      const inputFile = e.target
        .closest(".img_cell")
        .querySelector("input[type='file']");
      inputFile.click();
    },

    // 画像新規登録
    async selectImg(e) {
      this.load = true;
      if(e.target.files[0]){
        if(this.product_id){
          this.product.product_images.push({
            'product_id': this.product_id,
            'image': e.target.files[0],
          });
        }
        else{
          this.product_images.push({
            'image': e.target.files[0],
          });
        }
        this.image_url.push({
          'url': URL.createObjectURL(e.target.files[0]),
        });
      }
      this.load = false;
    },

    // 画像削除
    deleteImg(index) {
      if(this.edit){
        if(this.product.product_images[index].id){
          this.product.product_images.push({
            'id': this.product.product_images[index].id,
            'is_discard': true,
          });
          this.product.product_images.splice(index, 1);
        }
        else{
          this.product.product_images.splice(index,1);
        }
        this.image_url.splice(index, 1);
      }
      else{
        this.product_images.splice(index,1);
        this.image_url.splice(index, 1);
      }
    },

    // 画像１枚編集
    async updateImg(e, index) {
      this.load = true;
      if(this.product.product_images[index].image){
          this.product.product_images[index].is_edit = true;
          this.product.product_images[index].image = e.target.files[0];
          this.image_url[index].url = URL.createObjectURL(e.target.files[0]);
      }
      this.load = false;
    },
    closeMenu(){
      
    }
  },
  computed: {
    numCheck() {
      return function (data) {
        if (data) {
          return /^[0-9]*$/.test(data);
        } else {
          return true;
        }
      };
    },
    omitCheck() {
      return function (data) {
        if (data) {
          return (/.{,3}$/).test(data);
        } else {
          return true;
        }
      };
    },
    faCircleMinus() {
      return faCircleMinus;
    },
    faCircleXmark() {
      return faCircleXmark;
    },
    faCamera() {
      return faCamera;
    },
  },
  watch: {
    "selectCategoryName": function(newVal){
      let selectCategory = this.categories.find((p) => p.name == newVal);
      this.product.category_id = selectCategory.id;
    },
    deep: false,
    immediate: true
  },
};
</script>

<style lang="scss" scoped>
div {
> .row_table {
    width: 80%;
    margin: 50px auto 200px;
    > .row {
      margin-top: 10px;
      align-items: stretch;
      > .heading {
        color: $color-txt2;
        width: 26%;
        background-color: $color-gray;
        border-radius: 3px;
        padding: 20px;
        font-size: 13px;
        font-weight: bold;
        > span {
          background-color: $color-red;
          color: white;
          padding: 4px 13px;
          border-radius: 20px;
          font-size: 12px;
          letter-spacing: 1px;
        }
      }
      > .detail {
        width: 72%;
        padding: 20px 0 20px 20px;
        position: relative;
        font-size: 12px;
        // 共通
        > .input {
          border: 1px solid $color-gray2;
          width: 100%;
          margin: 0;
          padding: 10px;
          border-radius: 3px;
          &:not(:first-child) {
            margin-left: 14px;
          }
          ::placeholder{
            color: $color-gray;
          }
        }
        > .limited{
          > .tilde{
            margin: 10px;
          }
        }
        .img_block {
          flex-wrap: wrap;
          > .img_cell {
            width: 120px;
            margin-bottom: 20px;
            margin-right: 20px;
            aspect-ratio: 1;
            position: relative;
            > input {
              display: none;
            }
            > .img {
              width: 100%;
              height: 100%;
              > .img_btn {
                position: relative;
                width: 120px;
                aspect-ratio: 1;
                margin-bottom: 20px;
                cursor: pointer;
                border-radius: 5px;
                border: 1px solid $color-gray2;
                &.no_border {
                  border: 0px !important;
                }
                > label {
                  display: flex;
                  align-items: center;
                  height: 100%;
                  flex-direction: column;
                  justify-content: center;
                  color: $color-txt2;

                  > .icon {
                    font-size: 30px;
                  }
                  > p {
                    font-size: 10px;
                    padding-top: 10px;
                    color: $color-txt2;
                  }
                }
              }
              > img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 5px;
              }
              > input {
                display: none;
              }
              &:hover {
                .surface {
                  opacity: 1;
                }
              }
            }
            > .icon {
              position: absolute;
              top: -8px;
              right: -8px;
              font-size: 22px;
              color: $color-red;
              cursor: pointer;
              background-color: white;
              border-radius: 25px;
              z-index: 2;
              &:hover {
                filter: brightness(50%);
              }
            }
          }
          > .img_btn {
            position: relative;
            width: 120px;
            aspect-ratio: 1;
            margin-bottom: 20px;
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid $color-gray2;
            &.no_border {
              border: 0px !important;
            }
            > label {
              display: flex;
              align-items: center;
              height: 100%;
              flex-direction: column;
              justify-content: center;

              > .icon {
                font-size: 30px;
              }
              > p {
                font-size: 13px;
                padding-top: 10px;
              }
            }
            > .loader {
              position: absolute;
              top: 45%;
              left: 45%;
            }
          }
          > input {
            display: none;
          }
        }
        > .option_note {
          margin-bottom: 30px;
        }
        > .radios {
          width: 40%;
          > .radio {
            width: 50%;
          }
        }
        > .row_s {
          > .selects {
            > .select {
              width: 30%;
              border: 1px solid $color-gray2;
              &.isSelected {
                color: $color-gray;
                border-width: 1.5px;
                border: 1px solid $color-gray2;
              }
              > select {
                width: 100%;
                padding: 10px;
              }
              &:not(:first-child) {
                margin-left: 15px;
              }
            }
            > .btn{
              margin-left: 10px;
            }
            > .minus {
              transition: 0.5s;
              font-size: 25px;
              color: $color-red;
              margin-left: 15px;
              &:hover {
                filter: brightness(50%);
              }
            }
          }
          &:not(:first-child) {
            margin-top: 14px;
          }
        }
        > .row_s2 {
          border: 1px solid $color-gray2;
          border-radius: 5px;
          padding: 15px 10px;
          width: 93%;
          position: relative;
          &:not(:first-child) {
            margin-top: 10px;
          }
          .heading {
            width: 11%;
            text-align: right;
            font-size: 14px;
          }
          .detail {
            width: 90%;
            padding-left: 10px;
            > .input {
              input {
                border: 1px solid $color-gray2;
                padding: 10px;
                border-radius: 5px;
                width: 80%;
              }
            }
          }
          > .bottom {
            margin-top: 10px;
            > .detail {
              > .img {
                width: 90px;
                height: 90px;
                position: relative;
                > img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 5px;
                }

                &:hover {
                  .surface {
                    opacity: 1;
                  }
                }
              }
              > .img_btn {
                width: 90px;
                border: 1px solid $color-gray2;
                border-radius: 5px;
                padding: 22px 10px;
                > .icon {
                  font-size: 20px;
                }
                > p {
                  font-size: 12px;
                  padding-top: 4px;
                }
              }
              > .loader {
                z-index: 2;
                font-size: 10px;
                margin: 30px 0 30px 40px;
                top: 37%;
                left: 14%;
              }
              > input {
                display: none;
              }
            }
          }
          .bottom {
            &._first {
              > .detail{
                height: 90px;
              }
            }
          }
          > .minus {
            position: absolute;
            font-size: 40px;
            right: -60px;
            top: 55px;
            color: $color-red;
            cursor: pointer;
            transition: 0.7s;
            &:hover {
              filter: brightness(50%);
            }
          }
        }

        // 個別
        > .price_input {
          width: 40%;
        }
        > .price_p , .short_p {
          padding-left: 10px;
        }
        > .textarea {
          width: 100%;
          border: 1px solid $color-gray2;
          border-radius: 5px;
          height: 120px;
          > textarea {
            height: 120px;
            padding: 10px;
          }
          ::placeholder{
              color: $color-gray;
            }
        }
        > .product_textarea {
          height: 200px;
        }
        > .txtCount {
          padding-top: 10px;
          font-size: 13px;
          > p {
            padding-right: 6px;
          }
        }
      }
      > .omit{
        > .input{
          width: 30%;
          display: inline-block;
        }
        > .note{
          display: inline-block;
          margin-left: 5px;
        }
      }
    }
  }
  > .productBtn {
    border-radius: 5px;
    width: 140px;
    margin:100px auto 10px;
    padding: 9px 0;
    height: 40px;
    button {
      letter-spacing: 8px;
      font-size: 14px;
    }
  }
  > .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
