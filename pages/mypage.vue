<template>
  <div class="wrapper">
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="name flex _a-center" data-txt="様のマイページ">
      <p>{{ user.last_name }}</p>
      <p>{{ user.first_name }}</p>
    </div>

    <div class="folder flex _a-center">
      <div class="right">
        <div class="btn" @click="logout">ログアウト</div>
      </div>
      <div class="left">

        <nuxt-link to="/mypage/info" class="main-link" active-class="active"
          >会員情報</nuxt-link
        >
        <nuxt-link to="/mypage/history" class="main-link" active-class="active"
          >購入履歴</nuxt-link
        >
      </div>
    </div>

    <div class="child">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
    title: "マイページ",
    };
  },
  data() {
    return {
      user: "",
    }
  },
  async mounted() {
    let data = await this.$frontApi.getUserState();
    if(!data.errorMessages.length){
      this.user = await this.$frontApi.getUserEdit();
    }
    else{
      this.$util.isLostLogin();
    }
  },
  methods: {
    async logout(e) {
      // const cartItems = await this.$frontApi.getCarts();
      // if (cartItems){
      //   for (let i = 0; i < cartItems.length; i++) {
      //     await this.$frontApi.deleteCart(cartItems[i].id, e)
      //   }
      // }
      await this.$frontApi.logout(e);
      window.location.href = "/login";
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  font-family: 'Noto Sans JP'; 
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  @media #{$phone} {
    width: 95%;
  }

  > .name {
    font-size: 20px;
    margin: 60px auto;
    @media #{$phone} {
      margin: 100px auto 50px;
      font-size: 15px;
    }
    > p {
      &:not(:first-child) {
        padding-left: 5px;
      }
    }
    &::after {
      content: attr(data-txt);
      font-size: 15px;
      padding-left: 10px;
      @media #{$phone} {
        font-size: 14px;
      }
    }
  }

  > .folder {
    justify-content: space-between;
    flex-flow: row-reverse;
    padding-bottom: 5px;
    margin-bottom: 100px;
    cursor: pointer;
    @media #{$phone} {
      display: block;
      padding: 0;
      margin-bottom: 50px;
    }

    > .left {
      @media #{$phone} {
        display: flex;
      }

      > .main-link {
        width: 36%;
        padding: 12px 26px;
        border-radius: 7px 7px 7px 7px;
        letter-spacing: 1px;
        background-color: $color-gray;
        color: black;
        text-align: center;
        cursor: pointer;
        transition: 0.2s;
        font-size: 15px;
        margin-right: 5px;
        &:last-child {
          margin-right: 0;
        }
        @media #{$phone} {
          font-size: 14px;
          padding: 10px 15px;
          display: block;
          margin-top: 10px;
        }

        &:hover,
        &.active {
          background-color: $color-red2;
          color: white;
        }
      }
    }

    > .right {
      > .btn {
        margin-bottom: 4px;
        background-color: $color-gray;
        padding: 8px 18px;
        font-size: 15px;
        border-radius: 5px;
        display: block;
        width: fit-content;
        transition: 0.2s;
        @media #{$phone} {
          margin: 0 0 25px auto;
          font-size: 14px;
        }
        &:hover {
          background-color: $color-red2;
          color: $color-wh;
        }
      }
    }
  }
}
</style>
