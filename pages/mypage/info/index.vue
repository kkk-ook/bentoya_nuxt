<template>
  <div class="my-page max-width-content">

    <ul class="delivery_table">
      <li class="cell flex _a-center _j-start">
        <div class="heading">姓名（漢字）</div>
        <div class="detail flex _a-center">
          <p>{{ user.last_name }}</p>
          <p>{{ user.first_name }}</p>
        </div>
      </li>
      <li class="cell flex _a-center _j-start">
        <div class="heading">姓名（カナ）</div>
        <div class="detail">
          <p>{{ user.last_name_kana }}</p>
          <p>{{ user.first_name_kana }}</p>
        </div>
      </li>
      <li class="cell flex _a-center _j-start">
        <div class="heading">会社名</div>
        <div class="detail">{{ selectClient }}</div>
      </li>
      <li class="cell flex _a-center _j-start">
        <div class="heading">納品場所</div>
        <div class="detail">{{ selectLocation }}</div>
      </li>
      <li class="cell flex _a-center _j-start">
        <div class="heading">メールアドレス</div>
        <div class="detail">{{ user.email }}</div>
      </li>
      <li class="cell flex _a-center _j-start">
        <div class="heading">電話番号</div>
        <div class="detail">{{ user.tel }}</div>
      </li>
    </ul>

    <div class="link-col">
      <nuxt-link to="/terms/use" class="link">利用規約</nuxt-link>
      <nuxt-link to="/terms/privacy_policy" class="link"
        >個人情報保護方針</nuxt-link
      >
    </div>

    <div class="userBtn btn-parts2 _red">
      <nuxt-link :to="`/mypage/info/edit/`">
        <button>編集</button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      selectClient: "",
      selectLocation: "",
    }
  },
  async mounted() {
    let data = await this.$frontApi.getUserState();

    if(!data.errorMessages.length){
      this.user = data.user;
      this.selectClient = this.user.client.company_name;
      this.selectLocation = this.user.delivery_location.name;
    }
    else{
      this.$util.isLostLogin();
    }
  }
};
</script>

<style lang="scss" scoped>
.point-col {
  border: 1.5px solid $color-gray;
  color: black;
  @media #{$phone} {
    border: 1px solid $color-gray;
  }
  > .total_col {
    font-weight: bold;
    padding: 25px 20px;
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1);
    @media #{$phone} {
      padding: 10px 15px;
      margin-bottom: 20px;
    }

    > .title {
      @media #{$phone} {
        font-size: 14px;
        color: $color-front;
      }
    }

    > .point {
      font-size: 25px;
      color: $color-front;
      &::after {
        content: attr(data-txt);
        font-size: 14px;
        padding-left: 10px;
      }
      @media #{$phone} {
        font-size: 21px;
      }
    }
  }

  > .open {
    //font-size: 18px;
    padding: 20px;
    overflow-y: scroll;
    height: 500px;
    // -ms-overflow-style: none;
    // scrollbar-width: none;
    @media #{$phone} {
      height: 300px;
      padding: 15px;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    > .title {
      margin-top: 20px;
      padding-left: 25px;
      position: relative;
      font-size: 15px;
      @media #{$phone} {
        font-size: 13px;
        padding-left: 20px;
        margin-top: 0;
      }

      &::before {
        content: "P";
        position: absolute;
        font-size: 16px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background-color: $color-red2;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        @media #{$phone} {
          font-size: 14px;
          max-width: 18px;
          height: 18px;
        }
      }
    }

    > .list {
      > .item {
        border-bottom: 1px solid $color-gray;
        padding: 30px 0 40px;
        @media #{$phone} {
          padding: 10px 0;
        }
        &:last-of-type {
          border-bottom: none;
        }

        > .group {
          //width: min(100%, 600px);
          @media #{$phone} {
            display: block;
          }

          > .day {
            font-size: 15px;
            margin-left: 25px;
            @media #{$phone} {
              font-size: 13px;
              margin-left: 20px;
            }
          }

          > .point_history {
            font-size: 15px;
            @media #{$phone} {
              text-align: right;
              font-size: 12px;
            }

            &::after {
              content: attr(data-text);
              font-size: 18px;
              @media #{$phone} {
                font-size: 11px;
                padding-left: 2px;
              }
            }

            &._rd {
              color: $color-red2;
            }
            &._bl {
              color: $color-red2;
            }

            &._point {
              @media #{$phone} {
                font-size: 20px;
              }
              &._plus {
                color: $color-red2;
                &::before {
                  content: "+";
                  padding-right: 6px;
                  @media #{$phone} {
                    padding-right: 2px;
                  }
                }
              }

              &._minus {
                color: $color-red2;
                &::before {
                  content: "-";
                  padding-right: 10px;
                  @media #{$phone} {
                    padding-right: 6px;
                  }
                }
              }
            }
          }

          > .status {
            font-size: 16px;
            @media #{$phone} {
              text-align: left;
              margin: 10px 0 -20px 0;
            }
          }

          button {
            color: #fff;
            border-radius: 3px;
            background-color: $color-red2;
            padding: 7px 30px;
            white-space: nowrap;
            display: block;
            font-size: 15px;
            width: fit-content;
            @media #{$phone} {
              margin: 10px 0 0 auto;
              font-size: 13px;
            }
          }

          > .point_history01 {
            font-size: 20px;
          }
        }
      }
    }
  }
}

.link-col {
  margin: 0 auto;
  width: fit-content;
  text-align: center;
  > .link {
    display: block;
    text-decoration: underline;
    font-size: 15px;
    color: $color-front;
    //font-size: 18px;
    &:not(:first-child) {
      margin-top: 10px;
    }
    @media #{$phone} {
      font-size: 13px;
    }
  }
}

.my-page {
  color: black;

  > .title {
    //font-size: 20px;
    text-align: center;
  }

  .delivery_table {
    margin: 50px 0 70px;
    color: $color-front;
    @media #{$phone} {
      margin: 30px 0;
    }

    > .cell {
      margin-top: 10px;
      align-items: stretch;
      font-size: 13px;
      @media #{$phone} {
        display: block;
        margin-top: 6px;
      }

      > .heading {
        width: 23%;
        background-color: $color-gray;
        padding: 20px;
        border-radius: 5px;
        font-size: 16px;
        @media #{$phone} {
          width: 100%;
          padding: 7px 10px;
          font-size: 14px;
          border-radius: 3px;
        }
      }

      > .detail {
        width: 75%;
        padding: 0 20px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 16px;
        @media #{$phone} {
          padding: 10px 0;
          width: 95%;
          margin: 0 auto;
          font-size: 14px;
          border-radius: 0;
        }
        > p {
          &:not(:first-child) {
            padding-left: 8px;
          }
        }
      }
    }
  }

  > .userBtn {
    margin: 30px auto 40px;
    width: 160px;

    button {
      letter-spacing: 3px;
      width: 100%;
      padding: 12px;
    }
  }

  > .loader {
    margin: 0 auto 80px;
  }
}
</style>
