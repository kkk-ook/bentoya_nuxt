<template>
  <div>
    <ErrorFlash
    :errorMessages="errorMessages"></ErrorFlash>
    <div class="user_table">
      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          氏名
          <span>必須</span>
        </div>
        <div class="detail flex _a-center name">
          <input type="text" placeholder="山田" v-model="user.last_name">
          <input type="text" placeholder="太郎" v-model="user.first_name">
        </div>
      </div>

      <div class="row flex _a-center _j-center kana">
        <div class="heading flex _a-center _j-between">
          カナ
          <span>必須</span>
        </div>
        <div class="detail flex _a-center name">
          <input type="text" placeholder="ヤマダ" v-model="user.last_name_kana">
          <input type="text" placeholder="タロウ" v-model="user.first_name_kana">
        </div>
      </div>

      <div class="row flex _a-center _j-center mail">
        <div class="heading flex _a-center _j-between">
          メールアドレス
          <span>必須</span>
        </div>
        <div class="detail">
          <input type="text" placeholder="メールアドレス" v-model="user.email">
        </div>
      </div>

      <div class="row flex _a-center _j-center pass">
        <div class="heading flex _a-center _j-between">
          パスワード
          <span v-show="!edit">必須</span>
        </div>
        <div class="detail flex _a-center pass">
          <div class="input" v-show="!edit">
            <input :type="pass_type" placeholder="パスワード" v-model.lazy="user.password">
            <fa
              :icon="pass_eye"
              class="faEye"
              @click="passLookChange"
            />
          </div>
          <div class="input" v-show="edit">
            <input :type="pass_type" placeholder="変更時のみ入力" v-model.lazy="user.password">
            <fa
              :icon="pass_eye"
              class="faEye"
              @click="passLookChange"
            />
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          確認用パスワード
          <span v-show="!edit">必須</span>
        </div>
        <div class="detail flex _a-center pass">
          <div class="input" v-show="!edit">
            <input :type="confirm_type" placeholder="確認用パスワード" v-model.lazy="password_confirmation">
            <fa
              :icon="confirm_eye"
              class="faEye"
              @click="confirmLookChange"
            />
          </div>
          <div class="input" v-show="edit">
            <input :type="confirm_type" placeholder="変更時のみ入力" v-model.lazy="password_confirmation">
            <fa
              :icon="confirm_eye"
              class="faEye"
              @click="confirmLookChange"
            />
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          顧客名<span>必須</span>
        </div>
        <div class="detail">
          <!-- <div class="selects flex _a-center _j-start"> -->
          <div class="suggest">
            <!-- <input type="text" autocomplete="on" list="client_name"/>
            <datalist id="client_name">  
              <option v-for="client in clients" :key="client.id">{{client.name}}</option>
            </datalist> -->
            <Multiselect
              v-model="selectClient"
              :options="clients_name"
              :searchable="true"
              :close-on-select="false"
              :allow-empty="false"
              placeholder="顧客名を選択してください">
            </Multiselect>
            <!-- <select class="select-parts" v-model="selectClient">
              <option :value="null" disabled>顧客名を選択</option>
              <option v-for="client in clients" :key="client.id">
                {{ client.name }}
              </option>
            </select> -->
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          納品場所<span>必須</span>
        </div>
        <div class="detail">
          <!-- <div class="selects flex _a-center _j-start"> -->
            <div class="suggest">
              <Multiselect
                v-model="selectLocation"
                :options="location_name"
                :searchable="true"
                :close-on-select="false"
                :allow-empty="false"
                placeholder="納品場所を選択してください">
              </Multiselect>
            </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center tel">
        <div class="heading flex _a-center _j-between">
          電話番号
          <span>必須</span>
        </div>
        <div class="detail">
          <input type="text" placeholder="09012345678" v-model="user.tel">
          <div class="errorBox" v-show="!numCheck(user.tel)">半角数字で入力してください</div>
          <p class="note">※ハイフン不要・半角数字で入力してください</p>
        </div>
      </div>

      <div
        class="userBtn btn-parts2 _red font-minchoB"
        @click="registerUser(user.last_name, user.first_name)"
        v-if="!btnLoad"
        v-show="!edit"
        >
        <button>登録</button>
      </div>

      <div
        class="userBtn btn-parts2 _red font-minchoB"
        @click="editUser(user.last_name, user.first_name)"
        v-if="!btnLoad"
        v-show="edit"
      >
        <button>更新</button>
      </div>
      <div class="loader" v-else></div>
    </div>
  </div>
