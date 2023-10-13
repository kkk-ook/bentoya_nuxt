
<template>
  <div>
    <HeaderComponent class="pc_only" :cartCount="cartCount"></HeaderComponent>
    <HeaderSComponent class="smart_only" :cartCount="cartCount"></HeaderSComponent>
    <nuxt/>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script>
import {mapState} from "vuex";
export default {
  head() {
    return {
      // link: [
      //   { rel: 'canonical', href: "http://sennari.com/"},
      // ],
    }
  },
  computed: {
    ...mapState({
      cartCount: state => state.cart.cartCount
    })
  },
  methods: {
    animationHandler(array, addClass) {
      for (let i = 0; i < array.length; i++) {
        const rectTop = array[i].getBoundingClientRect().top;
        const wh = window.innerHeight;
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
          if (wh / 7 * 6 > rectTop) {
            array[i].classList.add(addClass);
          }
        } else {
          if (wh / 4 * 3 > rectTop) {
            array[i].classList.add(addClass);
          }
        }
      }
    },
    scrollEvent() {
      let slideUp = document.getElementsByClassName("effect-fade");
      this.animationHandler(slideUp, "effect-show");
    }
  },
  async mounted() {

    // let cartItems = [];
    window.onload = this.scrollEvent;
    window.addEventListener("scroll", this.scrollEvent);
    // if (this.$util.isLogin()) {
    //   // cartItems = await this.$frontApi.getCarts();
    //   // this.$store.commit('cart/setCarts', cartItems.length)
    // } else {
    //   // ログインしていない時はローカルストレージを見る
    //   // cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // }
  },
};
</script>
