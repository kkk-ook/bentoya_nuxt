<template>
  <div ref="scrollElem">
    <div class="row_table">
      <div class="printing_btn_area flex _j-end print_none">
        <div class="button edit btn-parts2 _gray2">
          <div class="btn">
            <button @click="printOut">
              ユーザー集計表<br>
              印刷
            </button>
          </div>
        </div>
      </div>
      <div class="orders" v-if="!load && users.length">
        <div class="table">
          <p class="order_date">{{ deliveryDay }}　{{ weekDay }}　配送</p>
          <p class="course">{{ clientName }}：{{ deliveryName }}　ユーザー別</p>
          <table ref="list" class="order_table">
            <tbody>
              <tr>
                <th>No.</th>
                <th>ユーザーコード</th>
                <th>ユーザー名</th>
                <th>Eメール</th>
                <th v-for="(product, product_index) in products" :key="product_index">
                  <div>{{ product.abbreviated_name }}</div>
                </th>
              </tr>
              <tr v-for="(user, user_index) in users" :key="user_index">
                <td class="number">{{ user_index + 1 }}</td>
                <td class="code">{{ user.user_code }}</td>
                <td class="name">{{ user.last_name }} {{ user.first_name }}　様</td>
                <td class="email">{{ user.email }}</td>
                <td v-for="(product, product_index) in products" :key="product_index">
                  <div>{{ findProductCount(product, user.delivery_order) }}</div>
                </td>
              </tr>
              <tr>
                <td class="none"></td>
                <td class="none"></td>
                <td class="none"></td>
                <td>仮合計</td>
                <td v-for="(product, product_index) in products" :key="product_index">
                  <div>{{ findProductTotalCount(product, users.total_count) }}</div>
                </td>
              </tr>
              <tr>
                <td class="none"></td>
                <td class="none"></td>
                <td class="none"></td>
                <td>合計</td>
                <td v-for="(product, product_index) in products" :key="product_index">
                  <div>{{ findProductTotalCount(product, users.total_count) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="empty">
        ユーザーが登録されていません。
      </div>

      <div class="loader-area" v-if="load">
        <div class="loader"></div>
      </div>
      
      <!-- <client-only placeholder="Loading...">
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
      </client-only> -->
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      load: true,
      delivery_location_id: "",
      products: [],
      clients: [],
      clientName: "",
      deliveryName: "",
      users:[],
      orders: [],
      total: [],
      deliveryDay: "",
      weekDay: "",
    }
  },
  async mounted() {
    this.products = await this.$adminApi.getProducts();
    let clientsData = await this.$adminApi.searchClients();
    this.clients = clientsData.clients;

    let resData = await this.$adminApi.searchUsers();
    let usersData = resData.users;

    this.deliveryDay = atob(localStorage.getItem("day"));
    
    for(let i = 0; i < this.products.length; i++){
      this.total.push({
        total_count:0,
      });
    }

    this.delivery_location_id = this.$route.params.id;

    let orders = await this.$adminApi.getOrderDetail(this.delivery_location_id, this.deliveryDay);
    this.delivery_location_id = orders.delivery_location_id;
    let users = orders.users;

    // this.usersに情報を追加
    for(let i = 0; i < users.length; i++){
      let matched = usersData.find((u) => u.id == users[i].user_id);
      matched.delivery_order = users[i].delivery_order;
      this.users.push(matched);
    }

    for(let i = 0; i < this.clients.length; i++){
      let clientId = this.clients[i].delivery_locations.find((c) => c.id == this.delivery_location_id);
      if(clientId){
        // 納品場所取得
        this.deliveryName = clientId.name;
        let matched = this.clients.find((c) => c.id == clientId.client_id);
        // 会社名取得
        this.clientName = matched.company_name;
      }
    }

    // 商品の注文個数トータルを取ってくるときに使用
    let product_ids = [];
    for(let i = 0; i < this.products.length; i++){
      product_ids.push({
        "product_id": this.products[i].id,
        "total": 0,
      });
    }

    //商品合計数を計算
    for(let i = 0; i < this.users.length; i++){
      for(let j = 0; j < this.users[i].delivery_order.length; j++){
        let matched = product_ids.find((p) => p.product_id == this.users[i].delivery_order[j].product_id);
        let index = product_ids.findIndex((o) => o.product_id == matched.product_id);
        product_ids[index].total += this.users[i].delivery_order[j].count;
      }
    }
    this.users.total_count = product_ids;

    this.deliveryDay = orders.delivery_day;

    // deliveryDayの取得
    let week = [ "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日" ];
    this.deliveryDay = new Date(this.deliveryDay);
    let weekDay = this.deliveryDay.getDay();
    this.weekDay = week[weekDay];
    this.deliveryDay = this.formatDate(this.deliveryDay);
    this.dateSelected = this.deliveryDay;

    this.load = false;
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
    printOut() {
      window.print();
    },
    findProductCount(product, orders){
      let findItem = orders.find((o) => o.product_id == product.id);
      if(findItem != undefined){
        let order_count = findItem.count;
        return order_count;
      }
      else{
        return "0";
      }
    },
    findProductTotalCount(product, total){
      let findItem = total.find((t) => t.product_id == product.id);
      if(findItem != undefined){
        let total_count = findItem.total;
        return total_count;
      }
      else{
        return "0";
      }
    },
  }
}
</script>

<style lang="scss" scoped>
div {
  > .row_table {
    width: 80%;
    margin: 0 auto 200px;
    color: $color-txt;
    > .printing_btn_area{
      width: 150px;
      margin-left: auto;
      margin-bottom: 50px;
      > .btn-parts2{
        margin-left: 15px;
        padding: 10px 5px;
        border: 1px solid $color-txt2;
        color: $color-txt;
      }
    }

    >.orders{
      >.table{
        > .order_date{
          font-size: 14px;
          margin-top: 15px;
          margin-bottom: 5px;
        }
        > .order_table {
          margin-top: 10px;
          width: 100%;
          border:1px solid $color-gray;
          border-radius: 7px;
          border-collapse: inherit;
          overflow: hidden;
          tr:first-child th{
            background-color: $color-gray;
          }
          tbody {
            border: 1px solid $color-gray3;
          }
          th {
            font-size: 17px;
            font-family: "MinchoB";
            border: 1px solid $color-gray3;
            padding:10px 6px 10px 10px;
            white-space: nowrap;
            text-align: center;
            &:not(:last-child) {
              border-right: 0px; 
            }
          }
          td {
            font-size: 15px;
            padding:10px;
            border: 1px solid $color-gray3;
            display: table-cell;
            vertical-align: middle;
            &:not(:last-child) {
              border-right: 0px; 
            }
            border-top: 0px; 
          }
          .none{
            border: 0px;
          }
          tr {
            position: relative;
            height: 10px;
            &:last-child {
            border-bottom: none;
            }
          }
          // それぞれ幅指定
          .number{
            width: 5%;
            text-align: center;
          }
          .code {
            width: 10%;
            text-align: center;
          }
          .name {
            width: 15%;
          }
          .email{
            width: 8%;
          }
        }
      }
    }
  }
  @media print{
    .print_none{
      display: none;
    }
  }
}
</style>