<template>
  <div class="signup">
    <div class="logo">
      <img src="/fronts/front/header/logo.svg" alt="logo" />
    </div>
    <ErrorFlash
      :errorMessages="errorMessages"></ErrorFlash>
    <div v-if="!load && selectClient">
      <div class="header_inner">
      <p class="header_title">会員登録</p>
      </div>
      <div class="user_table">
        <div class="row flex _a-center _j-center">
          <div class="heading flex _a-center _j-between">
            氏名
            <span>必須</span>
          </div>
          <div class="detail flex _a-center name">
            <input type="text" placeholder="山田" v-model="user.last_name">
            <input type="text" placeholder="太郎" v-model="user.first_name">
          </div>
        </div>

        <div class="row flex _a-center _j-center kana">
          <div class="heading flex _a-center _j-between">
            カナ
            <span>必須</span>
          </div>
          <div class="detail flex _a-center name">
            <input type="text" placeholder="ヤマダ" v-model="user.last_name_kana">
            <input type="text" placeholder="タロウ" v-model="user.first_name_kana">
          </div>
        </div>

        <div class="row flex _a-center _j-center mail">
          <div class="heading flex _a-center _j-between">
            メールアドレス
            <span>必須</span>
          </div>
          <div class="detail">
            <input type="text" placeholder="メールアドレス" v-model="user.email">
          </div>
        </div>

        <div class="row flex _a-center _j-center pass">
          <div class="heading flex _a-center _j-between">
            パスワード
            <span>必須</span>
          </div>
          <div class="detail flex _a-center pass">
            <div class="input">
              <input :type="pass_type" placeholder="パスワード" v-model.lazy="user.password">
              <fa
                :icon="pass_eye"
                class="faEye"
                @click="passLookChange"
              />
            </div>
          </div>
        </div>

        <div class="row flex _a-center _j-center">
          <div class="heading flex _a-center _j-between">
            確認用パスワード
            <span>必須</span>
          </div>
          <div class="detail flex _a-center pass">
            <div class="input">
              <input :type="confirm_type" placeholder="確認用パスワード" v-model.lazy="password_confirmation">
              <fa
                :icon="confirm_eye"
                class="faEye"
                @click="confirmLookChange"
              />
            </div>
          </div>
        </div>

        <div class="row flex _a-center _j-center">
          <div class="heading flex _a-center _j-between">
            顧客名<span>必須</span>
          </div>
          <div class="detail">
            <div class="select_client">
              <p>{{ selectClient }}</p>
            </div>
          </div>
        </div>

        <div class="row flex _a-center _j-center">
          <div class="heading flex _a-center _j-between">
            納品場所<span>必須</span>
          </div>
          <div class="detail">
            <div class="select_location">
              <p>{{ selectLocation }}</p>
            </div>
          </div>
        </div>

        <div class="row flex _a-center _j-center tel">
          <div class="heading flex _a-center _j-between">
            電話番号
            <span>必須</span>
          </div>
          <div class="detail">
            <input type="text" placeholder="09012345678" v-model="user.tel">
            <div class="errorBox" v-show="!numCheck(user.tel)">半角数字で入力してください</div>
            <p class="note">※ハイフン不要・半角数字で入力してください</p>
          </div>
        </div>

        <div
          class="userBtn btn-parts2 _red font-minchoB"
          @click="registerUser()"
          v-if="!btnLoad"
          >
          <button>登録</button>
        </div>

        <div class="loader" v-else></div>
      </div>
    </div>
    <div v-else-if="!load && !selectClient">
      <p>無効なURLです。</p>
    </div>
  </div>
</template>

