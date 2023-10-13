<template>
  <div class="wrapper">
    <ErrorFlash :errorMessages="errorMessages" class="errorMessages"></ErrorFlash>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="title">
      <p class="title-font">パスワードの再設定</p>
      <p class="detail-font">以下のフォームからパスワードの再設定を行なってください</p>
    </div>
    <div class="form">

      <div class="row flex _a-center _j-center">
        <p>メールアドレス</p>
        <div class="input">
          <input type="text" v-model="mail">
        </div>
      </div>
      <div class="row flex _a-center _j-center">
        <p>新しいパスワード</p>
        <div class="input">
          <input type="password" v-model="pass">
        </div>
      </div>
      <div class="row flex _a-center _j-center">
        <p>新しいパスワード確認</p>
        <div class="input">
          <input type="password" v-model="confirmPass">
        </div>
      </div>
    </div>

      <div class="btn" v-if="!isLoading">
        <button @click="resetPass">パスワードを再設定する</button>
      </div>
      <div class="loader" v-else></div>

  </div>
</template>

<script>
export default {
  layout: "none",
  data() {
    return {
      mail: "",
      pass: "",
      confirmPass: "",
      errorMessages: [],
      isLoading: false
    }
  },
  methods: {
    validationCheck() {
      if(!this.mail || !this.pass || !this.confirmPass) {
        this.errorMessages.push("全ての項目を入力してください")
      } else {
        if( /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
            this.mail
          ) == false) {
            this.errorMessages.push("正しいメールアドレスを入力してください")
          } else {
            if(this.pass.length < 8 || this.pass.length >= 15) {
              this.errorMessages.push("パスワードは8文字以上15文字以下で入力してください");
            } else if(/^[0-9a-zA-Z]*$/.test(this.pass) == false) {
              this.errorMessages.push("パスワードは半角英数字で入力してください");
            }
          }
      }
      if(this.errorMessages) {
        setTimeout(() => {
          this.errorMessages = []
        }, 1000)
      }
    },
    resetPass(e) {
      e.target.disabled = true;
      this.isLoading = true;
      this.validationCheck();
      if(!this.errorMessages.length) {
        const headers = {
          "uid": this.mail,
          "client": this.$route.query.client,
          "access-token": this.$route.query.token
        }
        this.errorMessages = this.$frontApi.resetPassDo(this.pass, this.confirmPass, headers)
        if(!this.errorMessages.length) {
          this.$showSuccessMessage(`パスワードを再設定しました`);
          setTimeout(() => {
            this.$router.push("/login");
            e.target.disabled = false;
          }, 2000)
        }
      }
      e.target.disabled = true;
      this.isLoading = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {

  color: $color-front;
  width: 90%;
  margin: 80px auto 0;
  > .errorMessages{
    position: fixed;
    top: 50px;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    animation: slideIn 2s;
    @media #{$phone} {
      top: auto;
      bottom: 20px;
      animation: slideUp 2s;
      left: 0;
    }
  }
  > .successMessage {
    @media #{$phone} {
      width: 80% !important;
    }
  }
  > .title{
    text-align: center;
    > .title-font{
      font-size: 24px;
    }
    > .detail-font{
      margin-top: 10px;
      font-size: 18px;
    }
  }
  > .form {
    width: 50%;
    margin: 100px auto 0;
    @media #{$tablet} {
      width: 90%
    }
    @media #{$phone} {
      width: min(90%, 400px);
    }
    > .row {
      margin: 20px auto 0;
      @media #{$phone} {
        display: block;
      }
      > p {
        width: 200px;
        @media #{$phone} {
          width: 90%;
        }
      }
      > .input {
        width: 350px;
        border: 1px solid $color-front;
        border-radius: 5px;
        > input {
          padding: 10px;
          @media #{$phone} {
            font-size: 13px;
            padding: 8px 10px;
          }
        }
        @media #{$phone} {
          width: 100%;
          margin: 6px auto 0;
        }
      }
    }
  }
  > .btn {
    background-color: $color-red2;
    width: fit-content;
    color: white;
    border-radius: 5px;
    margin: 80px auto 0;
    > button {
      font-size: 17px;
      padding: 14px 40px;
    }
  }
  > .loader {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%);
  }
}
</style>