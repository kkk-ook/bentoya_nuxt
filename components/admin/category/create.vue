<template>
  <div class="" ref="scrollElem">
    <ErrorFlash :errorMessages="errorMessages"></ErrorFlash>
    <div class="row_table">
      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          カテゴリ名
          <span>必須</span>
        </div>
        <div class="detail">
          <div class="input">
            <input type="text" name="" id="" placeholder="カテゴリ名" v-model="category.name">
          </div>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          締め日時<span>必須</span>
        </div>
        <div class="detail">
          <div class="radios flex _a-cetner _j-between">
            <div class="radio">
              <input
                type="radio"
                name="possible"
                id="possible"
                :value="false"
                v-model="category.is_same_day_reservation"
                class="radio-input"
              />
              <label for="possible" class="radio-txt">前日</label>
            </div>
            <div class="radio">
              <input
                type="radio"
                name="impossible"
                id="impossible"
                :value="true"
                v-model="category.is_same_day_reservation"
                class="radio-input"
              />
              <label for="impossible" class="radio-txt">当日</label>
            </div>
          </div>
          <div class="row_s">
            <div class="selects flex _a-center _j-start">
              <div class="select select-triangle">
                <select v-model="category.closing_time" class="select-parts">
                  <!-- <option :value="null" disabled>時間を選択</option> -->
                  <option v-for="(closing_time, closing_index) in closing_times" :key="closing_index">
                    {{ closing_time }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 後で修正 -->
      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          カテゴリ画像
          <span>必須</span>
        </div>
        <div class="detail">
          <div class="img featured" v-if="image">
            <div class="img_cell">
              <img :src="image" alt="" />
              <label class="surface flex _a-center _j-center" for="featured">
                画像を変更
              </label>
            </div>
            <fa :icon="faCircleXmark" class="icon" @click="deleteImg" />
          </div>
          <label
            class="img_btn flex _column _a-center _j-center"
            for="featured"
            v-else
          >
            <fa :icon="faCamera" class="icon" />
            <p>画像を追加</p>
          </label>
          <input type="file" id="featured" accept="image/*" @change="selectImg($event)" />
          <p class="note">・推奨サイズは1200px×800pxです</p>
          <p class="note">・対応ファイルはjpg/png/gifです。</p>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
        <div class="heading flex _a-center _j-between">
          アイコン
        </div>
        <div class="detail">
          <div class="img" v-if="icon">
            <div class="img_cell">
              <img :src="icon" alt="" />
              <label class="surface flex _a-center _j-center" for="icon">
                画像を変更
              </label>
            </div>
            <fa :icon="faCircleXmark" class="icon" @click="deleteIcon" />
          </div>
          <label
            class="img_btn icon flex _column _a-center _j-center"
            for="icon"
            v-else
          >
            <fa :icon="faCamera" class="icon" />
            <p>画像を追加</p>
          </label>
          <input type="file" id="icon" accept="image/*" @change="selectIcon($event)" />
          <p class="note">・対応ファイルはjpg/png/gifです。</p>
          <p class="note">・推奨サイズは200px×200pxです。</p>
        </div>
      </div>

      <div class="row flex _a-center _j-center">
          <div class="heading flex _a-center _j-between">
          説明
        </div>
        <div class="detail">
          <div class="textarea">
            <textarea placeholder="説明" v-model="category.description"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="loader-area" v-if="load">
      <div class="loader"></div>
    </div>
    <div class="categoryBtn btn-parts2 _red">
      <button v-if="edit" @click="editCategory">更新する</button>
      <button v-else @click="addCategory">登録</button>
    </div>
  </div>
</template>

<script>
import {
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export default {
  props: {
    edit: Boolean,
    paretnId: Number,
  },
  data() {
    return {
      errorMessages: [],
      btnLoad: false,
      icon: null,
      image: null,
      category: {
        name: "",
        icon: null,
        image: null,
        description: "",
        is_same_day_reservation: false,
        closing_time: "",
      },
      newCategory: {},
      oldName: "",
      oldImg: "",
      oldIcon: "",
      oldDescription: "",
      oldIs_same_day_reservation: "",
      oldClosing_time: "",
      btnName: "",
      closing_times: [],
      load: true,
    };
  },
  async mounted() {
    // 締め日の時間準備
    for(let i = 0; i < 24; i++){
      let time = 0;
      time += i;
      this.closing_times.push(time + ":00");
    }
    if(this.edit){
      this.category = await this.$adminApi.getCategoryEdit(this.$route.params.id);
      if(this.category.icon != null){
        this.category.icon = this.category.icon.url;
      }
      this.image = this.category.image.url;
      this.oldName = this.category.name;
      this.oldImg = this.category.image.url;
      if(this.category.icon != null){
        this.oldIcon = this.category.icon.url;
      }
      this.oldDescription = this.category.description;
      this.oldIs_same_day_reservation = this.category.is_same_day_reservation;
      this.oldClosing_time = this.category.closing_time;
    }
    this.load = false;
  },
  methods: {
    async selectImg(e) {
      if (e.target.files[0]) {
        this.category.image = e.target.files[0];
        this.image = URL.createObjectURL(e.target.files[0]);
      } else {
        return;
      }
    },
    async selectIcon(e) {
      if (e.target.files[0]) {
        this.category.icon = e.target.files[0];
        this.icon = URL.createObjectURL(e.target.files[0]);
      } else {
        return;
      }
    },
    async addCategory() {
      this.load = true;
      if (this.validationCheck()) {
        this.errorMessages = await this.$adminApi.postCategory(this.category);
        if (!this.errorMessages.length) {
          this.$router.push("/admin/category");
          this.$showSuccessMessage(
            `カテゴリ[${this.category.name}]を追加しました`
          );
        }
        else{
          this.$util.scrollToTop();
        }
      }
      this.load = false;
    },
    async editCategory() {
      this.load = true;
      if (this.validationCheck()) {
        if(this.changeCheck()){
          this.errorMessages = await this.$adminApi.putCategory(
          this.$route.params.id,
          this.newCategory
          );
          if (!this.errorMessages.length) {
            this.$router.push("/admin/category");
            this.$showSuccessMessage(`カテゴリ[${this.category.name}]を更新しました`);
          }
          else{
            this.$util.scrollToTop();
          }
        }
      }
      this.load = false;
    },
    validationCheck() {
      this.errorMessages = [];
      if (!this.category.name ||
          this.category.image == null
        ) {
        this.errorMessages.push("入力されていない必須箇所があります");
        this.$util.scrollToTop();
        return false;
      }
      else if(!this.category.closing_time
      ){
        this.errorMessages.push("必須項目を選択してください");
        this.$util.scrollToTop();
        return false;
      } 
      else {
        return true;
      }
    },

    changeCheck(){
      this.errorMessages = [];

      if(this.oldName != this.category.name){
        this.newCategory.name = this.category.name;
      }

      if(Object.keys(this.category.image).length == 0){
        this.newCategory.image = this.category.image;
      }

      if(this.category.icon != null){
        if(Object.keys(this.category.icon).length == 0){
          this.newCategory.icon  = this.category.icon;
        }
      }

      if(this.oldDescription != this.category.description){
        this.newCategory.description  = this.category.description;
      }

      if(this.oldIs_same_day_reservation != this.category.is_same_day_reservation){
        this.newCategory.is_same_day_reservation = this.category.is_same_day_reservation;
      }

      if(this.oldClosing_time != this.category.closing_time){
        this.newCategory.closing_time = this.category.closing_time;
      }

      if(Object.keys(this.newCategory).length == 0){
        this.errorMessages.push("変更箇所がないため更新できません");
        this.$util.scrollToTop();
        return false;
      }
      else{
        return true;
      }
    },

    deleteImg() {
      this.category.image = null;
      this.image = null;
    },
    deleteIcon() {
      this.category.icon = null;
      this.icon = null;
    },
  },
  computed: {
    faCircleXmark() {
      return faCircleXmark;
    },
    faCamera() {
      return faCamera;
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  position: relative;
  > .row_table {
    width: 80%;
    margin: 50px auto 0;
    > .row {
      width: 100%;
      margin-top: 10px;
      align-items: stretch;
      > .heading {
        width: 26%;
        font-family: "MinchoB";
        background-color: $color-gray;
        border-radius: 3px;
        padding: 25px;
        letter-spacing: 1.5px;
        > span {
          background-color: $color-red;
          color: white;
          padding: 4px 13px;
          border-radius: 20px;
          font-size: 12px;
          letter-spacing: normal;
        }
      }
      > .detail {
        width: 72%;
        padding: 25px 0 25px 20px;
        > .input {
          border: 1px solid $color-gray3;
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

        > .radios {
          width: 50%;
          > .radio {
            width: 50%;
          }
        }

        > .row_s {
          width: 40%;
          > .selects {
            > .select {
              width: 100%;
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
              &:not(:first-child) {
                margin-left: 15px;
              }
            }
            > .btn{
              margin-left: 10px;
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

        > .img {
          width: 40%;
          margin-bottom: 20px;
          position: relative;
          transition: 0.5s;
          > .img_cell {
            aspect-ratio: 1.5;
            > img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 5px;
            }
            > .surface {
              opacity: 0;
              transition: 0.7s;
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              color: white;
              background-color: rgba(0, 0, 0, 0.649);
            }
            &:hover {
              .surface {
                opacity: 1;
              }
            }
          }
          > .icon {
            font-size: 30px;
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: $color-gray3;
            border: 1px solid $color-gray3;
            border-radius: 25px;
            color: $color-wh;
            z-index: 3;
            transition: 0.4s;
            &:hover {
              filter: brightness(50%);
            }
          }
        }
        > .img_btn {
          width: 40%;
          border: 1px solid $color-gray3;
          margin-bottom: 20px;
          aspect-ratio: 1.5;
          border-radius: 5px;
          color: $color-gray2;
          cursor: pointer;
          > .icon {
            font-size: 50px;
          }
          > p {
            font-size: 13px;
            padding-top: 10px;
          }
        }
        > .icon{
          width: 120px;
          aspect-ratio: 1;
        }
        > input {
          display: none;
        }

        > .textarea {
          width: 100%;
          border: 1px solid $color-gray2;
          border-radius: 5px;
          height: 120px;
          > textarea {
            height: 120px;
            padding: 10px;
          }
          ::placeholder{
            color: $color-gray;
          }
        }
        
        > .note {
          font-size: 12px;
          line-height: 16px;
          color: $color-txt2;
        }
      }
    }
  }
  > .categoryBtn {
    border-radius: 5px;
    width: 140px;
    margin:100px auto 200px;
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
