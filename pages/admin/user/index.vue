<template>
  <div class="user adminContent">
    <AdminTitle :title="'ユーザ一覧'" :create_link="'/admin/user/create'" :create_btn_active="true"></AdminTitle>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="searchBox">
      <div class="box btn-shadow">
        <div class="flex _a-center">
          <div class="user">
            <label for="user">ユーザー名</label>
            <div class="input">
              <input type="text" placeholder="ユーザー名" id="user" v-model="search.name">
            </div>
          </div>

          <div class="user">
            <label for="code">ユーザーコード</label>
            <div class="input">
              <input type="text" placeholder="U00001" id="code" v-model="search.user_code">
            </div>
          </div>

          <div class="user">
            <label for="mail">メールアドレス</label>
            <div class="input">
              <input type="email" placeholder="example@co.jp" id="mail" v-model="search.email">
            </div>
          </div>

          <div class="user">
            <label for="name">所属顧客名</label>
            <div class="input">
              <input type="text" placeholder="所属顧客名" id="name" v-model="search.client_company_name">
            </div>
          </div>
          
          <div class="date">
            <label for="shopping-date">登録日</label>
            <div class="flex _a-center inner">
              <date-picker
                v-model="search.date_min"
                type="date"
                format="YYYY/MM/DD">
              </date-picker>
              <span class="tilde">〜</span>
              <date-picker
                v-model="search.date_max"
                type="date"
                format="YYYY/MM/DD">
              </date-picker>
            </div>
          </div>
        </div>
        
        <div class="searchBtn">
          <button class="circle-btn" @click="searchBtn()">上記条件で検索</button>
        </div>
      </div>
    </div>

    <p class="table_num" v-if="flag && users.length">{{$util.displayCount(users.length, perPage, currentPage)}}</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>
    <table v-if="users.length && flag" ref="list" class="user_table">
      <tbody>
        <tr>
          <th>ユーザーコード</th>
          <th>ユーザー名</th>
          <th>所属顧客名</th>
          <th>納品場所</th>
          <th>メールアドレス</th>
          <th>登録日時</th>
          <th></th>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td class="code">{{ user.user_code }}</td>
          <td class="name">{{ user.last_name }} {{ user.first_name }}</td>
          <td class="belong">{{ user.client_name }}</td>
          <td class="place">{{ user.delivery_location_name }}</td>
          <td class="mail">{{ user.email }}</td>
          <td class="date">{{$dayjs(user.created_at).format("YYYY年M月D日")}}</td>
          <td class="buttons">
            <div class="content flex _a-center">
              <div class="button edit btn-parts2 _red">
                <nuxt-link :to="`/admin/user/${user.id}`"><button>編集</button></nuxt-link>
              </div>
              <div class="button remove btn-parts2 _gray2">
                <button @click="remove(user.id)">削除</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="empty" v-else>
      ユーザーが登録されていません。
    </div>

    <client-only placeholder="Loading...">
      <paginate v-show="!this.isSearch"
      v-model="currentPage"
      :page-count="getPageCount"
      :page-range="3"
      :margin-pages="1"
      :click-handler="clickCallback"
      :prev-text="'<'"
      :next-text="'>'"
      :first-button-text="'<<'"
      :last-button-text="'>>'"
      :first-last-button="true"
      :container-class="'pagination_square flex _j-center'"
      :page-class="'pagination_item_square'"
      :prev-class="'prev_class_square'"
      :next-class="'next_class_square'"
      :page-link-class="'pagination-item_link'"
      :prev-link-class="'pagination_square_link'"
      :next-link-class="'pagination_square_link'"
      >
      </paginate>
    </client-only>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      users: [],
      clients: [],
      clientsDeliveryLocations: [],
      flag: false,
      search: {
        client_company_name: "",
        name: "",
        user_code: "",
        email: "",
        date_min: "",
        date_max: "",
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
    }
  },
  async mounted() {
    const resData = await this.$adminApi.getUsers(this.perPage, 0);

    this.users = resData.users;
    this.totalAmount = resData.totalAmount;

    let clientsData = await this.$adminApi.searchClients();
    this.clients = clientsData.clients;

    this.findName();

    this.search.date_min = this.formatDate(this.search.date_min);
    this.search.date_max = this.formatDate(this.search.date_max);
    
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
        const success = await this.$adminApi.deleteUser(id);
        if (success) {
          const offset = this.currentPage * 10 - 10;
          let userData = await this.$adminApi.getUsers(this.perPage, offset);
          this.users = userData.users;
          this.$showSuccessMessage("ユーザーを削除しました");
        }
      }
    },
    findName(){
      for(let i = 0; i < this.clients.length; i++){
        for(let j = 0; j < this.clients[i].delivery_locations.length; j++){
          this.clientsDeliveryLocations.push(this.clients[i].delivery_locations[j]);
        }
      }

      for(let i = 0; i < this.users.length; i++){
        let delivery_location = this.clientsDeliveryLocations.find((c) => c.id == this.users[i].delivery_location_id);
        if(delivery_location != undefined){
          let selectedClient = this.clients.find((c) => c.id == delivery_location.client_id);
          if(delivery_location != undefined){
            this.users[i].delivery_location_name = delivery_location.name;
          }
          if(selectedClient != undefined){
            this.users[i].client_name = selectedClient.name;
          }
        }
      }
    },

    // 検索
    async searchBtn(){
      let searchUrl;
      if(this.search.client_company_name){
        searchUrl = `client_company_name=${this.search.client_company_name}`;
      }
      if(this.search.name){
        if(searchUrl != undefined){
          searchUrl += `&name=${this.search.name}`;
        }
        else{
          searchUrl = `name=${this.search.name}`;
        }
      }
      if(this.search.user_code){
        if(searchUrl != undefined){
          searchUrl += `&user_code=${this.search.user_code}`;
        }
        else{
          searchUrl = `user_code=${this.search.user_code}`;
        }
      }
      if(this.search.email){
        if(searchUrl != undefined){
          searchUrl += `&email=${this.search.email}`;
        }
        else{
          searchUrl = `email=${this.search.email}`;
        }
      }
      if(this.search.date_min){
        this.search.date_min = this.formatDate(this.search.date_min);
        if(searchUrl != undefined){
          searchUrl += `&created_at_1=${this.search.date_min}`;
        }
        else{
          searchUrl = `created_at_1=${this.search.date_min}`;
        }
      }
      if(this.search.date_max){
        this.search.date_max = this.formatDate(this.search.date_max);
        if(searchUrl != undefined){
          searchUrl += `&created_at_2=${this.search.date_max}`;
        }
        else{
          searchUrl = `created_at_2=${this.search.date_max}`;
        }
      }
      if(searchUrl != undefined){
        let usersData = await this.$adminApi.searchUsers(searchUrl);
        this.users = usersData.users;
        this.findName();
        this.isSearch = true;

        if(usersData.created_at_1 != null){
          this.search.date_min = new Date(usersData.created_at_1);
        }
        if(usersData.created_at_2 != null){
          this.search.date_max = new Date(usersData.created_at_2);
        }
      }
      // 検索に何も入力されていなかったらページネーションごとにデータ取得
      else{
        this.isSearch = false;
        const resData = await this.$adminApi.getUsers(this.perPage, 0);
        this.users = resData.users;
        this.search = {
          date_min: "",
          date_max: "",
          client_company_name: "",
          name: "",
          user_code: "",
          email: "",
        }
      }
    },
    async clickCallback(pageNum) {
      this.usersPage = Number(pageNum);
      let offset = this.currentPage * 10 - 10;
        const userData = await this.$adminApi.getUsers(
          10,
          offset
        );
        this.users = userData.users;
      const query = Object.assign({}, this.$route.query);
      query.page = this.currentPage;
      this.$router.push({ query: query });
    },
  },
  computed:{
    getPageCount() {
      return Math.ceil(this.totalAmount / this.perPage);
    },
  },
}
</script>
<style lang="scss" scoped>
.user{
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
        > .user{
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
    border: 1px solid $color-gray;
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
    .code {
      width: 5%;
    }
    .name {
      width: 10%;
    }
    .date{
      width: 13%;
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