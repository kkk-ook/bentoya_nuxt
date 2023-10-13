<template>
  <div ref="scrollElem">
    <ErrorFlash :errorMessages="errorMessages"></ErrorFlash>
    <div class="row_table">

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          顧客コード<span>必須</span>
          </div>
        <div class="detail">
          <div class="input">
            <input type="number" placeholder="0001" v-model="client.code">
          </div>
          <div class="errorBox" v-show="!idCheck(client.code)">4桁の半角数字を入力してください</div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          顧客略式名
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="顧客略式名" v-model="client.name">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          顧客名<span>必須</span>
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="顧客名" v-model="client.company_name">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center tel">
        <div class="heading flex _a-center _j-between">
          電話番号
          <span>必須</span>
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="09012345678" v-model="client.tel">
          </div>
          <div class="errorBox" v-show="!numCheck(client.tel)">半角数字で入力してください</div>
          <p class="note">※ハイフン不要・半角数字で入力してください</p>
        </div>
      </div>

      <div class="row flex _a-center _j-center post">
        <div class="heading flex _a-center _j-between">
          郵便番号
          <span>必須</span>
        </div>
        <div class="detail">
          <ErrorFlash
            :errorMessages="addressErrorMessages" class="addressErrorMessage"></ErrorFlash>
          <div class="top flex _a-center">
            <input type="text" placeholder="12345678" v-model="client.postal_code">
            <div class="btn" v-show="!addressLoad">
              <button @click="findAddress">住所自動入力</button>
            </div>
            <div class="loader-brown" v-show="addressLoad"></div>
          </div>
          <div class="errorBox2 errorBox" v-show="!numCheck(client.postal_code)">半角数字で入力してください</div>
          <p class="note">※ハイフン不要・半角数字で入力してください</p>
        </div>
      </div>

      <div class="row flex _a-center _j-center prefecture">
        <div class="heading flex _a-center _j-between">
          都道府県
          <span>必須</span>
        </div>
        <div class="detail">
          <div class="select select-triangle">
            <select name="" id="" class="select-parts" v-model="client.prefecture">
              <option
                :value="prefecture.id"
                :key="prefecture.id"
                v-for="prefecture in $constants.PREFECTURES"> {{prefecture.name}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row flex _a-center _j-center town">
        <div class="heading flex _a-center _j-between">
          市区町村<br class="tablet_only">・番地
          <span>必須</span>
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="〇〇市〇〇区〇〇町 0-0" v-model="client.address1">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center building">
        <div class="heading flex _a-center _j-between">
          ビル・マンション名
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" v-model="client.address2">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center place">
        <div class="heading flex _a-center _j-between">
          納品場所
          <span>必須</span>
        </div>
        <div class="detail flex _a-center _j-between">
          <div class="inner">
            <div class="input_area" v-for="(delivery_locations, index) in client.delivery_locations_attributes" :key="index">
              <div class="input">
                <input type="text" placeholder="〇〇事業部" v-model="client.delivery_locations_attributes[index].name">
              </div>
                <fa
                :icon="faCircleMinus"
                class="minus fa-2x"
                @click="deleteDelivery(index, delivery_locations)"
                v-if="index > 0"
                />
            </div>
          </div>
          <div class="btn" @click="addDeliveryLocations">
            <button><img src="/admin/plus_button.svg" alt="button"></button>
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center price">
        <div class="heading flex _a-center _j-between">
          価格設定
          <span>必須</span>
        </div>
        <div class="detail">
          <div class="inner" v-for="(product_settings, index) in client.client_product_settings" :key="index" v-show="product_settings.product_settings">
            <p class="txt" v-if="display_price[index] != null">{{ product_settings.name }}（値引き前価格：{{ display_price[index] + "円"}}）</p>
            <p class="txt" v-else>{{ product_settings.name }}（値引き前価格：未設定）</p>
            <div class="input">
              <input type="number" placeholder="1000" v-model="client.client_product_settings[index].price">
            </div>
            <div class="radios flex _a-cetner">
              <div class="radio">
                <input
                  type="radio"
                  name=""
                  id="index"
                  :value="true"
                  v-model="product_settings.is_public"
                  class="radio-input"
                />
                <label for="public" class="radio-txt">公開</label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  name=""
                  id="private"
                  :value="false"
                  v-model="product_settings.is_public"
                  class="radio-input"
                />
                <label for="private" class="radio-txt">非公開</label>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="detail" v-if="!edit">
          <div class="inner" v-for="(product_settings, index) in client.client_product_settings" :key="index">
            <p class="txt" v-if="display_price[index] != null">{{ product_settings.name }}（値引き前価格：{{ display_price[index] + "円"}}）</p>
            <p class="txt" v-else>{{ product_settings.name }}（値引き前価格：未設定）</p>
            <div class="input">
              <input type="number" placeholder="1000" v-model="client.client_product_settings[index].price">
            </div>
            <div class="radios flex _a-cetner">
              <div class="radio">
                <input
                  type="radio"
                  name=""
                  id="index"
                  :value="true"
                  v-model="product_settings.is_public"
                  class="radio-input"
                />
                <label for="public" class="radio-txt">公開</label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  name=""
                  id="private"
                  :value="false"
                  v-model="product_settings.is_public"
                  class="radio-input"
                />
                <label for="private" class="radio-txt">非公開</label>
              </div>
            </div>
          </div>
        </div> -->
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">メモ</div>
        <div class="detail">
          <div class="textarea">
            <textarea placeholder="メモ" v-model="client.memo"></textarea>
          </div>
        </div>
      </div>
      
      <div
        class="clientBtn btn-parts2 _red font-minchoB"
        @click="registerClient(client.name)"
        v-if="!btnLoad"
        v-show="!edit"
        >
        <button>登録</button>
      </div>

      <div
        class="clientBtn btn-parts2 _red font-minchoB"
        @click="editClient(client.name)"
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
export default {
  props: {
    edit: Boolean,
  },
  data() {
    return {
      errorMessages: [],
      addressErrorMessages: [],
      load: false,
      btnLoad: false,
      products: [],
      editChangePlace: [],
      display_price: [],
      addressLoad: false,
      client: {
        code: "",
        name: "",
        company_name: "",
        postal_code: "",
        prefecture: "",
        address1: "",
        address2: "",
        tel: "",
        staff_1: "",
        staff_2: "",
        staff_3: "",
        memo: "",
        delivery_locations_attributes:[
          {
            name: ""
          }
        ],
        client_product_settings_attributes:[],
        client_product_settings: [],
      },
    };
  },
  async mounted() {
    this.products = await this.$adminApi.getProducts();
    for(let i = 0; i < this.products.length; i++){
      this.display_price.push(this.products[i].display_price);
    }

    // 編集画面
    if(this.edit){
      this.client = await this.$adminApi.getClient(this.$route.params.id);
      this.$set(this.client, "client_product_settings_attributes", []);
      this.$set(this.client, "delivery_locations_attributes", []);

      // 価格設定取ってくる
      for(let i = 0; i < this.client.client_product_settings.length; i++){
        let matchedProduct = this.products.find((p) => p.id == this.client.client_product_settings[i].product_id);
        if(matchedProduct != undefined){
          this.client.client_product_settings[i].name = matchedProduct.name;
          this.$set(this.client.client_product_settings[i], "product_settings", matchedProduct.is_public);
        }
      }

      // 納品場所取ってくる
      for(let i = 0; i < this.client.delivery_locations.length; i++){
        this.client.delivery_locations_attributes.push({
          'id': this.client.delivery_locations[i].id,
          'name': this.client.delivery_locations[i].name,
        });
        this.editChangePlace.push({
          'id': this.client.delivery_locations[i].id,
          'name': this.client.delivery_locations[i].name,
        });
      }
      delete this.client.delivery_locations;
    }
    // 登録画面
    else{
      for(let i = 0; i < this.products.length; i++){
        this.client.client_product_settings.push({
          product_id: this.products[i].id,
          name: this.products[i].name,
          price: null,
          is_public: this.products[i].is_public,
        })
        if(this.products[i].common_selling_price != null){
          this.client.client_product_settings[i].price = this.products[i].common_selling_price;
        }
        else{
          this.client.client_product_settings[i].price = null;
        }
      }

      // 価格設定取ってくる
      for(let i = 0; i < this.client.client_product_settings.length; i++){
        let matchedProduct = this.products.find((p) => p.id == this.client.client_product_settings[i].product_id);
        if(matchedProduct != undefined){
          this.client.client_product_settings[i].product_settings = matchedProduct.is_public;
        }
      }
    }
  },
  methods: {
    async findAddress() {
      this.addressLoad = true;
      this.prefecture = await this.$inputAddress(this.client, this.addressErrorMessages)
      this.addressLoad = false;
    },

    addDeliveryLocations() {
      this.client.delivery_locations_attributes.push({
        name: "",
      })
    },

    deleteDelivery(index, delivery_locations){
      if(this.edit){
        if(delivery_locations.id != undefined){
          this.editChangePlace.push({
          'id': delivery_locations.id,
          'name': delivery_locations.name,
          'is_discard': true,
          });
        }
        this.editChangePlace.splice(index, 1);
      }
      this.client.delivery_locations_attributes.splice(index, 1);
    },

    //編集画面のとき納品場所削除、新規登録あれば追加する
    editChangePlaceCheck(){
      if(this.edit){
        for(let i = 0; i < this.editChangePlace.length; i++){
          let changeItem = this.client.delivery_locations_attributes.find((p) => p.id == this.editChangePlace[i].id);
          if(changeItem == undefined){
            this.client.delivery_locations_attributes.push(this.editChangePlace[i]);
          }
        }
      }
    },

    // reinsertSettings(){
    //   for(let i = 0; i < this.client.client_product_settings.length; i++){
    //     this.client.client_product_settings_attributes.push({
    //       'product_id': this.client.client_product_settings[i].product_id,
    //       'price': this.client.client_product_settings[i].price,
    //       'is_public': this.client.client_product_settings[i].is_public,
    //     });

    //     if(this.client.client_product_settings[i].id != undefined){
    //       this.client.client_product_settings_attributes[i].id = this.client.client_product_settings[i].id;
    //     }

    //     if(this.client.client_product_settings_attributes[i].price == null){
    //       this.client.client_product_settings_attributes[i].price = "";
    //     }
    //   }
    //   delete this.client.client_product_settings;
    // },

    reinsertSettings(client){
      for(let i = 0; i < client.client_product_settings.length; i++){
        client.client_product_settings_attributes.push({
          'product_id': client.client_product_settings[i].product_id,
          'price': client.client_product_settings[i].price,
          'is_public': client.client_product_settings[i].is_public,
        });

        if(client.client_product_settings[i].id != undefined){
          client.client_product_settings_attributes[i].id = client.client_product_settings[i].id;
        }

        if(client.client_product_settings_attributes[i].price == null){
          client.client_product_settings_attributes[i].price = "";
        }
      }
      delete client.client_product_settings;

      return client;
    },

    // validationCheck() {
    //   if (
    //     !this.client.code ||
    //     !this.client.name ||
    //     !this.client.company_name ||
    //     !this.client.tel ||
    //     !this.client.postal_code ||
    //     !this.client.prefecture ||
    //     !this.client.address1 ||
    //     this.client.delivery_locations_attributes.length == 0
    //   ) {
    //     this.errorMessages.push("入力されていない必須項目があります");
    //     this.$util.scrollToTop();
    //     return false;
    //   }
    //   else if(!(/^0\d{9,10}$/).test(this.client.tel)) {
    //     this.errorMessages.push("正しい電話番号を入力してください");
    //     this.$util.scrollToTop();
    //   }
    //   else if(!(/^[0-9]{7}$/).test(this.client.postal_code)){
    //     this.errorMessages.push("正しい郵便番号を入力してください");
    //     this.$util.scrollToTop();
    //   }
    //   else{
    //     for(let i = 0; i < this.client.delivery_locations_attributes.length; i++){
    //       if(this.client.delivery_locations_attributes[i].name == ""){
    //         this.client.delivery_locations_attributes.splice(i,1);
    //       }
    //     }
    //     return true;
    //   }
    // },
    validationCheck(client) {
      if (
        !client.code ||
        !client.company_name ||
        !client.tel ||
        !client.postal_code ||
        !client.prefecture ||
        !client.address1 ||
        client.delivery_locations_attributes.length == 0
      ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
        return false;
      }
      else if(!(/^0\d{9,10}$/).test(client.tel)) {
        this.errorMessages.push("正しい電話番号を入力してください");
        this.$util.scrollToTop();
      }
      else if(!(/^[0-9]{7}$/).test(client.postal_code)){
        this.errorMessages.push("正しい郵便番号を入力してください");
        this.$util.scrollToTop();
      }
      else{
        for(let i = 0; i < client.delivery_locations_attributes.length; i++){
          if(client.delivery_locations_attributes[i].name == ""){
            client.delivery_locations_attributes.splice(i,1);
          }
        }
        return true;
      }
    },

    async registerClient(name) {
      this.btnLoad = true;
      this.errorMessages = [];
      let client = this.client;
      client = this.reinsertSettings(client);
      if (this.validationCheck(client)) {
        this.errorMessages = await this.$adminApi.postClient(client);
        if (!this.errorMessages.length) {
          this.$router.push("/admin/client");
          this.$showSuccessMessage(`${name}の顧客情報を登録しました`);
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.btnLoad = false;
    },

    async editClient(name) {
      this.btnLoad = true;
      this.errorMessages = [];
      let client = this.client;
      client = this.reinsertSettings(client);
      // this.reinsertSettings(client);
      if (this.validationCheck(client)) {
        this.errorMessage = await this.$adminApi.putClient(
          this.$route.params.id,
          client
        );
        if (!this.errorMessage.length) {
          this.$router.push("/admin/client");
          this.$showSuccessMessage(`${name}の顧客情報を更新しました`);
        }
        else{

          this.$util.scrollToTop();
        }
      };
      this.btnLoad = false;
    },

  },
  computed: {
    numCheck() {
      return function(data) {
        if(data) {
          return (/^[0-9]*$/).test(data)
        } else {
          return true
        }
      }
    },
    idCheck(){
      return function(data) {
        if(data) {
          return (/^[0-9]{4}$/).test(data)
        } else {
          return true
        }
      }
    },
    faCircleMinus() {
      return faCircleMinus;
    },
  }
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
        .input {
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
        select {
          padding: 10px;
          border: 1px solid $color-gray2;
          width: 100%;
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
        > .top {
          > input{
            border: 1px solid $color-gray2;
            padding: 10px;
            border-radius: 3px;
            &::placeholder{
              color: $color-gray;
            }
          }
          > .btn {
            color: white;
            background-color: $color-red;
            font-size: 12px;
            margin-left: 20px;
            border-radius: 3px;
            text-align: center;
            transition: 0.5s;
            > button {
              padding: 8px 10px;
              font-size: 13px;
            }
            &:hover {
              filter: brightness(50%);
            }
          }
          > .loader {
            margin: 0 0 0 40px;
          }
        }
        > .limited{
          > .tilde{
            margin: 10px;
          }
        }
        > .note {
          font-size: 10px;
          line-height: 16px;
          color: $color-red;
        }
        > .errorBox2 {
          margin-left: 0;
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
    > .place, .price{
      > .detail{
        > .inner{
          width: 90%;
          > .input{
            border: 1px solid $color-gray2;
            margin: 0;
            padding: 10px;
            border-radius: 3px;
            &:not(:first-child) {
              margin-top: 15px;
            }
            ::placeholder{
              color: $color-gray;
            }
          }
          > .radios{
            margin: 10px;
            > .radio{
              margin-right: 10px;
            }
          }
        }
      }
    }
    > .place{
      > .detail{
        > .inner{
          width: 85%;
          > .input_area{
            position: relative;
            &:not(:first-child) {
              margin-top: 15px;
            }
            .minus {
              position: absolute;
              font-size: 30px;
              right: -60px;
              top: 0;
              color: $color-red;
              cursor: pointer;
              transition: 0.7s;
              &:hover {
                filter: brightness(50%);
              }
            }
          }
        }
      }
    }
    > .price{
      > .detail{
        > .inner{
          width: 100%;
          &:not(:first-child) {
            margin-top: 15px;
          }
        }
      }
    }
  }
  > .clientBtn {
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
