<template>
  <div class="client adminContent">
    <AdminTitle :title="'顧客一覧'" :create_link="'/admin/client/create'" :create_btn_active="true"></AdminTitle>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="searchBox">
      <div class="box btn-shadow">
        <div class="flex _a-center">

          <div class="client">
            <label for="code">顧客コード</label>
            <div class="input">
              <input type="text" placeholder="顧客コード" id="code" v-model="search.code">
            </div>
          </div>

          <div class="client">
            <label for="company">会社名</label>
            <div class="input">
              <input type="text" placeholder="会社名" id="company" v-model="search.company_name">
            </div>
          </div>
          
          <div class="date">
            <label for="register-date">登録日</label>
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

    <p class="table_num" v-if="flag && clients.length">{{$util.displayCount(clients.length, perPage, currentPage)}}</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>
    <table ref="list" class="client_table" v-if="flag && clients.length">
      <tbody>
        <tr>
          <th>顧客コード</th>
          <th>会社名</th>
          <th>納品場所</th>
          <th></th>
          <th>登録日時</th>
          <th></th>
        </tr>
        <tr v-for="client in clients" :key="client.id">
          <td class="code">{{ client.code }}</td>
          <td class="company">{{ client.company_name }}</td>
          <td class="place">
            <div v-for="(delivery_location, index) in client.delivery_locations" :key="index" class="inner">{{ delivery_location.name }}</div>
          </td>
          <td class="qrcode">
            <div v-for="(delivery_location, index) in client.delivery_locations" :key="index" class="button">
              <div class="button btn-parts2 _blue">
                <button @click="qrGenerate(client.code, delivery_location.id)">QRコード</button>
              </div>
            </div>
          </td>
          <td class="date">{{$dayjs(client.created_at).format("YYYY年M月D日")}}</td>
          <td class="buttons">
            <div class="content flex _a-center">
              <div class="button edit btn-parts2 _red">
                <nuxt-link :to="`/admin/client/${client.id}/`"><button>編集</button></nuxt-link>
              </div>
              <div class="button delete btn-parts2 _gray2">
                <button @click="remove(client.id, client.company_name)">削除</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty">
      顧客が登録されていません。
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
      flag: false,
      clients:[],
      search: {
        company_name: "",
        code: "",
        date_min: "",
        date_max: ""
      },
      searchResults: [],
      loaderFlag: true,
      selects: [],
      errorMessages: [],
      categories: [],
      searchBox: false,
      /* ページネーション */
      perPage: 10,
      currentPage: Number(this.$route.query.page) || 1,
      totalAmount: 0,
      isSearch: false,
      /* ページネーション */
    }
  },
  async mounted() {
    this.flag = false;

    const resData = await this.$adminApi.getClients(this.perPage, 0);

    this.clients = resData.clients;
    this.totalAmount = resData.totalAmount;

    this.loaderFlag = false;

    this.search.date_min = this.formatDate(this.search.date_min);
    this.search.date_max = this.formatDate(this.search.date_max);

    localStorage.removeItem('item');

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
    async remove(id, name){
      if (confirm("本当に削除してもよろしいですか？" + "※所属顧客名が[" + name + "]" + "に設定されているユーザーは削除されます")) {
        const success = await this.$adminApi.deleteClient(id);
        if (success) {
          const offset = this.currentPage * 10 - 10;
          let clientData = await this.$adminApi.getClients(this.perPage, offset);
          this.clients = clientData.clients;
          this.$showSuccessMessage("商品を削除しました");
        }
      }
    },
    // 検索
    async searchBtn(){
      let searchUrl;
      if(this.search.company_name){
        searchUrl = `company_name=${this.search.company_name}`;
      }
      if(this.search.code){
        if(searchUrl != undefined){
          searchUrl += `&code=${this.search.code}`;
        }
        else{
          searchUrl = `code=${this.search.code}`;
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
        let clientsData = await this.$adminApi.searchClients(searchUrl);
        this.clients = clientsData.clients;
        this.isSearch = true;

        if(clientsData.created_at_1 != null){
          this.search.date_min = new Date(clientsData.created_at_1);
        }
        if(clientsData.created_at_2 != null){
          this.search.date_max = new Date(clientsData.created_at_2);
        }
      }
      // 検索に何も入力されていなかったらページネーションごとにデータ取得
      else{
        this.isSearch = false;
        const resData = await this.$adminApi.getClients(this.perPage, 0);
        this.clients = resData.clients;
        this.search = {
          date_min: "",
          date_max: "",
          company_name: "",
          code: "",
        }
      }
    },
    async clickCallback(pageNum) {
      this.currentPage = Number(pageNum);
      let offset = this.currentPage * 10 - 10;
        const clientData = await this.$adminApi.getClients(
          10,
          offset
        );
        this.clients = clientData.clients;
      const query = Object.assign({}, this.$route.query);
      query.page = this.currentPage;
      this.$router.push({ query: query });
    },
    qrGenerate(client_code, delivery_location){
      localStorage.setItem("client", btoa(client_code));
      localStorage.setItem("location", btoa(delivery_location));
      this.$router.push({
        path: "client/qrcode",
      });
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
.client{
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
        > .client{
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
              color: $color-gray2;
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

  > .client_table {
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
    .code {
      width: 10%;
    }
    .date{
      width: 18%;
    }
    .place{
      // width: 17%;
      > .inner{
        margin-bottom: 5px;
      }
    }
    .qrcode {
      
      white-space: nowrap;
      > .button{
        margin-bottom: 5px;
        width: 120px;
        > button {
          padding: 3px 15px;
          width: 100%;
          font-size: 15px;
          height: 25px;
        }
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