</template>

<script>
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  layout: "admin",
  props: {
    edit: Boolean,
  },
  data() {
    return {
      selectClient: "",
      delivery_locations:[],
      location_name: [],
      selectLocation: "",
      errorMessages: [],
      load: false,
      btnLoad: false,
      clients: [],
      clients_name: [],
      clientsDeliveryLocations: [],
      lookChange: false,
      pass_type: "password",
      pass_eye: faEyeSlash,
      confirm_eye: faEyeSlash,
      confirm_type: "password",
      user: {
        delivery_location_id: null,
        last_name: "",
        first_name: "",
        last_name_kana: "",
        first_name_kana: "",
        email: "",
        password: "",
        tel: "",
      },
      password_confirmation: "",
    }
  },
  async mounted() {
    let clientsData = await this.$adminApi.searchClients();
    this.clients = clientsData.clients;
    for(let i = 0; i < this.clients.length; i++){
      this.clients_name.push(this.clients[i].company_name);
    }

    if(this.edit) {
      this.user = await this.$adminApi.getUser(this.$route.params.id);
      // 選択済顧客名と納品場所取ってくる
      for(let i = 0; i < this.clients.length; i++){
        for(let j = 0; j < this.clients[i].delivery_locations.length; j++){
          this.clientsDeliveryLocations.push(this.clients[i].delivery_locations[j]);
        }
      }
      let selectedLocation = this.clientsDeliveryLocations.find((c) => c.id == this.user.delivery_location_id);
      if(selectedLocation != undefined){
        let selectedClientId = selectedLocation.client_id;
        let selectedClient = this.clients.find((c) => c.id == selectedClientId);
        this.selectClient = selectedClient.company_name;

        if(selectedLocation != undefined){
          this.selectLocation = selectedLocation.name;
        }
      }
    }
  },
  methods: {
    validationCheck() {
      this.errorMessages = [];
      // 空白かどうか
      if(!this.user.last_name || !this.user.first_name || !this.user.last_name_kana || !this.user.first_name_kana
        || !this.user.email || !this.user.password || !this.password_confirmation || !this.user.delivery_location_id || !this.user.tel ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
      }
      // 電話番号
      else if(!(/^[0-9]+$/).test(this.user.tel)) {
        this.errorMessages.push("正しい電話番号を入力してください");
        this.$util.scrollToTop();
      }

      // メール
      else if(!(/^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/).test(this.user.email)) {
        this.errorMessages.push("正しいメールアドレスを入力してください");
        this.$util.scrollToTop();
      }

      // パスワード
      else if(this.user.password.length < 8 || this.user.password.length >= 15) {
        this.errorMessages.push("パスワードは8文字以上15文字以下で入力してください");
        this.$util.scrollToTop();
      }
      else if(!(/^[a-zA-Z0-9]+$/).test(this.user.password)) {
        this.errorMessages.push("パスワードは半角英数字で入力してください");
        this.$util.scrollToTop();
      }
      else if(this.user.password != this.password_confirmation) {
        this.errorMessages.push("パスワードと確認用パスワードが一致しません");
        this.$util.scrollToTop();
      }
    },

    editValidationCheck() {
      if(!this.user.last_name || !this.user.first_name || !this.user.last_name_kana || !this.user.first_name_kana
        || !this.user.email || !this.user.delivery_location_id || !this.user.tel ) {
        this.errorMessages.push("入力されていない必須項目があります");
        this.$util.scrollToTop();
        return false;
      } else {
        if(this.user.password || this.password_confirmation) {
          if(this.user.password != this.password_confirmation) {
            this.errorMessages.push("パスワードと確認用パスワードが一致しません");
            this.$util.scrollToTop();
          }
          else if(this.user.password.length < 8 || this.user.password.length >= 15) {
            this.errorMessages.push("パスワードは8文字以上15文字以下で入力してください");
            this.$util.scrollToTop();
          }
          else if(!(/^[a-zA-Z0-9]+$/).test(this.user.password)) {
            this.errorMessages.push("パスワードは半角英数字で入力してください");
            this.$util.scrollToTop();
          }
          else{
            return true;
          }
        }
        else {
          return true;
        }
      }
    },
    async registerUser(lastName, firstName) {
      this.load = true;
      this.validationCheck();
      if(!this.errorMessages.length) {
        this.errorMessages = await this.$adminApi.postUser(this.user);
        if(!this.errorMessages.length) {
          this.$router.push("/admin/user")
          this.$showSuccessMessage(`${lastName} ${firstName}さんを登録しました`)
          this.load = false;
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.load = false;
    },
    async editUser(lastName, firstName) {
      this.load = true;
      if(this.editValidationCheck()) {
        if(this.user.password){
          this.user.password_confirmation = this.user.password;
        }
        this.errorMessages = await this.$adminApi.putUser(this.$route.params.id, this.user);
        if(!this.errorMessages.length) {
          this.$router.push("/admin/user");
          this.load = false;
          this.$showSuccessMessage(`${lastName} ${firstName}さんの情報を更新しました`)
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.load = false;
    },
    //パスワード入力時の表示非表示切替
    passLookChange(){
      if(this.pass_type == "password"){
        this.pass_type = "text";
        this.pass_eye = faEye;
      }
      else{
        this.pass_type = "password";
        this.pass_eye = faEyeSlash;
      }
    },
    confirmLookChange(){
      if(this.confirm_type == "password"){
        this.confirm_type = "text";
        this.confirm_eye = faEye;
      }
      else{
        this.confirm_type = "password";
        this.confirm_eye = faEyeSlash;
      }
    }
  },
  computed: {
    numCheck() {
      return function(data) {
        if(data) {
          return (/^[0-9]*$/).test(data)
        } else {
          return true
        }
      }
    },
  },
  watch: {
    "selectClient":function(newVal){
      let client = this.clients.find((p) => p.company_name == newVal);
      if(client != undefined){
        this.delivery_locations = client.delivery_locations;
        this.location_name = [];
        for(let i = 0; i < this.delivery_locations.length; i++){
          this.location_name.push(this.delivery_locations[i].name);
        }
      }
    },
    "selectLocation":function(newVal){
      let location = this.delivery_locations.find((p) => p.name == newVal);
      if(location != undefined){
      this.user.delivery_location_id = location.id;
      }
    },
    deep: false,
    immediate: false
  },
}
</script>

<style lang="scss" scoped>
div {
  .user_table {
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
          }
        }
        > .detail {
          width: 72%;
          padding: 20px 0 20px 20px;
          position: relative;
          font-size: 12px;
          input {
            border: 1px solid $color-gray2;
            padding: 10px;
            border-radius: 3px;
            width: 100%;
            &::placeholder{
            color: $color-gray;
            }
          }
          .select {
            padding: 10px;
            border: 1px solid $color-gray2;
            width: 100%;
            .select-parts{
              width: 100%;
            }
          }
          > .errorBox {
            position: absolute;
            top: 50px;
          }
          > .top {
            > .btn {
              color: white;
              background-color: $color-red;
              font-size: 12px;
              margin-left: 20px;
              border-radius: 3px;
              text-align: center;
              transition: 0.5s;
              > button {
                padding: 8px 10px;
                font-size: 13px;
              }
              &:hover {
                filter: brightness(50%);
              }
            }
            > .loader {
              margin: 0 0 0 40px;
            }
            .errorBox2 {
              position: absolute;
              top: 50px;
            }
          }

          > .note {
            font-size: 12px;
            margin: 20px 0 0 0;
            color: $color-red;
            @media #{$phone} {
              font-size: 14px;
              margin: 20px 0 0;
            }
            > span {
              display: block;
              margin-top: 10px;
            }
          }
        }
        > .pass{
          > .input{
            width: 100%;
            position: relative;
            > .faEye{
              color: $color-gray2;
              position: absolute;
              right: 20px;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
        > .name{
          > input{
            &:not(:first-child) {
              margin-left: 14px;
            }
          }
        }
      }
      // > .pass{
      //   > .detail{
      //     font-size: 12px;
      //     border: 1px solid $color-gray;
      //     border-radius: 3px;
      //     > input{
      //       border: none;
      //     }
      //   }
      // }
      > .userBtn {
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
}
</style>