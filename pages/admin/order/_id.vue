<template>
  <div>
    <div class="header_inner print_none">
      <p class="header_title">顧客別ユーザー集計表</p>
    </div>
    <AdminOrderDetail
    :edit = false></AdminOrderDetail>
  </div>
</template>

<script>
export default {
  layout: "admin",
}
</script>

<style lang="scss" scoped>
div {
  > .header_inner{
    width: 80%;
    margin: 0 auto;
    margin-top: 200px;
  }
  > .header_title {
    margin-left: 10px;
    font-size: 30px;
    margin-right: 30px;
    border-left:7px solid $color-red; /*線の設定*/
    padding:2px 10px; /*余白の設定*/
  }
  @media print{
    .print_none{
      display: none;
    }
  }
}
</style>