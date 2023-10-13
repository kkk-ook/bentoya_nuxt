<template>
  <section class="use font-shuG">
    <Pankuzu :pans="pans"></Pankuzu>
    <div class="inner max-width-content">
      <h2>特定商取引法に基づく表記</h2>
      <h3>販売業社の名称</h3>
      <p>株式会社千成</p>
      <h3>所在地</h3>
      <p>〒737-0822　広島県呉市築地町5番10号</p>
      <h3>電話番号</h3>
      <p>0823-23-6741<br>受付時間 10:00-17:00（土日祝を除く）</p>
      <h3>メールアドレス</h3>
      <p>support@sennari-group.co.jp</p>
      <h3>運営統括責任者</h3>
      <p>名越裕晃</p>
      <h3>追加手数料等の追加料金</h3>
      <p>なし</p>
      <h3>交換および返品（返金ポリシー）</h3>
      <p>
        ＜お客様都合の返品・交換の場合＞<br>
        発送処理前の商品：ウェブサイトのキャンセルボタンを押すことで注文のキャンセルが可能です。<br>
        発送処理後の商品：未開封の商品は、商品到着後 当日中にお客様サポートセンター（電話番号：0823-23-6741）に<br>
        ご連絡いただいた場合に限り、お客様の送料負担にて返金又は同額以下の商品と交換いたします。<br>開封後の商品は、返品・交換はお受けしておりません。<br><br>
        ＜商品に不備がある場合＞<br>
        当社の送料負担にて返金又は新しい商品と交換いたします。まずはお客様サポートセンター（電話番号：0823-23-6741）までご連絡ください。
      </p>
      <h3>引渡時期</h3>
      <p>
        注文は１～３営業日以内に処理され、商品は指定日に到着します。<br>
        注文後すぐにご利用いただけます。</p>
      <h3>受け付け可能な決済手段</h3>
      <p>クレジットカード</p>
      <h3>決済期間</h3>
      <p>クレジットカード決済の場合はただちに処理されます。</p>
      <h3>販売価格</h3>
      <p>350円～1000円<br>各商品ページに記載の金額</p>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: "特定商取引法に基づく表記",
    };
  },
  data() {
    return {
      pans: [
        {
          path: "/terms/law",
          name: "特定商取引法に基づく表記",
        },
      ],
    }
  },
};
</script>

<style lang="scss" scoped>
.use {
  width: min(95%,1050px);
  margin: 30px auto 0;
  @media #{$phone}{
    width: 95%;
    font-size: 12px;
  }
  > .inner {
    font-family: 'Noto Sans JP';
    h2 {
      font-size: 1.6rem;
      line-height: 1.4;
      font-weight: bold;
      margin-bottom: 40px;
    }
    h3 {
      font-size: 1.4rem;
      margin-top: 30px;
      font-weight: 700;
    }
    p {
      margin: 15px 0 0;
      line-height: 1.5;
    }
    td {
      padding: 20px;
    }
  }
}
</style>
