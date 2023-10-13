<template>
  <div class="holiday adminContent">
    <AdminTitle :title="'休日設定'" :create_btn_active="false"></AdminTitle>
    <div class="calendar-block">
      <AdminCalendarComponent></AdminCalendarComponent>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
};
</script>

<style lang="scss" scoped>
div {
  .holiday {
    color: $color-txt;
    margin-bottom: 200px;
    > .title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 50px;
    }
  }
}
</style>
