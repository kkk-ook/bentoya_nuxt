<template>
  <div class="title flex _a-center">
    <p class="name">{{ title }}</p>
    <nuxt-link :to="create_link" v-if="create_btn_active"><button class="square-btn">新規登録</button></nuxt-link>
  </div>
</template>

<script>
export default {
    props: {
      title: "",
      create_link: "",
      create_btn_active: Boolean,
    },
  }
</script>

<style lang="scss" scoped>
.title{
  > .name{
    font-size: 30px;
    margin-right: 30px;
    border-left:7px solid $color-red; /*線の設定*/
    padding:2px 10px; /*余白の設定*/
  }
  > .square-btn{
    font-size: 16px;
    padding: 4px;
    height: 27px;
  }
}
</style>