<template>
  <div class="order adminContent">
    <AdminTitle :title="'キャンセル一覧'" :create_btn_active="false"></AdminTitle>
    <SuccessFlash class="successMessage"></SuccessFlash>
    <div class="searchBox">
      <div class="box btn-shadow">
        <div class="flex _a-center">

          <div class="date">
            <label for="register-date">配送日</label>
            <div class="flex _a-center inner">
              <date-picker
                ref="datepicker"
                v-model="search.date"
                type="date"
                format="YYYY/MM/DD">
              </date-picker>
            </div>
          </div>

          <div class="client">
            <label for="code">配送コース</label>
            <div class="input">
              <input type="text" placeholder="配送コース" id="course" v-model="search.course">
            </div>
          </div>

          <div class="client">
            <label for="company">顧客名</label>
            <div class="input">
              <input type="text" placeholder="顧客名" id="company" v-model="search.company_name">
            </div>
          </div> 

          <div class="client">
            <label for="code">顧客コード</label>
            <div class="input">
              <input type="text" placeholder="顧客コード" id="code" v-model="search.code">
            </div>
          </div>

        </div>
          <div class="searchBtn">
            <button class="circle-btn" @click="searchBtn()">上記条件で検索</button>
          </div>
      </div>
    </div>

    <div class="course_null" v-if="courseNull.length && flag">
      <p class="warning">コース未登録の顧客が{{courseNull.length}}件あります。コースを設定してください。</p>
      <div class="inner" v-for="(course, course_index) in courseNull" :key="course_index">
      <p>・{{course.client_name}} {{course.delivery_location_name}}</p>
      </div>
    </div>

    <p class="table_num" v-if="flag && orders.length || delimitedData.length">{{ totalAmount }}件表示中</p>
    <div class="loader-area" v-if="!flag">
      <div class="loader"></div>
    </div>

    <div class="orders" v-if="flag && delimitedData.length && !isPrinting">
      <div class="table" v-for="(order, order_index) in delimitedData" :key="order_index">
        <p class="order_date">{{ deliveryDay }}　{{ weekDay }}　配送</p>
        <p class="course" v-if="order.driver_name">コース：{{ order.course_name }}　{{ order.driver_name }}</p>
        <p class="course" v-else>コース：{{ order.course_name }}　担当者が設定されていません</p>
        <div class="flex">
          <div class="inner">
            <table ref="list" class="order_table">
              <tbody>
                <tr>
                  <th>No.</th>
                  <th>コード</th>
                  <th>顧客名</th>
                  <th>納品場所</th>
                  <th>電話番号</th>
                  <th v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ product.abbreviated_name }}</div>
                  </th>
                  <th></th>
                </tr>
                <tr v-for="(delivery_order, delivery_order_index) in order.detail" :key="delivery_order_index">
                  <td class="number">{{ delivery_order_index + 1 }}</td>
                  <td class="code">{{ delivery_order.client_code }}</td>
                  <td class="name">{{ delivery_order.client_name }}</td>
                  <td class="location">{{ delivery_order.delivery_location_name }}</td>
                  <td class="tel">{{ delivery_order.client_tel }}</td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ findProductCount(product, delivery_order.order_count_by_products) }}</div>
                  </td>
                  <td class="detail">
                    <div class="button edit btn-parts2 _red">
                      <button @click="toDetailPage(delivery_order.delivery_location_id)">詳細</button>
                    </div>
                  </td>
                </tr>
                <!-- データ数50件以下でも50件表示させる場合 -->
                <!-- <tr v-for="(n, n_index) in 50 - order.detail.length" :key="n_index">
                  <td class="number">{{ n_index + order.detail.length + 1 }}</td>
                  <td class="code"></td>
                  <td class="name"></td>
                  <td class="location"></td>
                  <td class="tel"></td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                  </td>
                </tr> -->
                <tr>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td>仮合計</td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ findProductTotalCount(product, order.total_count) }}</div>
                  </td>
                  <td class=""></td>
                </tr>
                <tr>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td>合計</td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ findProductTotalCount(product, order.total_count) }}</div>
                  </td>
                  <td class=""></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="right">
            <table ref="list" class="order_table">
              <tbody>
                <tr class="tr">
                  <th></th>
                </tr>
                <tr class="btn_area" v-for="(delivery_order, printing_index) in order.detail" :key="printing_index">
                  <td class="detail">
                    <div class="button edit btn-parts2 _red">
                      <button @click="toDetailPage(delivery_order.delivery_location_id)">詳細</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </div>
      </div>
    </div>
    
    <div v-else-if="flag && !delimitedData.length && !orders.length" class="empty">
      キャンセルはありません
    </div>

    <!-- <client-only placeholder="Loading...">
      <paginate
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
</template>

