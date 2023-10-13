<template>
  <div class="administrators adminContent">
    <AdminTitle :title="'管理者一覧'" :create_link="'/admin/setting/create'" :create_btn_active="true"></AdminTitle>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <ErrorFlash :errorMessages="errorMessages" class="errorMessage"></ErrorFlash>

    <p class="table_num" v-if="administrators.length">1-{{ administrators.length }}件表示</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>
    <table v-if="flag && administrators.length" class="administrator_table">
      <tbody>
        <tr>
          <th>管理者コード</th>
          <th>管理者</th>
          <th>メールアドレス</th>
          <th>登録日時</th>
          <th></th>
        </tr>
        <tr v-for="administrator in administrators" :key="administrator.id">
          <td class="course">{{ administrator.id }}</td>
          <td class="course">{{ administrator.name }}</td>
          <td class="number">{{ administrator.email }}</td>
          <td class="date">{{$dayjs(administrator.created_at).format("YYYY年M月D日")}}</td>
          <td class="buttons">
            <div class="content flex _a-center">
              <div class="button edit btn-parts2 _red">
                <nuxt-link :to="`/admin/setting/${administrator.id}`"><button>編集</button></nuxt-link>
              </div>
              <div class="button delete btn-parts2 _gray2">
                <button @click="remove(administrator.id)">削除</button>
              </div>
            </div>

          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-else>
      商品が登録されていません。
    </div>

  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      errorMessages: [],
      searchBox: false,
      flag: false,
      search: {
        name: "",
        email: "",
        date_min: "",
        date_max: "",
      },
      administrators: [],
      totalAmount: 0,
    }
  },
  async mounted(){
    this.flag = false;

    this.administrators = await this.$adminApi.getAdministrators();
    this.totalAmount = this.administrators.length;

    this.flag = true;
  },
  methods: {
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
    async remove(id){
      if (confirm("本当に削除してもよろしいですか？")) {
        this.errorMessages = await this.$adminApi.deleteAdministrators(id);
        if (!this.errorMessages.length) {
          this.administrators = await this.$adminApi.getAdministrators();
          this.$showSuccessMessage("管理者を削除しました");
        }
        else{
          this.$util.scrollToTop();
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.administrators{
  color: $color-txt;
  margin-bottom: 200px;

  > .errorMessage {
    position: fixed;
    width: 80%;
    z-index: 2;
    top: 100px;
    animation: slideIn2 2s;
    @media #{$phone} {
      top: auto;
      bottom: 20px;
      z-index: 1000;
      font-size: 12px;
      animation: slideUp 2s;
    }
  }

  >.table_num{
    margin-top: 30px;
    font-size: 12px;
    display: inline-block;
  }

  > .administrator_table {
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
    .course {
      width: 20%;
    }
    .manager {
      width: 30%;
    }
    .date{
      width: 15%;
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