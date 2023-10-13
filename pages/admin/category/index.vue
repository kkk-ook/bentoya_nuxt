<template>
  <div class="category adminContent">
    <AdminTitle :title="'カテゴリ一覧'" :create_link="'/admin/category/create'" :create_btn_active="true"></AdminTitle>
    <SuccessFlash class="successMessage"></SuccessFlash>

    <p class="table_num" v-if="categories.length">1-{{ categories.length }}件表示</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>
    <table v-if="categories.length" ref="list" class="product_table">
      <tbody>
        <tr>
          <th>カテゴリ名</th>
          <th>画像</th>
          <th>説明</th>
          <th>登録日時</th>
          <th>締め日時</th>
          <th></th>
        </tr>
        <tr v-for="category in categories" :key="category.id">
          <td class="category">
            <div class="categories flex_column _j-between">
              <p class="lCategory">{{ category.name }}</p>
            </div>
          </td>
          <td class="img">
            <img :src="category.image.url" alt="">
          </td>
          <td class="description">{{ category.description }}</td>
          <td class="date">{{$dayjs(category.created_at).format("YYYY年M月D日")}}</td>
          <td class="date" v-if="category.is_same_day_reservation">当日{{category.closing_time}}</td>
          <td class="date" v-else>前日{{category.closing_time}}</td>
          <td class="buttons">
            <div class="content flex _a-center">
              <div class="button edit btn-parts2 _red">
                <nuxt-link :to="`/admin/category/${category.id}`"><button>編集</button></nuxt-link>
              </div>
              <div class="button delete btn-parts2 _gray2">
                <button @click="remove(category.id, category.name)">削除</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-else>
      カテゴリーが登録されていません。
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      flag: false,
      isShowCategory: false,
      categories: {},
      calendar:{
        date_min: "",
        date_max: ""
      },
      search: {
        categories: [
          {
            primary_id: null,
            secondary_id: null,
            tertiary_id: null,
          }
        ],
      },
      selects: [],
      errorMessages: [],
      searchBox: false,
      isSearch: false,
    }
  },
  async mounted() {
    this.flag = false;
    this.categories = await this.$adminApi.getCategories();

    this.calendar.date_min = this.formatDate(this.calendar.date_min);
    this.calendar.date_max = this.formatDate(this.calendar.date_max);

    this.flag = true;
  },
  methods:{
    formatDate(date) {
      if (date) {
          let month = date.getMonth() + 1;
          let day = date.getDate();
          month = ("0" + month).slice(-2);
          day = ("0" + day).slice(-2);
          let formatted = date.getFullYear() +  "-" + month + "-" + day;
          return formatted;
      }
      return date;
    },
    async remove(id, name){
      if (confirm("本当に削除してもよろしいですか？" + "※カテゴリーが[" + name + "]" + "に設定されている商品は削除されます")) {
        const success = await this.$adminApi.deleteCategory(id);
        if (success) {
          this.categories = await this.$adminApi.getCategories();
          this.$showSuccessMessage("カテゴリを削除しました");
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.category{
  color: $color-txt;
  margin-bottom: 200px;
  .searchBox{
    // 検索
    border: 1px solid $color-gray;
    border-radius: 3px;
    padding: 20px;
    margin: 30px 0;
    > .box {
      > .flex {
        flex-wrap: wrap;
        > .category{
          width: 100%;
          margin-right: 2%;
          margin-bottom: 15px;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            top: 39px;
            right: 10px;
            display: inline-block;
            vertical-align: middle;
            color: #333;
            line-height: 1;
            width: 0;
            height: 0;
            border-style: solid;
            border-color: transparent;
            border-width: 6px 4px;
            border-top-color: currentColor;
            border-bottom: 0;
            pointer-events: none;
          }
          label{
            display: block;
          }
          select {
            margin-top: 10px;
            width: 100%;
            border: 1px solid $color-gray;
            border-radius: 3px;
            padding: 3px 5px;
          }
          select:invalid { color: $color-gray; }
          select option { color: $color-txt; }
          select option:first-child { color: $color-gray; }
        }
      }
      > .searchBtn{
        margin-top: 25px;
        > .circle-btn{
          margin: 0 auto;
        }
      }
    }
  }

  >.table_num{
    margin-top: 30px;
    font-size: 12px;
    display: inline-block;
  }

  > .product_table {
    margin-top: 10px;
    width: 100%;
    border:1px solid $color-gray;
    border-radius: 7px;
    border-collapse: separate;
    overflow: hidden;
    tr:last-child th,
    tr:last-child td {
      border-bottom: none;
    }
    tr:first-child th{
      background-color: $color-gray;
    }

    th {
      font-size: 17px;
      font-family: "MinchoB";
      border-bottom: 1px solid $color-gray;
      padding:20px 6px 20px 10px;
      white-space: nowrap;
    }
    td {
      font-size: 15px;
      padding:10px;
      border-bottom: 1px solid $color-gray;
      display: table-cell;
      vertical-align: middle;
    }
    tr {
      position: relative;
      height: 110px;
      &:last-child {
      border-bottom: none;
      }
      &:first-child {
      height: 50px;
      }
    }
    // それぞれ幅指定
    .category {
      width: 12%;
      > .categories {
        width: 100%;
        > p {
          height: 25px;
          padding: 4px 6px;
          &:not(:first-child) {
            margin-top: 8px;
          }
          &.nullCategory {
            background-color: $color-red;
            color: white;
          }
        }
      }
    }
    .img {
      width: 10%;
      > img {
        width: 90%;
        aspect-ratio: 1;
        object-fit: cover;
      }
    }
    .buttons {
      width: 150px;
      white-space: nowrap;
      button {
        padding: 3px 15px;
        width: 100%;
        font-size: 15px;
        height: 25px;
      }
      .edit{
        margin-right: 5px;
      }
      > .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
      }
    }
  }
  > .empty {
    margin: 80px 0 50px;
    text-align: center;
  }
  > .btn {
    margin-bottom: 80px;
  }
}
</style>