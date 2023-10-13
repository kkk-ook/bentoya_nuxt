export const state = () => ({
  cartCount: 0,
  // cartItems: [],
//   orderData: {
//     order: {
//       last_name: null,
//       first_name: null,
//       last_name_kana: null,
//       first_name_kana: null,
//       email: null,
//       // postal_code: null,
//       // prefecture_id: null,
//       // address1: null,
//       // address2: null,
//       // is_shipping_customer: false,
//       // shipping_last_name: null,
//       // shipping_first_name: null,
//       // shipping_last_name_kana: null,
//       // shipping_first_name_kana: null,
//       // shipping_tel: null,
//       // shipping_postal_code: null,
//       // shipping_prefecture_id: null,
//       // shipping_address1: null,
//       // shipping_address2: null,
//       // delivery_date: null,
//       // delivery_time: null,
//       // usage: "",
//       // is_use_box: true,
//       // order_count: "", //動的に変更
//       subtotal_price: 0,
//       // shipping_price: 0,
//       total_price: 0,
//       payment_method: 1,//動的に変更
//       // sbpayment_tracking_id: null,
//       // description: null,
//       // bag_1_count: 0,
//       // bag_2_count: 0,
//       // bag_3_count: 0,
//       // bag_4_count: 0,
//       token: null,
//       token_key: null,
//     },
//     carts: [],
//     token: "",
//     token_key: ""
//   }
})

export const mutations = {
  setCartCount(state, cartCount) {
    state.cartCount = cartCount;
  },
  // setCartItems(state, items) {
  //   state.orderData.carts = items;
  //   state.orderData.order.order_count = items.length
  // },
  
//   // 注文情報入力画面の情報セット
//   setOrderInfo(state, info) {
//     state.orderData.order.last_name = info.last_name;
//     state.orderData.order.first_name = info.first_name;
//     state.orderData.order.last_name_kana = info.last_name_kana;
//     state.orderData.order.first_name_kana = info.first_name_kana;
//     state.orderData.order.email = info.email;
//     // state.orderData.order.postal_code = info.postal_code;
//     // state.orderData.order.prefecture_id = info.prefecture_id;
//     // state.orderData.order.address1 = info.address1;
//     // state.orderData.order.address2 = info.address2;
//     // state.orderData.order.is_shipping_customer = info.is_shipping_customer;
//     // state.orderData.order.shipping_last_name = info.shipping_last_name;
//     // state.orderData.order.shipping_first_name = info.shipping_first_name;
//     // state.orderData.order.shipping_last_name_kana = info.shipping_last_name_kana;
//     // state.orderData.order.shipping_tel = info.shipping_tel;
//     // state.orderData.order.shipping_postal_code = info.shipping_postal_code;
//     // state.orderData.order.shipping_prefecture_id = info.shipping_prefecture_id;
//     // state.orderData.order.shipping_address1= info.shipping_address1;
//     // state.orderData.order.shipping_address2 = info.shipping_address2;
//     // state.orderData.order.delivery_date = info.delivery_date;
//     // state.orderData.order.delivery_time = info.delivery_time;
//     // state.orderData.order.is_use_box = info.is_use_box;
//     // state.orderData.order.delivery_time = info.delivery_time;
//     state.orderData.order.total_price = info.total_price;
//     // state.orderData.order.shipping_price = info.shipping_price;
//   },

//   // トークンセット
//   setToken(state, creditInfo) {
//     state.orderData.token = creditInfo.token;
//     state.orderData.token_key = creditInfo.tokenKey;
//   },

//   setSubTotal(state, subTotal) {
//     state.orderData.order.subtotal_price = subTotal;
//   },
//   setCount(state, count) {
//     state.orderData.order.subtotal_price = subTotal;
//   }
}
