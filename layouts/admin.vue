<template>
<div class="adminLayout">
  <div class="menu flex print_none">
    <div class="logo">
      <img src="/admin/logo_header.svg" alt="logo" />
    </div>
    <ul class="menu-list flex">
      <li class="menu-item _hover" v-for="menu in menus" :key="menu.id" @mouseover="childID = menu.id" @mouseleave="childID = ''">
        <nuxt-link :to="menu.link" class="content">
          <div class="icon">
            <img :src="menu.icon" alt="icon" />
          </div>
          <div class="name">
            {{ menu.name }}
          </div>
        </nuxt-link>
        <ul class="child-list" v-show="menu.child && childID == menu.id">
          <li class="child-item _hover" v-for="menuChild in menu.child" :key="menuChild.id">
            <nuxt-link :to="menuChild.link" class="child-link">{{ menuChild.name }}</nuxt-link>
          </li>
        </ul>
      </li>
    </ul>
    <div class="content">
      <div class="account flex _a-center">
        <p class="loginUser" v-if="!load">{{ administrator.name }}</p>
        <button class="logout _hoverOpacity"  @click="$adminApi.logout($event)">ログアウト</button>
      </div>
    </div>
  </div>
  <div class="content">
    <div class="wrapper">
      <nuxt/>
    </div>
  </div>
</div>
</template>

<script>
export default {
  head() {
    return {
      meta: [{ hid: "robots", name: "robots", content: "noindex, nofollow" }],
    };
  },
  data() {
    return {
      menus: this.$constants.ADMINMENUS,
      childID: false,
      load: true,
      administrator: "",
    }
  },
  async mounted(){
    this.$util.isAdminLogin();

    this.administrator = await this.$adminApi.getAdministratorState();

    this.load = false;
  }

}
</script>

<style lang="scss" scoped>
.menu {
  background-color: $color-wh;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 4;

  > .logo {
    margin-left: 10px;
    margin-top: 10px;
    width: 200px;
    height: 50px;
    > img{
      width: 60px;
      height: 60px;
    }
  }
  > .menu-list {
    margin: 0 auto;
    > .menu-item {
      padding: 15px 0;
      position: relative;
      > .content {
        display: block;
        font-size: 14px;
        width: 100px;
        text-align: center;
        > .icon{
          margin-bottom: 5px;
          > img{
            width: 25px;
            height: 25px;
          }
        }
        > .name{
          font-size: 18px;
        }
      }
        > .child-list {
        width: 100%;
        position: absolute;
        left: 20px;
        > .child-item {
          display: block;
          padding: 8px 10px;
          width: 100%;

          &:hover{
            background-color: $color-red;
            color: $color-wh;
          }
          &:first-child{
            margin-top: 10px;
          }
        }
      }
    }
  }
  > .content{
    margin-right: 10px;
    margin-top: 25px;
    
    > .account{
      font-size: 18px;
      > .loginUser{
        margin-right: 20px;
      }
      > .logout{
        border: 1px solid $color-gray;
        border-radius: 5px;
        padding: 4px 6px;
      }
    }
  }
}
// 印刷する際はHeader消す
@media print{
  .print_none{
    display: none;
  }
}
</style>
