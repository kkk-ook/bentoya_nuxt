<template>
  <div ref="scrollElem">
    <ErrorFlash :errorMessages="errorMessages"></ErrorFlash>
    <div class="row_table">

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          コース名<span>必須</span>
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="コース名" v-model="delivery.name">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          ドライバー
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" placeholder="ドライバー名" v-model="delivery.driver_name">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          配達先顧客名<span>必須</span>
        </div>
        <div class="detail flex _a-center delivery">
          <div class="inner_left">
            <draggable class="row_s" v-model="selectClientName">
              <div class="selects flex column _a-center _j-start" v-for="(delivery, index) in delivery.delivery_orders_attributes"
              :key="index">
                <fa
                  :icon="faArrows"
                  class="arrows"
                />
                <div class="suggest">
                  <Multiselect
                    v-model="selectClientName[index]"
                    :options="clients_deliveries_name"
                    :searchable="true"
                    :close-on-select="false"
                    :allow-empty="false"
                    placeholder="顧客名を選択してください">
                  </Multiselect>
                </div>
                <fa
                  :icon="faCircleMinus"
                  class="minus fa-2x"
                  @click="deleteDelivery(index)"
                  v-if="index > 0"
                />
              </div>
            </draggable>
          </div>
          <div class="btn" @click="addClient">
            <button><img src="/admin/plus_button.svg" alt="button"></button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="deliveryBtn btn-parts2 _red font-minchoB"
      @click="registerDelivery(delivery.name)"
      v-if="!btnLoad"
      v-show="!edit"
      >
      <button>登録</button>
    </div>

    <div
      class="deliveryBtn btn-parts2 _red font-minchoB"
      @click="editdelivery(delivery.name)"
      v-if="!btnLoad"
      v-show="edit"
    >
      <button>更新</button>
    </div>
    <div class="loader-area" v-if="load">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faArrows } from "@fortawesome/free-solid-svg-icons";
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  props: {
    edit: Boolean,
  },
  data() {
    return {
      errorMessages: [],
      load: true,
      btnLoad: false,
      sameName: true,
      selectClientName: [],
      selectClientPlace: [],
      clients_place:[],
      clients_deliveries:[],
      clients_deliveries_name: [],
      clients: [],
      delivery: {
        name: "",
        driver_name: "",
        delivery_orders_attributes:[
          {
            delivery_location_id: null,
            position: null,
          }
        ]
      },
      deleteItem: [],
    };
  },
  async mounted() {
    let clientsData = await this.$adminApi.searchClients();
    this.clients = clientsData.clients;

    //顧客名と配達場所をまとめて表示
    for(let i = 0; i < this.clients.length; i++){
      for(let j = 0; j < this.clients[i].delivery_locations.length; j++){
        this.clients_place.push({
          'id': this.clients[i].delivery_locations[j].id,
          'client_id': this.clients[i].delivery_locations[j].client_id,
          'name': this.clients[i].delivery_locations[j].name,
        });
      }
    }
    for(let i = 0; i < this.clients_place.length; i++){
      let client = this.clients.find((c) => c.id == this.clients_place[i].client_id);
      this.clients_deliveries.push({
        'id': client.id,
        'name': client.name + "（" + this.clients_place[i].name + "）",
        'place_id': this.clients_place[i].id,
      });
    }

    for(let i = 0; i < this.clients_deliveries.length; i++){
      this.clients_deliveries_name.push(this.clients_deliveries[i].name);
    }
    //ここまで

    if(this.edit){
      this.delivery = await this.$adminApi.getDeliveryEdit(this.$route.params.id);

      this.$set(this.delivery, "delivery_orders_attributes",[]);
      // 選択済顧客取ってくる
      let existDelivery;
      for(let i = 0; i < this.delivery.delivery_orders.length; i++){
        existDelivery = this.clients_place.find((c) => c.id == this.delivery.delivery_orders[i].delivery_location_id);
        // 選択済顧客が消されてなかったら追加
        if(existDelivery != undefined){
          this.delivery.delivery_orders_attributes.push({
            'id': this.delivery.delivery_orders[i].id,
            'delivery_location_id': this.delivery.delivery_orders[i].delivery_location_id,
            'position': this.delivery.delivery_orders[i].position,
          });
        }
      }

      // 選択済顧客が0でないとき
      if(this.delivery.delivery_orders_attributes.length != 0){
        for(let i = 0; i < this.delivery.delivery_orders_attributes.length; i++){
          let selected = this.clients_deliveries.find((c) => c.place_id == this.delivery.delivery_orders_attributes[i].delivery_location_id);
          this.selectClientName.push(selected.name);
        }
      }
      // 選択済顧客が0のとき
      else{
        this.delivery.delivery_orders_attributes.push({
          delivery_location_id: null,
          position: null,
        });
      }
    }
    this.load = false;
  },

  methods: {
    // 配達先顧客の変更、削除をチェック（編集画面のみ）
    changeDelivery(){
      if(this.edit){
          // 同じ配達先顧客名が複数選択されていたらthis.sameNameをtrueにする
          let s = new Set(this.selectClientName);
          this.sameName = s.size != this.selectClientName.length;
        if (!this.sameName) {
          let nullItem = [];
          for(let i = 0; i < this.delivery.delivery_orders_attributes.length; i++){
            let item = this.clients_deliveries.find((c) => c.place_id == this.delivery.delivery_orders_attributes[i].delivery_location_id);
            if(item != undefined){
              // 選択済配達先顧客名を変更したときの処理
              if(this.selectClientName[i] != item.name){
                let changeItem = this.clients_deliveries.find((c) => c.name == this.selectClientName[i]);
                this.delivery.delivery_orders_attributes[i] = {
                  'id': this.delivery.delivery_orders_attributes[i].id,
                  'delivery_location_id': changeItem.place_id,
                  'position': null,
                };
              }
              // 変更しなかったときの処理（idのみ追加）
              else{
                this.delivery.delivery_orders_attributes[i] = {
                  'id': this.delivery.delivery_orders_attributes[i].id,
                };
              }
            }
            // 配達先顧客名を新規追加したときの処理
            else{
              if(this.selectClientName[i] != null || this.selectClientName[i] != undefined){
                let selectClient = this.clients_deliveries.find((p) => p.name == this.selectClientName[i]);
                this.delivery.delivery_orders_attributes[i] = {
                  'delivery_location_id': selectClient.place_id,
                };
              }
              else{
                // 枠だけ追加されて何も選択されていなかったら削除する項目に追加
                if(this.delivery.delivery_orders_attributes.length > 1){
                  nullItem.push(i);
                }
              }
            }
          }

          // 枠だけ追加された箇所を削除
          for(let i = nullItem.length - 1; 0 <= i; i--){
            this.delivery.delivery_orders_attributes.splice(nullItem[i],1);
          }

          // 並び順を付与
          for(let i = 0; i < this.delivery.delivery_orders_attributes.length; i++){
            this.delivery.delivery_orders_attributes[i].position = i + 1
          }

          // ポジション順に並び替え
          this.delivery.delivery_orders_attributes.sort((a, b) => a.position - b.position);
  
          // 削除する選択済顧客を追加
          for(let i = 0; i < this.deleteItem.length; i++){
            this.delivery.delivery_orders_attributes.push(this.deleteItem[i]);
          }
        }
      }
    },

    // バリデーション
    validationCheck() {
      this.errorMessages = [];
      if (!this.delivery.name) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
        return false;
      }
      else if(this.delivery.delivery_orders_attributes.length == 1){
        if(this.delivery.delivery_orders_attributes[0].is_discard != undefined && this.delivery.delivery_orders_attributes[0].delivery_location_id == null){
          this.errorMessages.push("入力されていない必須項目があります");
          this.$util.scrollToTop();
          return false;
        }
        else{
          return true;
        }
      }
      
      else if(this.delivery.delivery_orders_attributes.length == 0){
          this.delivery.delivery_orders_attributes.push({
          delivery_location_id: null,
          position: null,
        });
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
        return false;
      }
      else if(this.sameName){
        this.errorMessages.push('同じ配達先顧客名が複数選択されています');
        this.$util.scrollToTop();
        return false;
      }

      else{
        return true;
      }
    },

    // 配達先顧客名追加（新規登録のみ）
    addClientId(){
      let s = new Set(this.selectClientName);
      this.sameName = s.size !== this.selectClientName.length;
      if(!this.sameName){
        for(let i = 0; i < this.selectClientName.length; i++){
          let selectClient = this.clients_deliveries.find((p) => p.name == this.selectClientName[i]);
          if(selectClient != undefined){
            this.delivery.delivery_orders_attributes[i] = {
              'delivery_location_id': selectClient.place_id,
              'position': i + 1,
            };
          }
          else{
            this.delivery_orders_attributes.splice(i,1);
          }
        }
      }
    },

    // 選択済配達先顧客名の削除
    deleteDelivery(index) {
      if(this.edit){
        let deleteItem = this.delivery.delivery_orders.find(
          (d) => d.delivery_location_id == this.delivery.delivery_orders_attributes[index].delivery_location_id
        );
        if(deleteItem != undefined){
          this.deleteItem.push({
            'id': deleteItem.id,
            'is_discard': true,
          });
        }
      }
      this.selectClientName.splice(index,1);
      this.delivery.delivery_orders_attributes.splice(index, 1);
    },

    // 配達先顧客名の枠追加
    addClient() {
      this.delivery.delivery_orders_attributes.push({
        delivery_location_id: null,
        position: null,
      });
    },

    // 配送コース新規登録
    async registerDelivery(name) {
      this.load = true;
      this.errorMessages = [];
      this.addClientId();
      if (this.validationCheck()) {
        this.errorMessages = await this.$adminApi.postDelivery(this.delivery);
        if (!this.errorMessages.length) {
          this.$router.push("/admin/delivery");
          this.$showSuccessMessage(`${name}の配送コースを登録しました`);
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.load = false;
    },

    // 配送コース編集登録
    async editdelivery(name) {
      this.load = true;
      this.errorMessages = [];
      this.changeDelivery();
      if (this.validationCheck()) {
        delete this.delivery.delivery_orders;
        this.errorMessage = await this.$adminApi.putDelivery(
        this.$route.params.id,
        this.delivery
        );
        if (!this.errorMessage.length) {
          this.$router.push("/admin/delivery");
          this.$showSuccessMessage(`${name}の配送コースを更新しました`);
        }
        else{
          this.$util.scrollToTop();
        }
      };
      this.load = false;
    },

  },
  computed: {
    faCircleMinus() {
      return faCircleMinus;
    },
    faCircleXmark() {
      return faCircleXmark;
    },
    faCamera() {
      return faCamera;
    },
    faArrows() {
      return faArrows;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  position: relative;
  > .row_table {
    width: 80%;
    margin: 50px auto 200px;
    > .row {
      margin-top: 10px;
      align-items: stretch;
      > .heading {
        color: $color-txt2;
        width: 26%;
        background-color: $color-gray;
        border-radius: 3px;
        padding: 20px;
        font-size: 13px;
        font-weight: bold;
        > span {
          background-color: $color-red;
          color: white;
          padding: 4px 13px;
          border-radius: 20px;
          font-size: 12px;
          letter-spacing: 1px;
        }
      }
      > .detail {
        width: 72%;
        padding: 20px 0 20px 20px;
        position: relative;
        font-size: 12px;
        // 共通
        > .input {
          border: 1px solid $color-gray2;
          width: 100%;
          margin: 0;
          padding: 10px;
          border-radius: 3px;
          &:not(:first-child) {
            margin-left: 14px;
          }
          ::placeholder{
            color: $color-gray;
          }
        }
        > .limited{
          > .tilde{
            margin: 10px;
          }
        }
        > .btn{
          margin-left: 10px;
        }
        > .note {
          font-size: 10px;
          line-height: 16px;
          color: $color-txt2;
        }
        > .option_note {
          margin-bottom: 30px;
        }
        > .radios {
          width: 40%;
          > .radio {
            width: 50%;
          }
        }
        .row_s {
          > .selects {
            margin-bottom: 10px;
            > .arrows{
              margin-right: 10px;
              font-size: 20px;
              color: $color-gray2;
            }
            > .suggest {
              width: 85%;
              color: $color-txt;
              border: 1px solid $color-gray2;
              &.isSelected {
                color: $color-gray;
                border-width: 1.5px;
                border: 1px solid $color-gray2;
              }
              > select {
                width: 100%;
                padding: 10px;
              }
              // &:not(:first-child) {
              //   margin-left: 15px;
              // }
            }

            > .minus {
              transition: 0.5s;
              font-size: 25px;
              color: $color-red;
              margin-left: 15px;
              &:hover {
                filter: brightness(50%);
              }
            }
          }
          &:not(:first-child) {
            margin-top: 14px;
          }
        }
        > .row_s2 {
          border: 1px solid $color-gray2;
          border-radius: 5px;
          padding: 15px 10px;
          width: 93%;
          position: relative;
          &:not(:first-child) {
            margin-top: 10px;
          }
          .heading {
            width: 11%;
            text-align: right;
            font-size: 14px;
          }
          .detail {
            width: 90%;
            padding-left: 10px;
            > .input {
              input {
                border: 1px solid $color-gray2;
                padding: 10px;
                border-radius: 5px;
                width: 80%;
              }
            }
          }
          > .bottom {
            margin-top: 10px;
            > .detail {
              > .loader {
                z-index: 2;
                font-size: 10px;
                margin: 30px 0 30px 40px;
                top: 37%;
                left: 14%;
              }
              > input {
                display: none;
              }
              > .errorBox {
                top: auto;
                bottom: 0px;
              }
            }
          }
          .bottom {
            &._first {
              > .detail{
                height: 90px;
              }
            }
          }
          > .minus {
            position: absolute;
            font-size: 40px;
            right: -60px;
            top: 55px;
            color: $color-red;
            cursor: pointer;
            transition: 0.7s;
            &:hover {
              filter: brightness(50%);
            }
          }
        }

        // 個別
        > .price_input {
          width: 40%;
        }
        > .price_p , .short_p {
          padding-left: 10px;
        }
        > .textarea {
          width: 100%;
          border: 1px solid $color-gray;
          border-radius: 5px;
          height: 120px;
          > textarea {
            height: 120px;
            padding: 10px;
          }
          &._catch {
            height: 80px;
          }
          &::placeholder{
              color: $color-gray;
            }
        }
        > .delivery_textarea {
          height: 200px;
        }
        > .txtCount {
          padding-top: 10px;
          font-size: 13px;
          > p {
            padding-right: 6px;
          }
        }
      }
      > .delivery{
        > .inner_left{
          width: 100%;
        }
      }
      > .omit{
        > .input{
          width: 30%;
          display: inline-block;
        }
        > .note{
          display: inline-block;
          margin-left: 5px;
        }
      }
    }
  }
  > .deliveryBtn {
    border-radius: 5px;
    width: 140px;
    margin:100px auto 10px;
    padding: 9px 0;
    height: 40px;
    button {
      letter-spacing: 8px;
      font-size: 14px;
    }
  }
  > .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
