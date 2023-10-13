<template>
  <div class="header">
    <div class="menu flex _a-center pc_only">
      <div class="logo">
        <img src="/fronts/front/header/logo.svg" alt="logo" />
      </div>
      <ul class="menu-list flex _a-center">
        <li class="menu-item _hover" v-for="(menu, menuIndex) in menus" :key="menuIndex" @mouseover="childID = menu.id" @mouseleave="childID = ''">
          <nuxt-link :to="menu.link" class="content">
            <div class="icon cart_count" v-if="(menus.length - 1) == menuIndex && Number(cartCount) > 0">
              <p class="badge">{{ Number(cartCount) }}</p>
              <img :src="menu.icon" alt="icon" />
            </div>
            <div class="icon" v-else>
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
      <div class="menu-list_my">
        <p class="list-name">{{ user.last_name }} {{ user.first_name }} 様</p>
        <nuxt-link :to="`/mypage/info`">マイページ</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cartCount: ""
  },
  data() {
    return {
      isLogin: false,
      menus: this.$constants.FRONTMENUS,
      user: [],
    };
  },
  async mounted() {
    let data = await this.$frontApi.getUserState();

    if(!data.errorMessages.length){
      this.user = data.user;
    }
    else{
      this.$util.isLostLogin();
    }
  },
};
</script>

<style lang="scss" scoped>
.header{
  margin-bottom: 20px;
  .menu {
    font-family: 'Noto Sans JP'; 
    font-weight: bold;
    margin: 20px auto 0;
    width: min(100%,1300px);

    > .logo {
      margin-left: 2.5%;
      > img{
        width: clamp(210px,32vw,330px);
      }
    }
    > .menu-list {
      margin: 0 auto;
      > .menu-item {
        > .content {
          display: block;
          font-size: 14px;
          width: 85px;
          text-align: center;
          > .icon{
            margin-bottom: 5px;
            > img{
              width: 25px;
              height: 25px;
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
              top: -5px;
              right: 15px;
              width: 16px;
              height: 16px;
            }
          }
          > .name{
            font-size: 12px;
          }
        }
          > .child-list {
          width: 100%;
          position: absolute;
          left: 20px;
          > .child-item {
            display: block;
            margin-top: 10px;
            padding: 8px 12px;
            width: 100%;

            &:hover{
              background-color: $color-red2;
              color: $color-wh;
            }
            &:last-child{
              margin-top: 0;
            }
          }
        }
      }
    }
    > .content{
      width: 270px;
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
    >.menu-list_my {
      font-size: 14px;
      margin-right: 2.5%;
      >.list-name {
        margin-bottom: 10px;
      }
    }
  }
}

</style>