<script>
// import { log } from '@chenfengyuan/vue-qrcode';
export default {
  layout: "admin",
  data() {
    return {
      flag: false,
      search: {
        date: "",
        course: "",
        company_name: "",
        code: "",
      },
      orders: [],
      ordersData: [],
      deliveries: [],
      products: [],
      clients: [],
      printErrorMessages: [],
      printData:[],
      usersOrderPrintData: [],
      orderPrintData: [],
      isSearch: false,
      isPrinting: false,
      dateSelected: "",
      deliveryDay: "",
      weekDay: "",
      delivery_locations: [],
      delimitedData: [],
      courseNull: [],
      today: "",
      /* ページネーション */
      // perPage: 1,
      // currentPage: Number(this.$route.query.page) || 1,
      // totalAmount: 0,
      /* ページネーション */
    }
  },
  async mounted() {
    this.deliveries = await this.$adminApi.getDelivery();
    this.products = await this.$adminApi.getProducts();
    let clientsData = await this.$adminApi.searchClients();
    this.clients = clientsData.clients;
    this.today = await this.$adminApi.getDate();

    this.ordersData = await this.$adminApi.getOrderCancels(); 

    this.search.date = this.formatDate(this.search.date);

    localStorage.removeItem('day');

    this.getOrdersDate();

    // 最初に読み込んだときのデータ。検索、プリントのとき以外はdelimitedDataが表示される
    if(this.orders.length){
      this.delimitedData.push(this.orders[0]);
    }

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

    getOrdersDate(){
      this.delimitedData = [];
      this.orders = [];

       // delivery_course_idの追加
      for(let i = 0; i < this.ordersData.length; i++){
        let matched = this.deliveries.find((d) => d.id == this.ordersData[i].delivery_course_id);
        if(matched != undefined){
          if(this.orders.length > 0){
            let judge = this.orders.find((o) => o.id == matched.id);
            // すでに同じdelivery_course_idが追加されている場合は追加しない
            if(judge == undefined){
              this.orders.push({"id": matched.id});
            }
          }
          // 1回目のループは必ずこっち
          else{
            this.orders.push({"id": matched.id});
          }
        }
      }

      // delivery_locationsは顧客関連の情報を探すときに使用する
      for(let i = 0; i < this.clients.length; i++){
        for(let j = 0; j < this.clients[i].delivery_locations.length; j++){
          this.delivery_locations.push(this.clients[i].delivery_locations[j]);
        }
      }
      
      this.courseNull = this.ordersData.filter((o) => o.delivery_course_id == null);
      if(this.courseNull.length > 0){
        for(let i = 0; i < this.courseNull.length; i++){
          this.findClient(this.courseNull[i].delivery_location_id, i);
        }
      }
      
      if(this.orders.length > 0){
        for(let i = 0; i < this.orders.length; i++){
          // コースの名前を追加
          let course_name = this.deliveries.find((d) => d.id == this.orders[i].id);
          this.orders[i].course_name = course_name.name;
          // ドライバー名取得
          let driver = this.ordersData.find((o) => o.delivery_course_id == this.orders[i].id);
          this.orders[i].driver_name = driver.driver_name;
          // 詳細情報追加
          let matched = this.ordersData.filter((o) => o.delivery_course_id == this.orders[i].id);
          // idが一致した配列のインデックスを取得
          let index = this.orders.findIndex((o) => o.id == this.orders[i].id);

          this.$set(this.orders[index], "detail", []);
          for(let j = 0; j < matched.length; j++){
            this.orders[index].detail.push({
              "position": matched[j].delivery_order_position,
              "delivery_location_id": matched[j].delivery_location_id,
              "order_count_by_products": matched[j].order_count_by_products,
            });
          }
          
          // コースごとの商品注文個数トータルを取ってくるときに使用
          let product_ids = [];
          for(let i = 0; i < this.products.length; i++){
            product_ids.push({
              "product_id": this.products[i].id,
              "total": 0,
            });
          }
  
          //コースごとに商品合計数を計算
          for(let j = 0; j < this.orders[i].detail.length; j++){
            for(let k = 0; k < this.orders[i].detail[j].order_count_by_products.length; k++){
              let matched = product_ids.find((p) => p.product_id == this.orders[i].detail[j].order_count_by_products[k].product_id);
              let index = product_ids.findIndex((o) => o.product_id == matched.product_id);
              product_ids[index].total += this.orders[i].detail[j].order_count_by_products[k].count;
            }
          }
          this.orders[i].total_count = product_ids;
  
          // コード・顧客名・納品場所・電話番号取ってくる
          if(this.orders[i].detail.length != 0){
            for(let j = 0; j < this.orders[i].detail.length; j++){
              let delivery_matched = this.delivery_locations.find((d) => d.id == this.orders[i].detail[j].delivery_location_id);
              if(delivery_matched != undefined){
                let client_matched = this.clients.find((c) => c.id == delivery_matched.client_id);
                if(client_matched != undefined){
                  this.orders[i].detail[j].client_code = client_matched.code;
                  this.orders[i].detail[j].client_name = client_matched.name;
                  this.orders[i].detail[j].delivery_location_name = delivery_matched.name;
                  this.orders[i].detail[j].client_tel = client_matched.tel;
                }
                else{
                  this.orders[i].detail[j].client_name = "削除済の顧客です";
                }
              }
            }
          }
        }
  
        // positionの数値が小さい順に並べ替え
        // ソートできてるか怪しいかも？後で確認
        for(let i = 0; i < this.orders.length; i++){
          this.orders[i].detail.sort(function (a, b) {
            // a-bの差が正(＋)のとき、aをbの後ろに並べ替え
            // a-bの差が負(－)のとき、aをbの前に並べ替え
            return a - b;
          });
        }
  
        // deliveryDayの取得
        let week = [ "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日" ];
        if(!this.isSearch){
          this.deliveryDay = new Date(this.today);
        }
        // 検索している場合
        else{
          this.deliveryDay = new Date(this.deliveryDay);
        }
        let weekDay = this.deliveryDay.getDay();
        this.weekDay = week[weekDay];
        this.deliveryDay = this.formatDate(this.deliveryDay);
        this.dateSelected = this.deliveryDay;
  
        // ページネーショントータル
        this.totalAmount = this.orders.length;
      }
    },

    // 詳細ページへ(ページネーション解除されるため、別タブで開くよう設定)
    toDetailPage(delivery_order){
      localStorage.setItem("day", btoa(this.deliveryDay));
      let openTab = this.$router.resolve(`/admin/order/${delivery_order}`);
      window.open(openTab.href, '_blank');
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

    // 検索
    async searchBtn(){
      let searchUrl;
      this.delimitedData = [];
      if(this.search.date){
        this.search.date = this.formatDate(this.search.date);
        this.dateSelected = this.search.date;
        searchUrl = `delivery_day=${this.search.date}`;
      }
      else{
        this.dateSelected = "";
      }
      if(this.search.course){
        if(searchUrl != undefined){
          searchUrl += `&delivery_course=${this.search.course}`;
        }
        else{
          searchUrl = `delivery_course=${this.search.course}`;
        }
      }
      if(this.search.company_name){
        if(searchUrl != undefined){
          searchUrl += `&client_name=${this.search.company_name}`;
        }
        else{
          searchUrl = `client_name=${this.search.company_name}`;
        }
      }
      if(this.search.code){
        if(searchUrl != undefined){
          searchUrl += `&client_code=${this.search.code}`;
        }
        else{
          searchUrl = `client_code=${this.search.code}`;
        }
      }
      if(searchUrl != undefined){
        this.isSearch = true;
        let resData = await this.$adminApi.searchOrderCancels(searchUrl);
        this.ordersData = resData.order;
        if(this.ordersData.length){
          this.deliveryDay = new Date(resData.delivery_day);
          this.getOrdersDate();
          this.courseNull = this.ordersData.filter((o) => o.delivery_course_id == null);
          this.delimitedData = [];
          this.delimitedData.push(this.orders[0]);
        }
        else{
          this.orders = [];
        }

        if(resData.delivery_day != null){
          this.search.date = new Date(resData.delivery_day);
        }

      }
      // 検索に何も入力されていなかったら今日のorderを取得
      else{
        this.$router.push("/admin/cancel");
        this.dateSelected = this.deliveryDay;
      }
    },
    async clickCallback(pageNum) {
        this.delimitedData = [];
        let currentPage = Number(pageNum);
        let query = Object.assign({}, this.$route.query);
        query.page = currentPage;
        // this.$router.push({ query: query });

        this.delimitedData.push(this.orders[currentPage - 1]);
    },
    findClient(location_id, index){
      for(let i = 0; i < this.courseNull.length; i++){
        let delivery_matched = this.delivery_locations.find((d) => d.id == location_id);
        if(delivery_matched != undefined){
          let client_matched = this.clients.find((c) => c.id == delivery_matched.client_id);
          if(client_matched != undefined){
            this.courseNull[index].client_name = client_matched.name;
            this.courseNull[index].delivery_location_name = delivery_matched.name;
          }
        }
      }
    }
  },
  // computed:{
  //   getPageCount() {
  //     return Math.ceil(this.totalAmount / this.perPage);
  //   },
  // },
}
</script>

<style lang="scss" scoped>
.order{
  color: $color-txt;
  margin-bottom: 200px;
  > .printing_btn_area{
    width: 300px;
    margin-left: auto;
    > .btn-parts2{
      margin-left: 15px;
      padding: 3px 4px;
      border: 1px solid $color-txt2;
      color: $color-txt;
    }
  }
  .searchBox{
    // 検索
    border: 1px solid $color-gray2;
    border-radius: 3px;
    padding: 20px;
    margin: 50px 0 30px;
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

  .course_null{
    margin: 50px auto;
    color: $color-red;
    font-weight: bold;
    font-size: 20px;
    border: 1px solid $color-red;
    padding: 30px;
    > .inner{
      font-size: 16px;
      margin-top: 20px;
      color: $color-txt;
      border-bottom: 1px solid $color-gray;
      padding-bottom: 2px;
    }
  }

  >.table_num{
    font-size: 12px;
    display: inline-block;
  }

  >.orders{
    >.table{
      > .order_date{
        font-size: 14px;
        margin-top: 15px;
        margin-bottom: 5px;
      }
      .inner{
        width: 100%;
        > .order_table {
          margin-top: 10px;
          width: 100%;
          border:1px solid $color-gray;
          border-radius: 7px;
          border-collapse: separate;
          overflow: hidden;
          tr:first-child th{
            background-color: $color-gray;
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
          .detail{
            width:10%;
            padding:10px 1px;
            > .button{
              width: 70px;
              padding: 5px 0;
            }
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
          .name, .location {
            width: 15%;
          }
          .tel{
            width: 8%;
          }
        }
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

@media print {
  .order > :not(.print-area) {
    display: none;
  }
}
</style>