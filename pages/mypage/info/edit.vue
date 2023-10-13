<template>
  <div>
    <p class="title" ref="scrollElem">会員情報編集</p>
    <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>
    <div class="delivery_table">
      <div class="cell flex _a-center _j-between name">
        <div class="heading flex _a-center _j-between">
          姓名(漢字)
          <span>必須</span>
        </div>
        <div class="detail flex _a-center">
          <input type="text" placeholder="山田" v-model="user.last_name">
          <input type="text" placeholder="太郎" v-model="user.first_name">
        </div>
      </div>

      <div class="cell flex _a-center _j-between kana">
        <div class="heading flex _a-center _j-between">
          姓名(カナ)
          <span>必須</span>
        </div>
        <div class="detail flex _a-center">
          <input type="text" placeholder="ヤマダ" v-model="user.last_name_kana">
          <input type="text" placeholder="タロウ" v-model="user.first_name_kana">
        </div>
      </div>

      <div class="cell flex _a-center _j-between mail">
        <div class="heading flex _a-center _j-between">
          メールアドレス
          <span>必須</span>
        </div>
        <div class="detail">
          <input type="text" placeholder="メールアドレス" v-model="user.email">
          <p class="note">ハイフン不要・半角数字で入力してください</p>
        </div>
      </div>

      <div class="cell flex _a-center _j-between pass">
        <div class="heading flex _a-center _j-between">
          パスワード
          <span>必須</span>
        </div>
        <div class="detail flex _a-center">
          <input type="password" placeholder="変更時のみ入力" v-model="user.password">
        </div>
      </div>

      <div class="cell flex _a-center _j-between pass">
        <div class="heading flex _a-center _j-between">
          確認用パスワード
          <span>必須</span>
        </div>
        <div class="detail flex _a-center">
          <input type="password" placeholder="変更時のみ入力" v-model="user.password_confirmation">
        </div>
      </div>

      <div class="cell flex _a-center _j-between tel">
        <div class="heading flex _a-center _j-between">
          電話番号
          <span>必須</span>
        </div>
        <div class="detail">
          <input type="text" placeholder="09012345678" v-model="user.tel">
          <div class="errorBox" v-show="!numCheck(user.tel)">半角数字で入力してください</div>
          <p class="note">ハイフン不要・半角数字で入力してください</p>
        </div>
      </div>
    </div>

    <div class="userBtn btn-parts2 _red" v-if="!load">
      <button @click="editBtn()">更新</button>
    </div>

    <div class="loader" v-else></div>

    <!-- <div class="withdrawlBtn btn-parts2 _gray btn-shadow">
      <button @click="withdrawl()">退会する</button>
    </div> -->

  </div>
</template>

<script>
export default {
  props: {
    edit: false
  },
  data() {
    return {
      user: {
        last_name: "",
        first_name: "",
        last_name_kana: "",
        first_name_kana: "",
        email: "",
        tel: "",
        password: "",
      },
      password_confirmation: "",
      errorMessages: [],
      addressErrorMessages: [],
      addressLoad: false,
      load: false
    }
  },
  async mounted() {
    this.user = await this.$frontApi.getUserEdit();
  },
  methods: {
    validationCheck() {
      this.errorMessages = [];
      // 空白かどうか
      if(!this.user.last_name || !this.user.first_name || !this.user.last_name_kana || !this.user.first_name_kana
        || !this.user.email || !this.user.tel ) {
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

      else{
        if(this.user.password || this.password_confirmation) {
          if(this.user.password.length < 8 || this.user.password.length >= 15) {
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
          else{
            return true;
          }
        }
        else {
          return true;
        }
      }
    },
    async editBtn() {
      this.load = true;
      this.validationCheck()
      if(!this.errorMessages.length) {
        this.errorMessages = await this.$frontApi.putUser(this.user);
        if(!this.errorMessages.length) {
          this.$router.push("/mypage/info");
          this.$showSuccessMessage(`会員情報を更新しました`)
          this.load = false;
        }
      }
      this.load = false;
    },
    // withdrawl() {
    //   this.$router.push("/withdrawl")
    // }
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
  }
}
</script>

<style lang="scss" scoped>
div {
  color: black;

  > .title {
    font-size: 25px;
    text-align: center;
    letter-spacing: 2px;
    color: $color-front;
    @media #{$phone} {
      font-size: 17px;
    }
  }
  .delivery_table {
    margin: 50px 0 70px;
    @media #{$phone} {
      margin: 40px 0 40px;
    }
      > .cell {
        margin-top: 10px;
        align-items: stretch;
        @media #{$phone} {
          display: block;
        }

        > .heading {
          width: 26%;
          background-color: $color-gray;
          color: $color-front;
          border-radius: 3px;
          padding: 30px;
          font-size: 15px;
          @media #{$phone} {
            width: 100%;
            font-size: 14px;
            padding: 7px 10px;
            justify-content: start;
          }

          > span {
            background-color: $color-red2;
            color: white;
            padding: 4px 13px;
            border-radius: 20px;
            font-size: 12px;
            @media #{$phone} {
              font-size: 12px;
              padding: 3px 10px;
              margin-left: 10px;
            }
          }
        }
        > .detail {
          width: 72%;
          padding: 20px 0 10px 14px;
          position: relative;

          @media #{$phone} {
              width: 100%;
              padding: 10px 0;
          }

          input {
            border: 1px solid $color-gray2;
            padding: 10px;
            border-radius: 3px;
            color: $color-front;
            &:not(:first-child) {
              margin-left: 14px;
            }
            @media #{$phone} {
              padding: 5px 10px;
              font-size: 14px;
            }
          }
          select {
            padding: 10px;
            color: black;
            border: 1px solid $color-gray2;
          }
          > .addressErrorMessage {
            font-size: 13px;
            width: 55%;
            margin-bottom: 20px;
            &::deep
            ul {
              > li {
                padding: 7px 0;
                margin: 0;
              }
            }
          }
          > .errorBox {
            position: absolute;
            top: 50px;
          }
          > .top {
            > .btn {
              color: white;
              background-color: $color-gray;
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
            @media #{$phone} {
              font-size: 13px;
              margin: 10px 10px 0;
            }
            > span {
              display: block;
              margin-top: 10px;
            }
          }
        }
      }
      > .name, .kana{
        input {
          width: 35%;
          @media #{$phone} {
            width: 50%;
          }
        }
      }
      > .mail, .pass {
        input {
          width: 50%;
          @media #{$phone} {
            width: 100%;
          }
        }
      }
      > .pass {
        input {
          @media #{$phone} {
            width: 80%;
          }
        }
      }
      > .tel, .post {
        input {
          width: 30%;
          @media #{$phone} {
            width: 45%;
          }
        }
      }
      > .prefecture, .usage {
        .select {
          width: 30%;
        }
      }
      > .town, .building {
        > .heading {
          font-size: 14px;
        }
        input {
          width: 50%;
          @media #{$phone} {
            width: 100%;
          }
        }
      }
    }
  > .userBtn {
    border-radius: 5px;
    margin: 0 auto 40px;
    font-size: 15px;
    width: 160px;
    color: white;
    button {
      letter-spacing: 8px;
      width: 100%;
      padding: 10px;
    }
  }
  > .loader {
    margin: 0 auto 40px;
  }

  > .withdrawlBtn {
    width: fit-content;
    font-size: 15px;
    margin-bottom:40px;
    color: white;
    width: 160px;
    border-radius: 25px;
    > button {
      padding: 10px;
      width: 100%;
      letter-spacing: 6px;
    }
  }
}
</style>