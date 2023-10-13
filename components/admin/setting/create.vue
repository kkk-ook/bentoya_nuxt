<template>
  <div>
    <ErrorFlash
    :errorMessages="errorMessages"></ErrorFlash>
    <div class="administrator_table">

      <div class="row flex _a-center _j-center mail">
        <div class="heading flex _a-center _j-between">
          管理者名
          <span>必須</span>
        </div>
        <div class="detail">
          <input type="text" placeholder="管理者名" v-model="administrator.name">
        </div>
      </div>

      <div class="row flex _a-center _j-center mail">
        <div class="heading flex _a-center _j-between">
          メールアドレス
          <span>必須</span>
        </div>
        <div class="detail">
          <input type="text" placeholder="メールアドレス" v-model="administrator.email">
        </div>
      </div>

      <div class="row flex _a-center _j-center pass">
        <div class="heading flex _a-center _j-between">
          パスワード
          <span v-show="!edit">必須</span>
        </div>
        <div class="detail flex _a-center pass">
          <div class="input" v-show="!edit">
            <input :type="pass_type" placeholder="パスワード" v-model.lazy="administrator.password">
            <fa
              :icon="pass_eye"
              class="faEye"
              @click="passLookChange"
            />
          </div>
          <div class="input" v-show="edit">
            <input :type="pass_type" placeholder="変更時のみ入力" v-model.lazy="administrator.password">
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
          <span v-show="!edit">必須</span>
        </div>
        <div class="detail flex _a-center pass">
          <div class="input" v-show="!edit">
            <input :type="confirm_type" placeholder="確認用パスワード" v-model.lazy="password_confirmation">
            <fa
              :icon="confirm_eye"
              class="faEye"
              @click="confirmLookChange"
            />
          </div>
          <div class="input" v-show="edit">
            <input :type="confirm_type" placeholder="変更時のみ入力" v-model.lazy="password_confirmation">
            <fa
              :icon="confirm_eye"
              class="faEye"
              @click="confirmLookChange"
            />
          </div>
        </div>
      </div>

      <div
        class="administratorBtn btn-parts2 _red font-minchoB"
        @click="registerAdministrator(administrator.name)"
        v-if="!btnLoad"
        v-show="!edit"
        >
        <button>登録</button>
      </div>

      <div
        class="administratorBtn btn-parts2 _red font-minchoB"
        @click="editAdministrator(administrator.name)"
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
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  layout: "admin",
  props: {
    edit: Boolean,
  },
  data() {
    return {
      errorMessages: [],
      load: false,
      btnLoad: false,
      clients: [],
      clients_name: [],
      clientsDeliveryLocations: [],
      lookChange: false,
      pass_type: "password",
      pass_eye: faEye,
      confirm_eye: faEye,
      confirm_type: "password",
      administrator: {
        name: "",
        email: "",
        password: "",
      },
      password_confirmation: "",
    }
  },
  async mounted() {
    this.load = false;

    if(this.edit) {
      this.administrator = await this.$adminApi.getAdministratorEdit(this.$route.params.id);
    }

    this.load = true;
  },
  methods: {
    validationCheck() {
      this.errorMessages = [];
      // 空白かどうか
      if(!this.administrator.name || !this.administrator.email || !this.administrator.password || !this.password_confirmation ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
      }

      // メール
      else if(!(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/).test(this.administrator.email)) {
        this.errorMessages.push("正しいメールアドレスを入力してください");
        this.$util.scrollToTop();
      }

      // パスワード
      else if(this.administrator.password.length < 8 || this.administrator.password.length >= 15) {
        this.errorMessages.push("パスワードは8文字以上15文字以下で入力してください");
        this.$util.scrollToTop();
      }
      else if(!(/^[a-zA-Z0-9]+$/).test(this.administrator.password)) {
        this.errorMessages.push("パスワードは半角英数字で入力してください");
        this.$util.scrollToTop();
      }
      else if(this.administrator.password != this.password_confirmation) {
        this.errorMessages.push("パスワードと確認用パスワードが一致しません");
        this.$util.scrollToTop();
      }
    },

    editValidationCheck() {
      if(!this.administrator.name || !this.administrator.email ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
        return false;
      } else {
        if(this.administrator.password || this.password_confirmation) {
          if(this.administrator.password != this.password_confirmation) {
            this.errorMessages.push("パスワードと確認用パスワードが一致しません");
            this.$util.scrollToTop();
          }
          else if(this.administrator.password.length < 8 || this.administrator.password.length >= 15) {
            this.errorMessages.push("パスワードは8文字以上15文字以下で入力してください");
            this.$util.scrollToTop();
          }
          else if(!(/^[a-zA-Z0-9]+$/).test(this.administrator.password)) {
            this.errorMessages.push("パスワードは半角英数字で入力してください");
            this.$util.scrollToTop();
          }
          else{
            return true;
          }
        }
        else {
          return true;
        }
      }
    },
    async registerAdministrator(name) {
      this.load = true;
      this.validationCheck();
      if(!this.errorMessages.length) {
        if(this.administrator.password){
          this.administrator.password_confirmation = this.administrator.password;
        }
        this.errorMessages = await this.$adminApi.postAdministrator(this.administrator);
        if(!this.errorMessages.length) {
          this.$router.push("/admin/setting");
          this.load = false;
          this.$showSuccessMessage(`${name} さんを登録しました`);
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.load = false;
    },
    async editAdministrator(name) {
      this.load = true;
      if(this.editValidationCheck()) {
        if(this.administrator.password){
          this.administrator.password_confirmation = this.administrator.password;
        }
        this.errorMessages = await this.$adminApi.putAdministrator(this.$route.params.id, this.administrator);
        if(!this.errorMessages.length) {
          this.$router.push("/admin/setting");
          this.load = false;
          this.$showSuccessMessage(`${name}さんの情報を更新しました`)
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.load = false;
    },
    //パスワード入力時の表示非表示切替
    passLookChange(){
      if(this.pass_type == "password"){
        this.pass_type = "text";
        this.pass_eye = faEyeSlash;
      }
      else{
        this.pass_type = "password";
        this.pass_eye = faEye;
      }
    },
    confirmLookChange(){
      if(this.confirm_type == "password"){
        this.confirm_type = "text";
        this.confirm_eye = faEyeSlash;
      }
      else{
        this.confirm_type = "password";
        this.confirm_eye = faEye;
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
div {
  .administrator_table {
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
          }
        }
        > .detail {
          width: 72%;
          padding: 20px 0 20px 20px;
          position: relative;
          font-size: 12px;
          input {
            border: 1px solid $color-gray2;
            padding: 10px;
            border-radius: 3px;
            width: 100%;
            &::placeholder{
            color: $color-gray;
            }
          }
          .select {
            padding: 10px;
            border: 1px solid $color-gray2;
            width: 100%;
            .select-parts{
              width: 100%;
            }
          }
          > .errorBox {
            position: absolute;
            top: 50px;
          }
          > .top {
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
            .errorBox2 {
              position: absolute;
              top: 50px;
            }
          }

          > .note {
            font-size: 12px;
            margin: 20px 0 0 0;
            color: $color-red;
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
      // > .pass{
      //   > .detail{
      //     font-size: 12px;
      //     border: 1px solid $color-gray;
      //     border-radius: 3px;
      //     > input{
      //       border: none;
      //     }
      //   }
      // }
      > .administratorBtn {
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
}
</style>