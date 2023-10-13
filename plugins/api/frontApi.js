export default ({ $axios, $config }, inject) => {
  class FRONT_API {
    constructor(axios) {
      this.axios = axios;
    }
    
    /**
     * headerにトークン等を詰める
     * @param {*} formData
     * @returns
     */
    getDeviceTokenAuth(formData) {

      const uid = localStorage.getItem('user-uid');
      const client = localStorage.getItem('user-client');
      const accessToken = localStorage.getItem('user-access-token');
      if (formData) {
        const headers = {
          'uid': uid,
          "access-token": accessToken,
          'client': client,
          'content-type': 'multipart/form-data',
        }
        return headers
      } else {
        const headers = {
          'uid': uid,
          "access-token": accessToken,
          'client': client,
        }
        return headers
      }
    }

    /**
     * エラーチェック
     * @param {*} err
     */
    errorCheck(err) {
      // 認証エラー時 cookieを全て削除して強制的にログアウト状態にする
      if (err.response.status == '401' || err.response.status == '404') {
        localStorage.removeItem('user-access-token');
        localStorage.removeItem('user-client');
        localStorage.removeItem('user-uid');
        // localStorage.removeItem('name');
        // localStorage.removeItem('role');
        window.location.href = '/login'
      }
    }

    /**
     * アクセストークン更新
     * @param {*} res
     */
    updateAccessToken(res) {
      // 前回のアクセストークン更新から5秒以内にリクエストを送った場合、アクセストークンは更新されずアクセストークンは空文字で帰ってくる
      if (res.headers['access-token']) {
        localStorage.setItem('user-access-token', res.headers['access-token']);
      }
    }

    /**
     * ユーザーログイン
     * @param {*} email
     * @param {*} password
     * @returns
     */
    async login(email, password) {
      const data = {
        "email": email,
        "password": password
      }
      let errorMessages = [];
      await this.axios({
        method: 'post',
        url: `/api/auth/sign_in`,
        data: data,
      }).then(res => {
        const accessToken = res.headers['access-token']
        const client = res.headers['client']
        const uid = res.headers['uid']

        localStorage.setItem('user-access-token', accessToken);
        localStorage.setItem('user-client', client);
        localStorage.setItem('user-uid', uid);
      }).catch(err => {
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * パスワードリセットリクエスト
     * @param {*} e
     * @param {*} email
     * @returns
     */
    async resetPass(e, email) {
      e.target.disabled = true
      let errorMessages = []
      let url =""
      if($config.env == 'production') {
        url = "https://" + window.location.host + "/password"
      } else if($config.env == 'staging'){
        url =　"http://" + window.location.host + "/password"
      } else {
        url = "http://" + window.location.host + "/password"
      }
      let data = {
        email: email,
        redirect_url: url
      }
      await this.axios({
        method: 'post',
        url: '/api/auth/password',
        data: data
      })
        .catch(err => {
          errorMessages = err.response.data.errors
        })
      e.target.disabled = false
      return errorMessages
    }


    /**
     * パスワードリセット登録
     * @param {*} e
     * @param {*} passData
     * @returns
     */
    async resetPassDo(pass, confirmPass, headers) {
      let errorMessages = []
      let data = {
        password: pass,
        password_confirmation: confirmPass
      }
      await this.axios({
        method: 'put',
        url: '/api/auth/password',
        data: data,
        headers:headers
      }).then(res => {
        this.updateAccessToken(res)
      }) .catch(err => {
          errorMessages = err.response.data.errors
      })
      return errorMessages
    }

    /**
     * メール再送
     * @param {*} e
     * @param {*} email
     * @returns
     */
    async resendEmail(e, email) {
      
      e.target.disabled = true
      let errorMessages = []
      await this.axios({
        method: 'post',
        url: '/api/auth/confirmation',
        data: { email }
      })
        .catch(err => {
          errorMessages = err.response.data.errors
        })
      e.target.disabled = false
      return errorMessages
    }

    /**
     * ログイン状態（0時にログイン外す）
     * @returns
     */
    async isLoginState() {
      let status = false;
      await this.axios({
        method: 'get',
        url: `/api/front/status`,
      }).then(res => {
        status = res.data;
      })
      
      return status;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　ユーザー
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * ユーザー情報取得
     * @returns
     */
    async getUserState() {
      let data = {
        user: [],
        errorMessages: [],
      };
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/front/users`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        data.user = res.data.user;
      }) .catch(err => {
        data.errorMessages = err.response.data.errors
      })
      return data;
    }

    // /**
    //  * ユーザー会員登録
    //  * @param {*} data
    //  * @returns
    //  */
    // async signup(data) {
    //   const headers = this.getDeviceTokenAuth();
    //   let state;
    //   await this.axios({
    //     method: 'post',
    //     url: `/api/auth`,
    //     headers: headers,
    //     data: data
    //   }).then(res => {
    //     this.updateAccessToken(res);
    //     state = res.data.status;
    //     console.log("success");
    //   }).catch(err => {
    //     this.errorCheck(err);
    //     console.log("error");
    //     // state = err.response.data.errors;
    //   })
    //   console.log(state);
    //   return state;
    // }

    /**
     * ユーザー会員登録
     * @returns
     */
    async signup(data) {
      let errorMessages;
      await this.axios({
        method: 'post',
        url: `/api/auth`,
        data: data
      }).then(res => {
      }).catch(err => {
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * 会員情報編集取得
     * @returns
     */
    async getUserEdit() {
      const headers = this.getDeviceTokenAuth();
      let user;
      await this.axios({
        method: 'get',
        url: `/api/auth/edit`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        user = res.data.user;
      }).catch(err => {
        this.errorCheck(err);
      })
      return user;
    }

    /**
     * 会員情報編集登録
     * @param {*} data
     * @returns
     */
    async putUser(data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'put',
        url: `/api/auth`,
        headers: headers,
        data: data,
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * ユーザーログアウト
     * @param {*} e
     * @returns
     */
    async logout(e) {
      if(e){
        e.target.disabled = true
      }
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'delete',
        url: `/api/auth/sign_out`,
        headers: headers,
      }).then(res => {
        localStorage.removeItem('user-access-token');
        localStorage.removeItem('user-client');
        localStorage.removeItem('user-uid');
        localStorage.removeItem("deliveryDays");
        localStorage.removeItem("orderStopDayBefore");
        localStorage.removeItem("orderStopThatDay");
        localStorage.removeItem("orderStopHolidayBefore");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("orderData");
        window.location.href = '/login'
      }).catch(err => {
        this.errorCheck(err);
        if(e){
          e.target.disabled = false;
        }
      })
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　商品
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 商品一覧取得
     * @returns
     */
    async getProducts() {
      let products = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/front/products`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        products = res.data.categories;
      })
      return products;
    }

    /**
     * 商品詳細取得
     * @param {*} id
     * @returns
     */
    async getProductDetail(id) {
      const headers = this.getDeviceTokenAuth();
      let details = [];
      await this.axios({
        method: 'get',
        url: `/api/front/products/${id}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        details = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return details;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　休日
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 休日取得
     * @returns
     */
    async getHolidays() {
      let holidays = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/front/holidays`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        holidays = res.data.holidays;
      })
      return holidays;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　カート
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * カート新規登録
     * @param {*} data
     * @returns
     */
    async postCart(data) {
      let res = {
        cart: "",
        errorMessages: []
      };
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'post',
        url: `/api/front/carts`,
        data: {
          cart: data
        },
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        res.cart = res.data.cart
      }).catch(err => {
        res.errorMessages = err.response.data.errors;
      })
      return res;
    }

    /**
     * カート変更登録
     */
    async patchCart(data, cartId) {
      let resData =  {
        errorMessages: [],
        cart: ""
      }

      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'patch',
        url: `/api/front/carts/${cartId}`,
        data: {
          cart: {
            cart_details: data
          }
        },
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        resData.cart = res.data.cart;
      }).catch(err => {
        resData.errorMessages = err.response.data.errors;
      })
      return resData;
    }

    /**
     * カート一覧取得
     * @returns
     */
    async getCarts() {
      let carts = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/front/carts`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        carts = res.data.carts;
      })
      return carts;
    }

    /**
     * カート削除
     * @param {*} e
     * @param {*} cartId
     * @returns
     */
    async deleteCart(cartId, e) {
      if(e){
        e.target.disabled = true
      }
      const headers = this.getDeviceTokenAuth();
      let errorMessages = []
      await this.axios({
        method: 'delete',
        url: `/api/front/carts/${cartId}`,
        headers
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        errorMessages = err.response.data.errors
        this.errorCheck(err)
      })
      if(e){
        e.target.disabled = false
      }
      return errorMessages;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　注文
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    
    /**
     * 注文新規登録
     * @param {*} order
     * @returns
     */
    async postOrder(e, order) {
      e.target.disabled = true;
      let state = {
        url: "",
        errors: [],
      };
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'post',
        url: `/api/front/orders`,
        headers: headers,
        data: {
          order_header: order
        },
      }).then(res => {
        this.updateAccessToken(res);
        state.url = res.data.url
      }).catch(err => {
        this.errorCheck(err);
        state.errors = err.response.data.errors;
      });
      e.target.disabled = false;
      return state;
    }

    /**
     * 注文一覧取得
     * @returns
     */
    async getOrders() {
      let orders = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/front/orders`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        orders = res.data.order_headers;
      })
      return orders;
    }

    /**
     * 注文削除
     * @param {*} e
     * @param {*} orderId
     * @returns
     */
    async deleteOrder(e, orderId) {
      e.target.disabled = true;
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'delete',
        url: `/api/front/orders/${orderId}`,
        headers
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        errorMessages = err.response.data.errors
        this.errorCheck(err)
      })
      e.target.disabled = false;
      return errorMessages;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　顧客系
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 顧客一覧取得
     * @returns
     */
    async getClients() {
      let resData = {
        totalAmount: 0,
        clients: [],
      }
      await this.axios({
        method: 'get',
        url: `/api/front/clients`,
      }).then(res => {
        resData.clients = res.data.clients;
        resData.totalAmount = res.data.all_count;
      }).catch(err => {
      })
      return resData;
    }

    /**
     * 本日の日付
     * @returns
     */
    async getDate() {
      let date;
      await this.axios({
        method: 'get',
        url: `/api/front/today`,
      }).then(res => {
        date = res.data.today;
      }).catch(err => {
      })
      return date;
    }
  }
  
  const frontApi = new FRONT_API($axios, $config)
  inject('frontApi', frontApi)
}


