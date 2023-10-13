export default ({ $axios, $config }, inject) => {
  class COMMON_API {
    constructor(axios, config) {
      this.axios = axios;
      this.config = config;
    }

    async searchAddress(postalCode) {
      let address;
      await this.axios({
        method: 'get',
        url: `/zipApi/api/search?zipcode=${postalCode}`,
      }).then(res => {
        // 該当住所が存在しない場合はnullになる
        if (res.data.results == null) return;
        // 該当住所があればaddressに代入する
        address = res.data.results[0];
      })
      return address;
    }
  }

  const commonApi = new COMMON_API($axios, $config)
  inject('commonApi', commonApi)
}
