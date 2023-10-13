<template>
  <div class="breadcrumb wrapper flex _a-center">
    <ul class="list flex _a-center">
      <li class="item flex _a-center">
        <nuxt-link to="/">
          <p>ホーム<span>＞</span></p>
        </nuxt-link>
      </li>
      <li v-for="(pan, index) in pans" :key="pan.path" class="item flex _a-center">
        <nuxt-link v-if="index != pans.length - 1" :to="pan.path">
          <p>{{ pan.name }}<span>＞</span></p>
        </nuxt-link>
        <p v-else>{{ pan.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    pans: Array,
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  > .list {
    padding: 15px 0 60px 0;
    flex-wrap: wrap;
    @media #{$phone} {
      padding: 30px 20px 20px;
    }
    > .item {
      line-height: 1.4;
      p {
        font-size: 15px;
        @media #{$phone} {
          font-size: 12px;
        }
        > span {
          padding-left: 6px;
        }
      }
      &:last-child {
        > p {
          > span {
            display: none;
          }
        }
      }

      &:not(:first-child) {
        padding-left: 6px;
      }
    }
  }
}
</style>
