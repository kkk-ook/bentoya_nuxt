<template>
  <div class="login">
    <div class="input-area">
      <ErrorFlash :errorMessages="errorMessages" class="error"></ErrorFlash>
      <div class="inner">
        <h3>ログイン</h3>
        <div class="flex _a-center">
          <p class="txt">メールアドレス</p>
          <input type="text" v-model="mail">
        </div>
        <div class="flex _a-center">
          <p class="txt">パスワード</p>
          <input type="password" v-model="pass" @keyup.enter="login">
        </div>
        <p class="note">
          <button @click="mailModal = true">会員登録メール認証ができてない方はこちら</button>
          <button @click="passModal = true">パスワードをお忘れの方はこちら</button>
        </p>
        <button @click="login">ログイン</button>
      </div>
    </div>

    <article class="modal-contents passModal" v-if="passModal">
      <section class="modal_inner">
        <div class="body">
          <div class="buttonitem"  @click="closePassModal">
            <button class="btn_close">
              <img src="/fronts/front/close.png" alt=""/>
            </button>
          </div>
          <div class="inner-main">
            <p class="title">パスワード再設定</p>
            <ErrorFlash
              :errorMessages="modalErrorMessages"
              class="flash"
            ></ErrorFlash>

            <p class="suv_txt">
              以下のフォームからパスワード再設定メールを送信できます。
            </p>
            <div class="area">
              <div class="inp">
                <input v-model="confirmEmail" placeholder="メールアドレス"/>
              </div>
              <div class="button">
                <button class="btn-shadow" @click="resetPass">
                  メールを送信する
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>

    <article class="modal-contents mailModal" v-if="mailModal">
      <section class="modal_inner">
        <div class="body">
          <div class="buttonitem">
            <button class="btn_close" @click="closeMailModal">
              <img src="/fronts/front/close.png" alt=""/>
            </button>
          </div>
          <div class="inner-main">
            <p class="title">確認メール再送信フォーム</p>
            <ErrorFlash
              :errorMessages="modalErrorMessages"
              class="flash"
            ></ErrorFlash>

            <p class="suv_txt">
              以下のフォームから確認メールを再送できます
            </p>
            <div class="area">
              <div class="inp">
                <input v-model="confirmEmail" placeholder="メールアドレス"/>
              </div>
              <div class="button">
                <button class="btn-shadow" @click="resendEmail">
                  メールを再送する
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>

  </div>
</template>

<script>
export default {
  layout: "none",
  head() {
    return {
    title: "ログイン",
    };
  },
  data() {
    return {
      mail: "",
      pass: "",
      errorMessages: [],
      load: false,
      passModal: false,
      mailModal: false,
      modalErrorMessages: []
    }
  },
  methods: {
    async login() {
      this.load = true;
      this.errorMessages = [];
      this.errorMessages = await this.$frontApi.login(this.mail, this.pass)
      if(!this.errorMessages.length) {
        this.$router.push('/')
      }
      else{
        this.errorMessages[0] = "IDもしくはパスワードが無効です";
        this.$util.scrollToTop();
      }
      this.load = false;
    },
    async resendEmail(e) {
      this.modalErrorMessages = [];
      if (!this.confirmEmail)
        return this.modalErrorMessages.push(
          "メールアドレスを入力してください。"
        );
      const err = await this.$frontApi.resendEmail(e, this.confirmEmail);
      if (err.length) {
        this.modalErrorMessages = err;
        // this.modalErrorMessages.push(
        //   "ご入力されたメールアドレスは登録されていません。"
        // );
      }
      if (!this.modalErrorMessages.length) {
        this.$router.push("/signup/completed?type=resend");
      }
    },
    async resetPass(e) {
      this.modalErrorMessages = [];
      if (!this.confirmEmail)
        return this.modalErrorMessages.push(
          "メールアドレスを入力してください。"
        );
      const err = await this.$frontApi.resetPass(e, this.confirmEmail);
      if (err.length) {
        this.modalErrorMessages = err;
        // this.modalErrorMessages.push(
        //   "ご入力されたメールアドレスは登録されていません。"
        // );
      }
      else {
        this.$router.push("/signup/completed?type=reset");
      }
    },
    closeMailModal() {
      this.modalErrorMessages = [];
      this.mailModal = false;
    },
    closePassModal() {
      this.modalErrorMessages = [];
      this.passModal = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  > .input-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    > .inner {
      width: 450px;
      margin: 0 auto;
      padding: 20px;
      > h3 {
        margin: 40px 0 0 0;
        text-align: center;
      }
      > .flex{
        margin-top: 20px;
        > .txt {
          width: 50%;
        }
        > input {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid black;
        }
      }
      > .note {
        font-size: 12px;
        text-align: right;
        margin-top: 15px;
  
        > button {
          text-decoration: underline;
          margin-top: 7px;
        }
      }
      > .error {
        font-size: 12px;
        margin: 8px;
      }
      > button {
        display: block;
        margin: 60px auto 0;
        background-color: red;
        color: white;
        font-weight: bold;
        border-radius: 25px;
        width: 300px;
        text-align: center;
        font-size: 15px;
        padding: 12px 0;
        transition: 0.5s;
        &:hover {
          opacity: 0.5;
        }
      }
    }
  }

  .inner-main {
    width: 70%;
    margin: 0 auto;
    text-align: center;
    @media #{$phone} {
      width: 100%;
    }

    > .flash {
      font-size: 14px;
    }

    > .title {
      font-size: 20px;
      letter-spacing: 4px;
      @media #{$phone} {
        font-size: 18px;
        letter-spacing: 1px;
      }
    }

    > .suv_txt {
      color: $color-red2;
      font-size: 14px;
      margin-top: 10px;
      @media #{$phone} {
        font-size: 12px;
      }
    }

    > .area {
      padding: 30px 0;

      > .txt {
      }

      > .inp {
        > input {
          width: min(100%, 400px);
          border: 1.3px solid #5e5453;
          border-radius: 5px;
          padding: 6px;
          margin-top: 6px;
          text-align: left;
          color: black;
        }
      }

      > .button {
        width: min(60%, 250px);
        margin: 0 auto;

        > .btn-shadow {
          color: white;
          background-color: $color-red2;
          font-size: 18px;
          width: 100%;
          text-align: center;
          padding: 10px;
          border-radius: 5px;
          margin-top: 50px;
        }
      }
    }
  }
}
</style>