export default ({ $axios, $config }, inject) => {
  class ADMIN_API {
    constructor(axios) {
      this.axios = axios;
    }
    /**
     * headerにトークン等を詰める
     * @param {*} formData
     * @returns
     */
    getDeviceTokenAuth(formData) {
      const uid = localStorage.getItem('admin-uid');
      const client = localStorage.getItem('admin-client');
      const accessToken = localStorage.getItem('admin-access-token');
      if (formData) {
        const headers = {
          'uid': uid,
          "access-token": accessToken,
          'client': client,
          'content-type': 'multipart/form-data'
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
        localStorage.removeItem('admin-access-token');
        localStorage.removeItem('admin-client');
        localStorage.removeItem('admin-uid');
        // localStorage.removeItem('admin-name');
        // localStorage.removeItem('admin-role');
        window.location.href = '/admin/login'
      }
    }

    /**
     * アクセストークン更新
     * @param {*} res
     */
    updateAccessToken(res) {
      // 前回のアクセストークン更新から5秒以内にリクエストを送った場合、アクセストークンは更新されずアクセストークンは空文字で帰ってくる
      if (res.headers['access-token']) {
        localStorage.setItem('admin-access-token', res.headers['access-token']);
      }
    }

    /**
     * 管理者ログイン
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
        url: `/api/admin_auth/sign_in`,
        data: data,
      }).then(res => {
        const accessToken = res.headers['access-token']
        const client = res.headers['client']
        const uid = res.headers['uid']

        localStorage.setItem('admin-access-token', accessToken);
        localStorage.setItem('admin-client', client);
        localStorage.setItem('admin-uid', uid);
      }).catch(err => {
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * 管理者ログアウト
     * @param {*} e
     * @returns
     */
    async logout(e) {
      e.target.disabled = true;
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'delete',
        url: `/api/admin_auth/sign_out`,
        headers: headers,
      }).then(res => {
        localStorage.removeItem('admin-access-token');
        localStorage.removeItem('admin-client');
        localStorage.removeItem('admin-uid');
        window.location.href = '/admin/login';
      }).catch(err => {
        this.errorCheck(err);
        e.target.disabled = false;
      })
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　管理者
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 管理者一覧取得
     * @returns
     */
    async getAdministrators() {
      let administrator = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/administrators`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        administrator = res.data.administrators;
      }).catch(err => {
        this.errorCheck(err);
      })
      return administrator;
    }

    /**
     * 管理者情報取得
     * @returns
     */
    async getAdministratorState() {
      let administrator;
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/administrators/detail`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        administrator = res.data.administrator;
      })
      return administrator;
    }

    /**
     * 管理者削除
     * @param {*} id
     * @returns
     */
    async deleteAdministrators(id) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'delete',
        url: `/api/admin/administrators/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        console.log("success");
      }).catch(err => {
        this.errorCheck(err);
        console.log("error");
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * 管理者登録
     * @param {*} data
     * @returns
     */
    async postAdministrator(data) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'post',
        url: `/api/admin/administrators`,
        headers: headers,
        data: data
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    /**
     * 管理者詳細取得
     * @param {*} id
     * @returns
     */
    async getAdministratorEdit(id) {
      const headers = this.getDeviceTokenAuth();
      let administrator;
      await this.axios({
        method: 'get',
        url: `/api/admin/administrators/${id}/edit`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        administrator = res.data.administrator;
      }).catch(err => {
        this.errorCheck(err);
      })
      return administrator;
    }

    /**
     * 管理者編集登録
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async putAdministrator(id, data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'put',
        url: `/api/admin/administrators/${id}`,
        headers: headers,
        data: {
          administrator: data
        }
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　休日
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 休日一覧取得
     * @returns
     */
    async getHolidays() {
      let holidays = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/holidays`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        holidays = res.data.holidays;
      }).catch(err => {
        this.errorCheck(err);
      })
      return holidays;
    }

    /**
     * 休日削除
     * @param {*} id
     * @returns
     */
    async deleteHoliday(id) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'delete',
        url: `/api/admin/holidays/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    /**
     * 休日登録
     * @param {*} date
     * @returns
     */
    async postHoliday(date) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'post',
        url: `/api/admin/holidays`,
        headers: headers,
        data: { holiday_date: date }
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　配送
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 配送一覧取得
     * @returns
     */
    async getOrders() {
      let orders = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/orders`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        orders = res.data.order;
      }).catch(err => {
        this.errorCheck(err);
      })
      return orders;
    }

    /**
     * 配送詳細取得
     * @param {*} id
     * @param {*} day
     * @returns
     */
    async getOrderDetail(id, day) {
      const headers = this.getDeviceTokenAuth();
      let orders = [];
      await this.axios({
        method: 'get',
        url: `/api/admin/orders/${id}?delivery_day=${day}?`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        orders = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return orders;
    }

    /**
     * 配送検索 または全件取得したいとき使用
     * @param {*} url
     * @returns
     */
    async searchOrders(url) {
      const headers = this.getDeviceTokenAuth();
      let orders;
      await this.axios({
        method: 'get',
        url: `/api/admin/orders/search?${url}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        orders = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return orders;
    }


    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　注文キャンセル
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 注文キャンセル一覧取得
     * @returns
     */
    async getOrderCancels() {
      let cancels = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/order_cancels`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        cancels = res.data.order;
      }).catch(err => {
        this.errorCheck(err);
      })
      return cancels;
    }

    /**
     * キャンセル詳細取得
     * @param {*} id
     * @param {*} day
     * @returns
     */
    async getCancelDetail(id, day) {
      const headers = this.getDeviceTokenAuth();
      let cancels = [];
      await this.axios({
        method: 'get',
        url: `/api/admin/order_cancels/${id}?delivery_day=${day}?`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        cancels = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return cancels;
    }

    /**
     * キャンセル検索
     * @param {*} url
     * @returns
     */
    async searchOrderCancels(url) {
      const headers = this.getDeviceTokenAuth();
      let cancels;
      await this.axios({
        method: 'get',
        url: `/api/admin/order_cancels/search?${url}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        cancels = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return cancels;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 　カテゴリ
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * カテゴリ一覧取得
     * @returns
     */
    async getCategories() {
      let categories = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/categories`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        categories = res.data.categories;
      }).catch(err => {
        this.errorCheck(err);
      })
      return categories;
    }

    /**
     * カテゴリ新規登録
     * @param {*} data
     * @returns
     */
    async postCategory(data) {
      const headers = this.getDeviceTokenAuth(formData);
      let errorMessages = []
      let formData = new FormData();
      formData.append("category[name]", data.name)
      formData.append("category[image]", data.image)
      if(data.icon != null){
        formData.append("category[icon]", data.icon)
      }
      formData.append("category[is_same_day_reservation]", data.is_same_day_reservation)
      formData.append("category[closing_time]", data.closing_time)
      if(data.description != ""){
        formData.append("category[description]", data.description)
      }
      await this.axios({
        method: 'post',
        url: `/api/admin/categories`,
        data: formData,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * カテゴリ編集取得
     * @param {*} id
     * @returns
     */
    async getCategoryEdit(id) {
      const headers = this.getDeviceTokenAuth();
      let categories;
      await this.axios({
        method: 'get',
        url: `/api/admin/categories/${id}/edit`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        categories = res.data.category;
      }).catch(err => {
        this.errorCheck(err);
      })
      return categories;
    }

    /**
     * カテゴリ編集登録
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async putCategory(id, data) {
      const headers = this.getDeviceTokenAuth(formData);
      let errorMessages = [];
      let formData = new FormData();
      if(data.name){
        formData.append("category[name]", data.name)
      }
      if(data.image){
        formData.append("category[image]", data.image)
      }
      if(data.icon){
        formData.append("category[icon]", data.icon)
      }
      if(data.is_same_day_reservation != undefined){
        formData.append("category[is_same_day_reservation]", data.is_same_day_reservation)
      }
      if(data.closing_time){
        formData.append("category[closing_time]", data.closing_time)
      }
      if(data.description){
        formData.append("category[description]", data.description)
      }
      else if(data.description == ""){
        formData.append("category[description]", "")
      }
      await this.axios({
        method: 'put',
        url: `/api/admin/categories/${id}`,
        headers: headers,
        data: formData,
      }).then(res => {
        this.updateAccessToken(res);
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * カテゴリ削除
     * @param {*} id
     * @returns
     */
    async deleteCategory(id) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'delete',
        url: `/api/admin/categories/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 商品
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 商品一覧
     * @returns
     */
    async getProducts() {
      let products = [];
      const headers = this.getDeviceTokenAuth();
      await this.axios({
        method: 'get',
        url: `/api/admin/products`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        products = res.data.products;
      }).catch(err => {
        this.errorCheck(err);
      })
      return products;
    }

    /**
     * 商品新規登録
     * @param {*} data
     * @returns
     */
    async postProduct(data) {
      // let errorMessages = [];
      const headers = this.getDeviceTokenAuth();
      let products = {
        product_id: null,
        errorMessages: [],
      };
      await this.axios({
        method: "post",
        url: `api/admin/products`,
        data: { product: data },
        headers: headers
      }).then(res => {
        this.updateAccessToken(res);
        products.product_id = res.data.product_id;
      }).catch(err => {
        this.errorCheck(err);
        products.errorMessages = err.response.data.errors;
      })
      return products;
    }

    /**
     * 商品画像登録
     * @param {*}
     * @returns
     */
    async postProductImg(product_id,img) {
      const headers = this.getDeviceTokenAuth(formData);
      let productImage;
      let formData = new FormData();
      formData.append("product_id", product_id)
      formData.append("image", img)
      await this.axios({
        method: 'post',
        url: `/api/admin/product_images`,
        data: formData,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        productImage = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return productImage;
    }

    /**
     * 商品画像編集
     * @param {*}
     * @returns
     */
    async putProductImg(product_image_id, img) {
      const headers = this.getDeviceTokenAuth(formData);
      let productImage
      let formData = new FormData();
      formData.append("image", img)
      await this.axios({
        method: 'put',
        url: `/api/admin/product_images/${product_image_id}`,
        data: formData,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        productImage = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return productImage;
    }

    /**
     * 商品画像削除
     * @param {*}
     * @returns
     */
    async deleteProductImg(product_image_id) {
      const headers = this.getDeviceTokenAuth();
      let productImage
      await this.axios({
        method: 'delete',
        url: `/api/admin/product_images/${product_image_id}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        productImage = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return productImage;
    }

    /**
     * 商品編集取得
     * @param {*} id
     * @returns
     */
    async getProductEdit(id) {
      const headers = this.getDeviceTokenAuth();
      let product;
      await this.axios({
        method: 'get',
        url: `/api/admin/products/${id}/edit`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        product = res.data.product;
      }).catch(err => {
        this.errorCheck(err);
      })
      return product;
    }

    /**
     * 商品編集登録
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async putProduct(id, data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'put',
        url: `/api/admin/products/${id}`,
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
     * 商品削除
     * @param {*} id
     * @returns
     */
    async deleteProduct(id) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'delete',
        url: `/api/admin/products/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    /**
     * 商品検索
     * @param {*} url
     * @returns
     */
    async searchProducts(url) {
      const headers = this.getDeviceTokenAuth();
      let products;
      await this.axios({
        method: 'get',
        url: `/api/admin/products/search?${url}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        products = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return products;
    }

    /**
     * 商品並べ替え
     * @param {*} data
     * @returns
     */
    async sortProducts(data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'post',
        url: `/api/admin//products/sort`,
        headers: headers,
        data: { product_ids: data }
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 顧客系
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 顧客一覧取得
     * @param {*} limit
     * @param {*} offset
     * @returns
     */
    async getClients(limit, offset) {
      const headers = this.getDeviceTokenAuth();
      let resData = {
        totalAmount: 0,
        clients: [],
      }
      await this.axios({
        method: 'get',
        url: `/api/admin/clients?limit=${limit}&offset=${offset}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        resData.clients = res.data.clients;
        resData.totalAmount = res.data.all_count;
      }).catch(err => {
        this.errorCheck(err);
      })
      return resData;
    }

    /**
     * 顧客新規登録
     * @param {*} data
     * @returns
     */
    async postClient(data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'post',
        url: `/api/admin/clients`,
        headers: headers,
        data: { client: data }
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * 顧客編集取得
     * @param {*} id
     * @returns
     */
    async getClient(id) {
      const headers = this.getDeviceTokenAuth();
      let client;
      await this.axios({
        method: 'get',
        url: `/api/admin/clients/${id}/edit`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        client = res.data.client
      }).catch(err => {
        this.errorCheck(err);
      })
      return client;
    }

    /**
     * 顧客編集登録
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async putClient(id, data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'put',
        url: `/api/admin/clients/${id}`,
        headers: headers,
        data: data
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * 顧客削除
     * @param {*} id
     * @returns
     */
    async deleteClient(id) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'delete',
        url: `/api/admin/clients/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    /**
     * 顧客検索 または全件取得したいとき使用
     * @param {*} url
     * @returns
     */
    async searchClients(url) {
      const headers = this.getDeviceTokenAuth();
      let clients;
      await this.axios({
        method: 'get',
        url: `/api/admin/clients/search?${url}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        clients = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return clients;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // ユーザー
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    /**
     * ユーザ一覧取得
     * @param {*} limit
     * @param {*} offset
     * @returns
     */
    async getUsers(limit, offset) {
      const headers = this.getDeviceTokenAuth();
      let resData = {
        totalAmount: 0,
        users: [],
      }
      await this.axios({
        method: 'get',
        url: `/api/admin/users?limit=${limit}&offset=${offset}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        resData.users = res.data.users;
        resData.totalAmount = res.data.all_count;
      }).catch(err => {
        this.errorCheck(err);
      })
      return resData;
    }

    /**
     * ユーザー新規登録
     * @param {*} data
     * @returns
     */
    async postUser(data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'post',
        url: `/api/admin/users`,
        headers: headers,
        data: data 
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * ユーザー編集取得
     * @param {*} id
     * @returns
     */
    async getUser(id) {
      const headers = this.getDeviceTokenAuth();
      let user;
      await this.axios({
        method: 'get',
        url: `/api/admin/users/${id}/edit`,
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
     * ユーザー編集登録
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async putUser(id, data) {
            const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'put',
        url: `/api/admin/users/${id}`,
        headers: headers,
        data: {
          user: data
        },
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * ユーザー削除
     * @param {*} id
     * @returns
     */
    async deleteUser(id) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'delete',
        url: `/api/admin/users/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    /**
     * ユーザー検索　または全件取得したいとき使用
     * @param {*} url
     * @returns
     */
    async searchUsers(url) {
      const headers = this.getDeviceTokenAuth();
      let users;
      await this.axios({
        method: 'get',
        url: `/api/admin/users/search?${url}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        users = res.data;
      }).catch(err => {
        this.errorCheck(err);
      })
      return users;
    }

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 配送コース
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    /**
     * 配送コース一覧取得
     * @returns
     */
    async getDelivery() {
      const headers = this.getDeviceTokenAuth();
      let deliveries = [];
      await this.axios({
        method: 'get',
        url: `/api/admin/delivery_courses`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        deliveries = res.data.delivery_courses;
      }).catch(err => {
        this.errorCheck(err);
      })
      return deliveries;
    }

    /**
     * 配送コース新規登録
     * @param {*} data
     * @returns
     */
    async postDelivery(data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'post',
        url: `/api/admin/delivery_courses`,
        headers: headers,
        data: { delivery_course: data }
      }).then(res => {
        this.updateAccessToken(res)
      }).catch(err => {
        this.errorCheck(err);
        errorMessages = err.response.data.errors;
      })
      return errorMessages;
    }

    /**
     * 配送コース編集取得
     * @param {*} id
     * @returns
     */
    async getDeliveryEdit(id) {
      const headers = this.getDeviceTokenAuth();
      let delivery_courses;
      await this.axios({
        method: 'get',
        url: `/api/admin/delivery_courses/${id}/edit`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        delivery_courses = res.data.delivery_course;
      }).catch(err => {
        this.errorCheck(err);
      })
      return delivery_courses;
    }

    /**
     * 配送コース編集登録
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async putDelivery(id, data) {
      const headers = this.getDeviceTokenAuth();
      let errorMessages = [];
      await this.axios({
        method: 'put',
        url: `/api/admin/delivery_courses/${id}`,
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
     * 配送コース削除
     * @param {*} id
     * @returns
     */
    async deleteDelivery(id) {
      const headers = this.getDeviceTokenAuth();
      let success = "";
      await this.axios({
        method: 'delete',
        url: `/api/admin/delivery_courses/${id}`,
        headers: headers,
      }).then(res => {
        this.updateAccessToken(res);
        success = res.data.success;
      }).catch(err => {
        this.errorCheck(err);
      })
      return success;
    }

    /**
     * 配送コース検索
     * @param {*} url
     * @returns
     */
    async searchDeliveries(url) {
      const headers = this.getDeviceTokenAuth();
      let delivery_courses;
      await this.axios({
        method: 'get',
        url: `/api/admin/delivery_courses/search?${url}`,
        headers: headers
      }).then(res => {
        this.updateAccessToken(res)
        delivery_courses = res.data.delivery_courses;
      }).catch(err => {
        this.errorCheck(err);
      })
      return delivery_courses;
    }

    /**
     * @param {*} qrItem
     * @returns
     */
    async urlState(qrItem) {
      let url = "";
      if($config.env == 'production') {
        url = "https://" + window.location.host + "/signup?" + qrItem;
      } else if($config.env == 'staging'){
        url = "http://" + window.location.host + "/signup?" + qrItem;
      } else {
        url = "http://" + window.location.host + "/signup?" + qrItem;
      }
      return url;
    }

    /**
     * 本日の日付
     * @returns
     */
    async getDate() {
      let date;
      await this.axios({
        method: 'get',
        url: `/api/admin/today`,
      }).then(res => {
        date = res.data.today;
      }).catch(err => {
      })
      return date;
    }
  }


  const adminApi = new ADMIN_API($axios, $config)
  inject('adminApi', adminApi)
}