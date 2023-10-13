<template>
  <section class="completed font-shuG">
    <div class="inner max-width-content">
      <h2 class="title">{{ title }}</h2>
      <p class="message">{{ message }}</p>
      <div class="button">
        <nuxt-link to="/login">
          <button>ログイン画面に戻る
          </button>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: "none",
  head() {
    return {
      title: `${this.title}`,
      meta: [{ hid: "robots", name: "robots", content: "noindex" }],
    };
  },
  data() {
    return {
      title: "",
      message: "",
    };
  },
  mounted() {
    switch (this.$route.query.type) {
      case "register":
        this.title = "登録受付完了";
        this.message = `ご登録頂いたメールアドレスに仮登録受付メールを送信いたしました。
          メール本文の登録URLをクリックして、会員登録を完了させてください。`;
        break;
      case "resend":
        this.title = "登録メールを再送しました。";
        this.message = `入力頂いたメールアドレスに会員登録メールを再送いたしました。
        メール本文の登録URLをクリックして、会員登録を完了させてください。`;
        break;
      case "reset":
        this.title = "パスワード再設定メールを送信しました。";
        this.message = `入力頂いたメールアドレスにパスワード再設定メールを送信いたしました。
        メール本文のURLをクリックして、パスワードの変更を行なってください。`;
        break;
    }
  },
};
</script>

<style lang="scss" scoped>
.completed {
  color: $color-front;
  padding-top: 75px;
  min-height: 70vh;
  > .inner {
    max-width: 1000px;
    padding-bottom: 65px;
    > .title {
      font-size: 24px;
      text-align: center;
      @media #{$phone} {
        font-size: 18px;
      }
    }
    > .message {
      line-height: 25px;
      white-space: pre-line;
      font-size: 16px;
      margin-top: 50px;
      text-align: center;
      @media #{$phone} {
        width: 90%;
        margin: 50px auto 0;
        font-size: 14px;
      }
    }
    > .button {
      color: white;
      background-color: $color-red2;
      width: fit-content;
      margin: 50px auto 0;
      border-radius: 25px;
      transition: 0.4s;
      > a {
        > button {
          font-size: 18px;
          padding: 10px 40px;
        }
      }
      &:hover {
        filter: brightness(50%);
      }
    }
  }
}
</style>
