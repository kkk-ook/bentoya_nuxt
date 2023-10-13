<template>
  <div class="qrcode">
    <div class="qrcode-area" v-if="!load && client_name">
      <div class="print-area">
        <p class="title">{{ client_name }}</p>
        <p class="location">{{ delivery_location.name }}</p>
        <div v-if="qrItem">
          <!-- value後で修正 -->
          <qrcode text="qrItem" :value="url" :options="{ width: 300 }" />
        </div>
        <p class="txt">会員登録用QRコード</p>
        <p class="url">{{ url }}</p>
      </div>
      <div class="button btn-parts2 _gray2 print_none">
        <div class="btn">
          <button @click="printOut">QRコード印刷</button>
        </div>
      </div>
    </div>
    <div v-else-if="!load && !client_name">
      エラーが発生しました。
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  data() {
    return {
      qrItem: "",
      url: "",
      delivery_location: "",
      client: "",
      clients: [],
      client_name: "",
      load: true,
    }
  },
  async mounted() {
    let clientsData = await this.$adminApi.searchClients();
    this.clients = clientsData.clients;
    
    this.client = atob(localStorage.getItem("client"));
    this.qrItem = atob(localStorage.getItem("location"));
    
    let name;

    if(this.client){
      name = this.clients.find((c) => c.code == this.client);
      if(name.company_name != undefined){
        this.client_name = name.company_name;
      }
    }

    this.delivery_location = name.delivery_locations.find((d) => d.id == this.qrItem);

    // クエリ暗号化
    const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let newArray = [];

    for(let i = 0; i < 5; i++){
      let randomNum = Math.floor( Math.random() * 36 );
      newArray.push(abc.charAt(randomNum));
    }

    newArray.push(this.qrItem);

    for(let i = 0; i < 5; i++){
      let randomNum = Math.floor( Math.random() * 36 );
      newArray.push(abc.charAt(randomNum));
    }

    this.qrItem = newArray.join('');
    this.url = await this.$adminApi.urlState(this.qrItem);

    this.load = false;
  },
  methods: {
    printOut() {
      window.print();
    },
  },
}
</script>

<style lang="scss" scoped>
.qrcode{
  color: $color-txt;
  width: 90%;
  margin: 150px auto;
  .qrcode-area{
    > .print-area{
      margin-bottom: 100px;
      .title, .location, .txt{
        width: 100%;
        display: inline-block;
        font-size: 25px;
        margin-left: 30px;
        margin-bottom: 10px;
      }
      .txt {
        margin-top: 20px;
      }
      .url {
        margin-left: 30px;
      }
    }
    > .btn-parts2{
      margin-left: 50px;
      padding: 3px 4px;
      border: 1px solid $color-txt2;
      color: $color-txt;
      display: inline-block;
      width: 200px;
    }
    // 印刷する際はボタン消す
    @media print{
      .print_none{
          display: none;
      }
    }
  }
}
</style>