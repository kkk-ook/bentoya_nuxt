<template>
<!-- ユーザー詳細印刷 -->
  <div class="print-area">
    <template v-if="usersOrderPrintData.length">
      <section class="result-contents users-detail" v-for="(orders, orders_index) in usersOrderPrintData" :key="orders_index">
        <p class="order_date">{{ deliveryDay }}　{{ weekDay }}　配送</p>
        <p class="course">{{ orders.client_name }} {{ orders.delivery_location_name }}　ユーザー別</p>
        <table class="info-table">
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
            <tr v-for="(user, index) in orders.users" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ user.code }}</td>
              <td>{{ user.name }} 様</td>
              <td>{{ user.email }}</td>
              <th v-for="(product, product_index) in products" :key="product_index">
                <div>{{ findProductCount(product, user.delivery_order) }}</div>
              </th>
            </tr>
            <tr>
              <td class="none"></td>
              <td class="none"></td>
              <td class="none"></td>
              <td>仮合計</td>
              <td v-for="(product, product_index) in products" :key="product_index">
                <div>{{ findProductTotalCount(product, orders.total_count) }}</div>
              </td>
            </tr>
            <tr>
              <td class="none"></td>
              <td class="none"></td>
              <td class="none"></td>
              <td>合計</td>
              <td v-for="(product, product_index) in products" :key="product_index">
                <div>{{ findProductTotalCount(product, orders.total_count) }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>

<!-- オーダ一覧印刷 -->
    <template v-if="orderPrintData.length">
      <div class="result-contents orders-list" v-for="(orders, order_index) in orderPrintData" :key="order_index">
        <p class="order_date">{{ deliveryDay }}　{{ weekDay }}　配送</p>
        <p class="course">コース：{{ orders.course_name }}　担当者名</p>
        <div class="flex info-table">
          <div class="left">
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
                </tr>
                <tr v-for="(delivery_order, delivery_order_index) in orders.detail" :key="delivery_order_index">
                  <td class="number">{{ delivery_order_index + 1 }}</td>
                  <td class="code">{{ delivery_order.client_code }}</td>
                  <td class="name">{{ delivery_order.client_name }}</td>
                  <td class="location">{{ delivery_order.delivery_location_name }}</td>
                  <td class="tel">{{ delivery_order.client_tel }}</td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ findProductCount(product, delivery_order.order_count_by_products) }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td>仮合計</td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ findProductTotalCount(product, orders.total_count) }}</div>
                  </td>
                </tr>
                <tr>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td class="none"></td>
                  <td>合計</td>
                  <td v-for="(product, product_index) in products" :key="product_index">
                    <div>{{ findProductTotalCount(product, orders.total_count) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    usersOrderPrintData: Array,
    orderPrintData: Array,
    products: Array,
    isSearch:Boolean,
    deliveryDay: String,
    weekDay: String,
  },
  methods: {
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
  },
}
</script>

<style lang="scss" scoped>
@page result {
  size: A3 portrait;
  margin: 0;
}

.print-area {
  page: result;
  @media screen {
    display: none;
  }
  > .result-contents {
    break-before: page;
    > .info-table {
      width: 100%;
      > tbody {
        > tr {
          > th {
            padding: 10px;
            border: 1px solid black;
          }
          > td {
            padding: 10px;
            border: 1px solid black;
          }
        }
      }
    }
  }
  
  > .orders-list{
    > .order_date{
      font-size: 14px;
      margin-top: 15px;
      margin-bottom: 5px;
    }
    .left{
      width: 100%;
      > .order_table {
        margin-top: 10px;
        width: 100%;
        border:1px solid black;
        border-radius: 7px;
        border-collapse: separate;
        overflow: hidden;
  
        th {
          font-size: 17px;
          font-family: "MinchoB";
          border: 1px solid black;
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
          border: 1px solid black;
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
</style>
