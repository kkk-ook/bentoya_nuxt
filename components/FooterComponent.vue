<template>
  <section class="footer-contents">
    <div class="main flex _j-between">
      <div class="side_l">
        <div class="logo">
          <img src="/fronts/front/footer/logo.svg" alt="logo" />
        </div>
        <div class="name">
          <p class="txt title">株式会社　千成</p>
          <p class="txt office">本社</p>
          <p class="txt">〒737-0822<br>広島県呉市築地町5番10号</p>
          <a href="tel:0823-27-6741" class="txt link">TEL : 0823-27-6741</a>
          <p class="txt">FAX : 0823-25-4766</p>

          <p class="txt office">広島営業所</p>
          <a href="tel:0823-27-6770" class="txt link">TEL : 0823-27-6770</a>
          <p class="txt">FAX : 0823-25-4766</p>
        </div>

        <ul class="menu_list">
          <li v-for="menu in menus" :key="menu.id" class="item">
            <nuxt-link :to=menu.link class="link">{{menu.name}}</nuxt-link>
          </li>
        </ul>
        <p class="copyright">© 2023 SENNARI GROUP. All rights reserved.</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "FooterComponent",
  data(){
    return{
      menus: this.$constants.FOOTERMENUS
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-contents {
  background-color: $color-red2;
  color: $color-wh;
  font-family: "Mincho";
  margin-top: 100px;

  > .main {
    width: 95%;
    margin: 0 auto;
    padding: 65px 0;
    @media #{$phone} {
      display: block;
    }

    > .side_l {
      > .logo{
        width: 50%;
      }
      > .name {
        margin-top: 50px;
        margin-left: 1em;
        > .txt {
          display: block;
          line-height: 1.8;
          font-size: 14px;

          &.title {
            font-size: 16px;
          }

          &.office {
            margin-top: 10px;
            font-size: 16px;
          }
        }

        a {
          &:hover {
            opacity: 0.6;
          }
        }
      }

      > .menu_list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 40px;
        width: min(100%, 400px);
        @media #{$phone} {
          width: 100%;
        }

        > .item {
          margin-top: 10px;
          font-size: 14px;
          &::before {
            content: "";
            border: 1px solid #d3d3d3;
          }

          &:nth-child(1), &:nth-child(5) {
            &::before {
              border: none;
            }
          }

          > .link {
            padding: 0 1em;
            // @include hv_opa();
            // @include hvr-grow(1.1);

          }
        }
      }

      > .copyright {
        margin-top: 20px;
        font-size: 11px;
      }
    }

    .side_r {
      //width: 50%;
      @media #{$phone} {
        margin-top: 30px;
      }

      > .title {

      }

      > .inner {
        width: 350px;
        height: 300px;
        @media #{$phone} {
          width: 100%;
        }
      }
    }
  }
}

</style>
