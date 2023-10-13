<template>
<!-- ※後で変更 -->
  <section class="guide">
    <Pankuzu :pans="pans" />
    <div class="inner">
      <h2 class="title-font">ご利用案内</h2>
      <div class="content flex _j-between _a-start">
        <div class="nav-block">
          <ul class="nav-list">
            <li v-for="nav in navs" :key="nav.name" class="nav-item">
              <a :href="nav.href">
                <div class="text">{{ nav.name }}</div>
              </a>
            </li>
          </ul>
        </div>
        <div class="guide-block">
          <div class="guide-detail" id="how-to-order">
            <h3 class="common-guide-title">お弁当注文方法</h3>
            <h4 class="deliver-sub">
              【カートに入れる・支払い方法を選択する】
            </h4>
            <p class="description">
              注文したいお弁当が見つかったら、お届け日とご注文個数を選択し、<br />
              「カートに追加」ボタンをクリックしましょう。<br />
              ※この時点ではまだ、お品物は確保されていません。<br />
              カートをご確認後、「ご注文へ進む」ボタンをクリックします。<br />
              ご注文者情報、お届け先情報に間違いなければ「次に進む」ボタンをクリックします。<br />
              お支払い方法は「クレジットカード」のみのお支払いとなります。<br />
              クレジットカード情報を入力したら、「ご注文へ進む」ボタンをクリックします。
            </p>
            <h4 class="deliver-sub">【ご注文の確定】</h4>
            <p class="description">
              「最終注文確認」画面で、入力内容に間違いがないかをチェックしてください。<br />
              問題がなければ、「注文を確定する」ボタンをクリックして下さい。<br /><br />
              「注文完了」画面が表示されます。<br />
              ひとまずこれでご注文は完了しました。
            </p>
            <h4 class="deliver-sub">【自動メールを確認する】</h4>
            <p class="description">
              ご注文完了後、通常数分以内に自動で「ご注文有難うございました」というタイトルのメールが届きます。<br />
              これはお客様のご注文情報が当店のサーバに到着した時点で、自動的に送信されるものです。<br />
              もしこのメールが届かない場合はお問い合わせ下さい。<br />
              ご注文時に入力されたメールアドレスが間違っている可能性があります。
            </p>
            <h4 class="deliver-sub">【商品が届きます】</h4>
            <p class="description">
              お届け日になると、お弁当がお勤め先に届きます。<br />
            </p>
          </div>
          <div class="guide-detail" id="about-payment">
            <h3 class="common-guide-title">お支払いについて</h3>
            <p class="description">
              クレジットカードのみのお支払いとなります。<br /><br />
              <span class="big">①クレジットカード（手数料：無料）</span><br />
              <span class="indent"
                >Visa、MasterCard、JCB、AMEX、Dinersをご利用いただけます。<br />
                なお、お支払い回数は1回のみとさせていただきます。 </span
              >
            </p>
          </div>
          <div class="guide-detail" id="about-shipping">
            <h3 class="common-guide-title">配送について</h3>
            <p class="description">
              配送料は無料です。<br />
            </p>
          </div>
          <div class="guide-detail" id="about-return">
            <h3 class="common-guide-title">不備について</h3>
            <p class="description">
              お弁当について不備がございましたら、下記電話番号にご連絡ください。
            </p>
            <br />
            <a href="tel:0823-23-6741">TEL：<span class="tel">0823-23-6741</span></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: "ご利用案内",
    };
  },
  data() {
    return {
      pans: [
        {
          path: "/guide",
          name: "ご利用案内",
        },
      ],
      navs: [
        {
          name: "お弁当注文方法",
          href: "#how-to-order",
        },
        {
          name: "お支払いについて",
          href: "#about-payment",
        },
        {
          name: "配送について",
          href: "#about-shipping",
        },
        {
          name: "不備について",
          href: "#about-return",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.guide {
  font-family: 'Noto Sans JP'; 
  width: min(95%,1050px);
  margin: 30px auto 0;
  > .inner {
    color: $color-front;
    max-width: 1000px;
    @media screen and (max-width: 1000px) {
      width: 95%;
    }
    > .content {
      margin-top: 60px;
      @media screen and (max-width: 970px) {
        display: block;
      }
      > .nav-block {
        width: 23%;
        background-color: #fff;
        position: sticky;
        top: 30px;
        @media screen and (max-width: 970px) {
          width: 50%;
          min-width: 300px;
          position: static;
          margin: 0 auto 30px;
        }
        > .nav-list {
          // border: 1px solid #ccc;
          @media #{$phone} {
            border: 1px solid #ccc;
          }
          > .nav-item {
            &:not(:last-child) {
              // border-bottom: 1px solid #ccc;
              @media #{$phone} {
                border-bottom: 1px solid #ccc;
              }
            }
            > a {
              padding: 6px;
              display: flex;
              align-items: center;
              // transition: all 0.2s;
              &:hover {
                // background-color: $color-blue;
                border-bottom: 1px solid $color-red2;
                width: 80%;
                @media #{$phone} {
                  border: none;
                }
              }
              > .arrow {
                width: 12px;
                padding-bottom: 5px;
              }
              > .text {
                font-size: 15px;
                margin-left: 5px;
              }
            }
          }
        }
      }
      > .guide-block {
        width: 75%;
        @media screen and (max-width: 970px) {
          width: 100%;
        }
        .common-guide-title {
          font-size: 20px;
          border-bottom: 1.5px solid $color-red2;
          margin-bottom: 20px;
          font-weight: bold;
          padding-bottom: 10px;
          @media #{$phone} {
            font-size: 17px;
            font-weight: bold;
          }
        }
        h4 {
          font-size: 16px;
          font-weight: bold;
          margin: 40px 0 15px;
          margin-left: -8px;
          @media #{$phone} {
            margin-top: 45px;
          }
        }
        p {
          font-size: 15px;
        }
        > .guide-detail {
          @media #{$phone} {
            margin-top: -60px;
            padding-top: 60px;
          }
          &:not(:first-of-type) {
            margin-top: -60px;
            padding-top: 100px;
          }
          .description {
            line-height: 1.3;
            .red {
              color: $color-red2;
              font-weight: bold;
            }
            > .big {
              display: inline-block;
              margin: 5px 0;
              font-weight: bold;
            }
            > .indent {
              display: inline-block;
              margin-left: 15px;
            }
          }
          .tel {
            font-family: "Noto Sans JP", sans-serif;
            font-weight: bold;
            font-style: normal;
          }
          > a {
            &:hover {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }
}
</style>
