<template>
  <div class="delivery adminContent">
    <AdminTitle :title="'配送コース一覧'" :create_link="'/admin/delivery/create'" :create_btn_active="true"></AdminTitle>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="searchBox">
      <div class="box btn-shadow">
        <div class="flex _a-center">
          <div class="delivery">
            <label for="course">コース名</label>
            <div class="input">
            <input type="text" placeholder="コース名" id="user" v-model="search.name">
            </div>
          </div>

          <div class="delivery">
            <label for="name">顧客名</label>
            <div class="input">
            <input type="text" placeholder="顧客名" id="code" v-model="search.client_company_name">
            </div>
          </div>
        </div>

        <div class="searchBtn">
          <button class="circle-btn" @click="searchBtn()">上記条件で検索</button>
        </div>
      </div>
    </div>

    <p class="table_num">1-10件表示</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>
    <table v-if="flag && delivery_courses.length" ref="list" class="user_table">
      <tbody>
        <tr>
          <th>コース名</th>
          <th>ドライバー</th>
          <th>顧客数</th>
          <th>登録日時</th>
          <th></th>
        </tr>
        <tr v-for="delivery in delivery_courses" :key="delivery.id">
          <td class="course">{{ delivery.name }}</td>
          <td class="course">{{ delivery.driver_name }}</td>
          <td class="number">{{ delivery.delivery_orders.length }}件</td>
          <!-- <td class="number" v-else>0件</td> -->
          <td class="date">{{$dayjs(delivery.created_at).format("YYYY年M月D日")}}</td>
          <td class="buttons">
            <div class="content flex _a-center">
              <div class="button edit btn-parts2 _red">
                <nuxt-link :to="`/admin/delivery/${delivery.id}`"><button>編集</button></nuxt-link>
              </div>
              <div class="button delete btn-parts2 _gray2">
                <button @click="remove(delivery.id)">削除</button>
              </div>
            </div>

          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-else>
      配送コースが登録されていません。
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
      delivery_courses: [],
      search: {
        name: "",
        client_company_name: "",
      },
      searchResults: [],
      selects: [],
      errorMessages: [],
      categories: [],
      searchBox: false,
      isSearch: false,
      /* ページネーション */
      perPage: 10,
      currentPage: Number(this.$route.query.page) || 1,
      totalAmount: 0,
      /* ページネーション */
      SCategoryFlag: Boolean,
      deliveryLocation: [],
    }
  },
    async mounted() {
    this.flag = false;

    this.delivery_courses = await this.$adminApi.getDelivery();
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
    // 削除
    async remove(id){
      if (confirm("本当に削除してもよろしいですか？")) {
        const success = await this.$adminApi.deleteDelivery(id);
        if (success) {
          this.delivery_courses = await this.$adminApi.getDelivery();
          this.$showSuccessMessage("コースを削除しました");
        }
      }
    },
    // 検索
    async searchBtn(){
      let searchUrl;
      let allDeliveryData = await this.$adminApi.getDelivery();
      if(this.search.name){
        searchUrl = `name=${this.search.name}`;
      }
      if(this.search.client_company_name){
        if(searchUrl != undefined){
          searchUrl += `&client_company_name=${this.search.client_company_name}`;
        }
        else{
          searchUrl = `client_company_name=${this.search.client_company_name}`;
        }
      }
      if(searchUrl != undefined){
        this.searchResults = await this.$adminApi.searchDeliveries(searchUrl);
        let findId = [];
        for(let i = 0; i < this.searchResults.length; i++){
          findId.push(this.searchResults[i].id);
        }
        let delivery_courses = [];
        for(let i = 0; i < findId.length; i++){
          let findItem = allDeliveryData.find((data) => data.id == findId[i]);
          delivery_courses.push(findItem);
        }
        this.delivery_courses = [];
        this.delivery_courses = delivery_courses;

        this.isSearch = true;
      }
      else{
        this.isSearch = false;
        this.delivery_courses = await this.$adminApi.getDelivery();
        this.search = {
          name: "",
          client_company_name: "",
        }
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.delivery{
  color: $color-txt;
  margin-bottom: 200px;
  .searchBox{
    // 検索
    border: 1px solid $color-gray2;
    border-radius: 3px;
    padding: 20px;
    margin: 30px 0;
    > .box {
      > .flex {
        flex-wrap: wrap;
        > .delivery{
          width: 48%;
          margin-right: 2%;
          margin-bottom: 15px;
          .input {
            margin-top: 10px;
            width: 95%;
            border: 1px solid $color-gray2;
            border-radius: 3px;
            padding: 5px;
            ::placeholder{
              color: $color-gray;
            }
          }
        }
        > .category{
          width: 48%;
          margin-right: 2%;
          margin-bottom: 15px;
          position: relative;
          &:after {
            content: "";
            position: absolute;
            top: 38px;
            left: 207px;
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
            width: 50%;
            border: 1px solid $color-gray2;
            border-radius: 3px;
            padding: 3px 5px;
          }
          select:invalid { color: $color-gray; }
          select option { color: $color-txt; }
          select option:first-child { color: $color-gray; }
        }
        > .price {
          width: 48%;
          margin-bottom: 15px;
          > .input-area{
            .input {
              margin-top: 10px;
              width: 30%;
              border: 1px solid $color-gray2;
              border-radius: 3px;
              padding: 5px;
              ::placeholder{
                color: $color-gray;
              }
            }
            > .yen{
              margin-left: 3px;
              align-self: flex-end;
            }
            > .tilde{
              margin: 0 10px;
              color: $color-gray;
            }
          }
        }
        > .date {
          width: 48%;
          margin-right: 2%;
          margin-bottom: 15px;
          > .inner {
            flex-wrap: nowrap;
            margin-top: 10px;
            .tilde{
              margin: 0 10px;
              color: $color-gray;
            }
          }
        }
        > .status {
          width: 48%;
          .radio {
            margin-top: 10px;
            margin-right: 10px;
          }
        }
      }
      > .searchBtn{
        margin-top: 50px;
        > .circle-btn{
          margin: 0 auto;
        }
      }
    }
  }

  >.table_num{
    font-size: 12px;
    display: inline-block;
  }

  > .user_table {
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