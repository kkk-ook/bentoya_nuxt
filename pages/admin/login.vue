<template>
  <div class="login">
    <ErrorFlash :errorMessages="errorMessages"></ErrorFlash>
    <div class="inner">
      <div class="logo">
        <img src="/fronts/front/header/logo.svg" alt="logo" />
      </div>
      <div class="flex _a-center">
        <p class="txt">管理者ログインID</p>
        <div class="input flex">
          <input type="text" v-model="mail" placeholder="ID">
        </div>
      </div>
      <div class="flex _a-center">
        <p class="txt">管理者パスワード</p>
        <div class="input flex">
          <input type="password" v-model="pass" @keyup.enter="login" placeholder="PassWord">
        </div>
      </div>
      <button @click="login">ログイン</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLoginPage',
  layout: "none",
  data() {
    return {
      mail: "",
      pass: "",
      errorMessages: [],
      load: false,
    }
  },
  methods: {
    async login() {
      this.load = true;
      this.errorMessages = [];
      this.errorMessages = await this.$adminApi.login(this.mail, this.pass)
      if(!this.errorMessages.length) {
        this.$router.push('/admin/product')
      }
      else{
        this.errorMessages[0] = "IDもしくはパスワードが無効です";
        this.$util.scrollToTop();
      }
      this.load = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
  > .inner {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    > .logo {
      margin-bottom: 50px;
    }
    > .flex{
      align-items: baseline;
      > .txt {
        width: 60%;
      }
      > .input {
        width: 100%;
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid $color-gray;
        background-color: #fff;
        border-radius: 5px;
      }
    }
    > button {
      display: block;
      margin: 60px auto 0;
      background-color: $color-red;
      color: white;
      font-weight: bold;
      border-radius: 5px;
      width: 300px;
      text-align: center;
      font-size: 15px;
      padding: 12px 0;
      transition: 0.5s;
      &:hover {
        filter: brightness(50%);
      } 
    }
  }
}
</style>