<script>
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import 'vue-multiselect/dist/vue-multiselect.min.css'
export default {
  layout: "none",
  head() {
    return {
      title: "新規登録",
    };
  },
  data() {
    return {
      clients: [],
      load: true,
      delivery_locations: [],
      selectLocation: "",
      selectClient: "",
      errorMessages: [],
      btnLoad: false,
      lookChange: false,
      pass_type: "password",
      pass_eye: faEyeSlash,
      confirm_eye: faEyeSlash,
      confirm_type: "password",
      user: {
        delivery_location_id: null,
        last_name: "",
        first_name: "",
        last_name_kana: "",
        first_name_kana: "",
        email: "",
        password: "",
        tel: "",
      },
      password_confirmation: "",
    }
  },
  async mounted() {
    let clientsData = await this.$frontApi.getClients();
    this.clients = clientsData.clients;

    for(let i = 0; i < this.clients.length; i++){
      for(let j = 0; j < this.clients[i].delivery_locations.length; j++){
        this.delivery_locations.push(this.clients[i].delivery_locations[j]);
      }
    }

    // ?以降のURL取得
    let code = window.location.search.substring(1,window.location.search.length);

    // クエリ暗号化解除
    let qrItemSplit = [];
    qrItemSplit = code.split('');
    for(let i = 0; i < 5; i++){
      qrItemSplit.shift();
      qrItemSplit.pop();
    }

    code = qrItemSplit.join('');

    let selectLocation = this.delivery_locations.find((d) => d.delivery_location_id == code);
    this.user.delivery_location_id = selectLocation.delivery_location_id;
    this.selectLocation = selectLocation.delivery_location_name;

    let client;
    let matched;
    for(let i = 0; i < this.clients.length; i++){
      matched = this.clients[i].delivery_locations.find((d) => d.delivery_location_id == this.user.delivery_location_id);
      if(matched != undefined){
        client = this.clients[i];
        break;
      }
    }
    this.selectClient = client.name;

    this.load = false;
  },
  methods: {
    validationCheck() {
      this.errorMessages = [];
      // 空白かどうか
      if(!this.user.last_name || !this.user.first_name || !this.user.last_name_kana || !this.user.first_name_kana
        || !this.user.email || !this.user.password || !this.password_confirmation || !this.user.delivery_location_id || !this.user.tel ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
      }
      // 電話番号
      else if(!(/^[0-9]+$/).test(this.user.tel)) {
        this.errorMessages.push("正しい電話番号を入力してください");
        this.$util.scrollToTop();
      }

      // メール
      else if(!(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/).test(this.user.email)) {
        this.errorMessages.push("正しいメールアドレスを入力してください");
        this.$util.scrollToTop();
      }

      // パスワード
      else if(this.user.password.length < 8 || this.user.password.length >= 15) {
        this.errorMessages.push("パスワードは8文字以上15文字以下で入力してください");
        this.$util.scrollToTop();
      }
      else if(!(/^[a-zA-Z0-9]+$/).test(this.user.password)) {
        this.errorMessages.push("パスワードは半角英数字で入力してください");
        this.$util.scrollToTop();
      }
      else if(this.user.password != this.password_confirmation) {
        this.errorMessages.push("パスワードと確認用パスワードが一致しません");
        this.$util.scrollToTop();
      }
    },

    async registerUser() {
      this.load = true;
      this.validationCheck();
      if(!this.errorMessages.length) {
        const errorMessages = await this.$frontApi.signup(this.user);
        if(errorMessages != undefined) {
          this.errorMessages = errorMessages;
          this.load = false;
        }
        else{
          this.$router.push("/signup/completed?type=register");
          this.load = false;
        }
      }
      this.load = false;
    },
    //パスワード入力時の表示非表示切替
    passLookChange(){
      if(this.pass_type == "password"){
        this.pass_type = "text";
        this.pass_eye = faEye;
      }
      else{
        this.pass_type = "password";
        this.pass_eye = faEyeSlash;
      }
    },
    confirmLookChange(){
      if(this.confirm_type == "password"){
        this.confirm_type = "text";
        this.confirm_eye = faEye;
      }
      else{
        this.confirm_type = "password";
        this.confirm_eye = faEyeSlash;
      }
    }
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
  },
}
</script>

<style lang="scss" scoped>
.signup{
  color: black;
  > .logo {
    margin-left: 2.5%;
    margin-top: 10px;
    > img{
      width: clamp(210px,32vw,330px);
    }
    @media #{$phone} {
      width: 70%;
      > img{
        width: 100%;
      }
    }
  }
  .header_inner{
    width: 80%;
    margin: 0 auto;
    margin-top: 100px;
    @media #{$phone} {
      width: 95%;
      margin-top: 70px;
    }
    > .header_title {
      margin-left: 10px;
      font-size: 30px;
      margin-right: 30px;
      border-left: 7px solid $color-red2; /*線の設定*/
      padding: 2px 10px; /*余白の設定*/
    }
  }
  .user_table {
    width: 80%;
    margin: 50px auto 200px;
    @media #{$phone} {
      width: 95%;
    }
      > .row {
        margin-top: 10px;
        align-items: stretch;
        @media #{$phone} {
          display: block;
        }

        > .heading {
          color: $color-txt2;
          width: 26%;
          background-color: $color-gray;
          border-radius: 3px;
          padding: 20px;
          font-size: 13px;
          font-weight: bold;
          @media #{$phone} {
            width: 100%;
            justify-content: start;
          }
          > span {
            background-color: $color-red2;
            color: white;
            padding: 4px 13px;
            border-radius: 20px;
            font-size: 12px;
            @media #{$phone} {
              margin-left: 10px;
            }
          }
        }
        > .detail {
          width: 72%;
          padding: 20px 0 20px 20px;
          position: relative;
          font-size: 12px;
          @media #{$phone} {
            width: 100%;
            justify-content: start;
            padding-left: 0;
          }
          input {
            border: 1px solid $color-gray2;
            padding: 10px;
            border-radius: 3px;
            width: 100%;
            &::placeholder{
            color: $color-gray;
            }
          }
          > .errorBox {
            position: absolute;
            top: 50px;
          }
          > .top {
            > .btn {
              color: white;
              background-color: $color-red2;
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

          > .note {
            font-size: 12px;
            margin: 20px 0 0 0;
            color: $color-red2;
            @media #{$phone} {
              font-size: 14px;
              margin: 20px 0 0;
            }
            > span {
              display: block;
              margin-top: 10px;
            }
          }
        }
        > .pass{
          > .input{
            width: 100%;
            position: relative;
            > .faEye{
              color: $color-gray2;
              position: absolute;
              right: 20px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        > .name{
          > input{
            &:not(:first-child) {
              margin-left: 14px;
            }
          }
        }
      }
      > .userBtn {
      border-radius: 5px;
      width: 140px;
      margin:100px auto 10px;
      padding: 9px 0;
      height: 40px;
      @media #{$phone} {
        height: 50px;
        padding: 14px 0;
        width: 100%;
      }
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
}
</style>