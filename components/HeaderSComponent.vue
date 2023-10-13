<template>
<div class="wrapper">
  <div class="head smart_only">
    <div class="content flex _j-between">
      <img src="/fronts/front/header/icon_hamburger.svg" alt="" class="menu" @click="menuActive"/>
      <nuxt-link to="/" class="logo">
        <h1>
          <img src="/fronts/front/header/logo.svg" alt=""/>
        </h1>
      </nuxt-link>
      <div class="cart-content_sp">
        <nuxt-link to="/cart" class="cart">
          <div class="content cart_count" v-if="Number(cartCount) > 0">
            <p class="badge">{{ Number(cartCount) }}</p>
            <img src="/fronts/front/header/cart.svg" alt="" class="img" />
          </div>
          <div class="content" v-else>
            <img src="/fronts/front/header/cart.svg" alt="" class="img" />
          </div>
        </nuxt-link>
      </div>
  </div>

  <!-- <div class="space-area"></div> -->
  <div class="lower_layer" :class="{ is_show: isMenuActive }" @click="menuActive"></div>
  <div class="menu_open smart_only" :class="{ is_show: isMenuActive }">
      <div class="wrapper">
        <div class="button flex _a-center _j-between">
          <div class="login" @click="menuActive">
            <div class="inner_btn">
              <nuxt-link to="/mypage/info" class="link btn-parts flex _j-between _a-center" @click="menuActive">
                <!-- <div class="img icon_b">
                  <img src="/front/header/icon_mypage.png" alt="" />
                </div> -->
                <p class="txt">マイページ</p>
              </nuxt-link>
            </div>
          </div>
          <div class="close" @click="menuActive">
            <img src="/fronts/front/header/icon_close.svg" alt="" />
          </div>
        </div>
        <ul>
          <li v-for="menu in menus_s" :key="menu.id" @click="menuActive">
            <nuxt-link :to="menu.link" class="link flex _a-center">
              <img :src="menu.icon" alt="" />
              <p>{{ menu.name }}</p>
            </nuxt-link>
          </li>
        </ul>
          <img src="/fronts/front/header/logo.svg" alt=""/>
      </div>
  </div>

</div>
</div>
</template>
<script>
export default {
    props: {
    cartCount: "",
  },
  data() {
    return {
      menus: this.$constants.FRONTMENUS,
      menus_s: this.$constants.FRONTMENUS_S,
      childID: false,
      isMenuActive: false,
      isLogin: false
    }
  },
  methods: {
    menuActive() {
      this.isMenuActive ? this.isMenuActive = false : this.isMenuActive = true
    }
  },
}
</script>

<style lang="scss" scoped>
.space-area {
  height: 58.5px;
}

.wrapper {
  font-family: 'Noto Sans JP';
  position: relative;
  background-color: white;

  > .head {
    top: 0;
    background-color: white;
    width: 100%;
    position: fixed;
    z-index: 100;

    > .content {
      width: 100%;
      position: absolute;

      > .menu {
        width: 35px;
        height: 100%;
        margin-top: 20px;
        margin-left: 15px;
      }

      > .logo {
            position: absolute;
            margin-top: 2px;
            left: 50%;
            transform: translateX(-50%);
        > h1 {
          > img {
          width: 180px;
          margin: 20px auto;
          }
        }
      }
      > .cart-content_sp {
        width: 75px;
        height: 75px;
        > .cart {

          > .content {
            > .img {
              display: block;
              width: 35px;
              margin: 0 auto;
              padding-top: 15px;
            }
          }

          > .cart_count {
            position: relative;
            > .badge{
              font-size: 12px;
              position: absolute;
              background-color: $color-red2;
              color: white;
              border-radius: 25px;
              top: 5px;
              right: 5px;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }

  //メニュー下の背景部分
  .lower_layer {
    background-color: rgba(94, 84, 83, 0.2);
    width: 100%;
    height: 100vh;
    position: fixed;
    top: -120%;
    left: 0;
    transition: all 0.6s;
    z-index: 100;

    &.is_show {
      top: 0;
    }
  }

  .menu_open {
    background-color: white;
    width: 82%;
    height: 100vh;
    top: 0;
    left: -120%;
    position: fixed;
    z-index: 101;
    transition: all 0.4s;

    &.is_show {
      left: 0;
    }

    > .wrapper {
      padding-bottom: 40px;
      background-color: $color-wh;
      height: 100vh;
      border-radius: 5px;
      padding-top: 40px;

      > .button {
        padding: 30px;

        > .login {
          //padding: 10px 40px;
          > .inner_btn {
            > .link {
              > .img {
                //ログインアイコン
                &.icon_a {
                  width: 20px;
                  margin-left: -10px;
                }

                //マイページアイコン
                &.icon_b {
                  // width: 15px;
                }
              }
              >.txt {
                font-size: 15px;
              }
            }
          }
        }

        > .close {
          text-align: right;

          > img {
            width: 20px;
          }
        }
      }

      > ul {
        width: 85%;
        margin: 0 auto;
        margin-top: 0;
        padding-bottom: 35px;

        > li {
          position: relative;

          > .link {
            padding: 20px 20px;
            > img {
              width: 25px;
            }

            > p {
              padding-left: 22px;
              font-size: 14px;
            }
          }

          &::after {
            content: "";
            width: 100%;
            border-bottom: 1px solid $color-red2;
            position: absolute;
            left: 0;
            bottom: 0;
          }

          &:hover {
            background-color: $color-gray;
          }
        }
      }

      > img {
        display: block;
        margin: 30px auto;
        width: 45%;
      }
    }
  }
}
</style>
