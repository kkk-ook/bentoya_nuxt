const constants = {
  // 都道府県
  PREFECTURES: [
    { id: 1, name: "北海道" },
    { id: 2, name: "青森県" },
    { id: 3, name: "岩手県" },
    { id: 4, name: "宮城県" },
    { id: 5, name: "秋田県" },
    { id: 6, name: "山形県" },
    { id: 7, name: "福島県" },
    { id: 8, name: "茨城県" },
    { id: 9, name: "栃木県" },
    { id: 10, name: "群馬県" },
    { id: 11, name: "埼玉県" },
    { id: 12, name: "千葉県" },
    { id: 13, name: "東京都" },
    { id: 14, name: "神奈川県" },
    { id: 15, name: "新潟県" },
    { id: 16, name: "富山県" },
    { id: 17, name: "石川県" },
    { id: 18, name: "福井県" },
    { id: 19, name: "山梨県" },
    { id: 20, name: "長野県" },
    { id: 21, name: "岐阜県" },
    { id: 22, name: "静岡県" },
    { id: 23, name: "愛知県" },
    { id: 24, name: "三重県" },
    { id: 25, name: "滋賀県" },
    { id: 26, name: "京都府" },
    { id: 27, name: "大阪府" },
    { id: 28, name: "兵庫県" },
    { id: 29, name: "奈良県" },
    { id: 30, name: "和歌山県" },
    { id: 31, name: "鳥取県" },
    { id: 32, name: "島根県" },
    { id: 33, name: "岡山県" },
    { id: 34, name: "広島県" },
    { id: 35, name: "山口県" },
    { id: 36, name: "徳島県" },
    { id: 37, name: "香川県" },
    { id: 38, name: "愛媛県" },
    { id: 39, name: "高知県" },
    { id: 40, name: "福岡県" },
    { id: 41, name: "佐賀県" },
    { id: 42, name: "長崎県" },
    { id: 43, name: "熊本県" },
    { id: 44, name: "大分県" },
    { id: 45, name: "宮崎県" },
    { id: 46, name: "鹿児島県" },
    { id: 47, name: "沖縄県" },
  ],

  ADMINMENUS: [
    {
        id: 1,
        name: "配送",
        link: "/admin/order",
        icon: "/admin/order.svg",
        child: [
          {
            id: 1,
            name: "配送",
            link: "/admin/order",
          },
          {
            id: 2,
            name: "キャンセル",
            link: "/admin/cancel",
          },
        ],
    },
    {
      id: 2,
      name: "商品",
      link: "/admin/product",
      icon: "/admin/product.svg",
      child: [
        {
          id: 1,
          name: "商品",
          link: "/admin/product",
        },
        {
          id: 2,
          name: "カテゴリ",
          link: "/admin/category",
        },
      ],
    },
    {
      id: 3,
      name: "配送コース",
      link: "/admin/delivery",
      icon: "/admin/delivery.svg",
    },
    {
      id: 4,
      name: "ユーザー",
      link: "/admin/user",
      icon: "/admin/user.svg",
    },
    {
      id: 5,
      name: "顧客",
      link: "/admin/client",
      icon: "/admin/client.svg",
    },
    {
      id: 6,
      name: "設定",
      link: "/admin/setting",
      icon: "/admin/setting.svg",
      child: [
        {
          id: 1,
          name: "管理者",
          link: "/admin/setting",
        },
        {
          id: 2,
          name: "休日設定",
          link: "/admin/setting/holiday",
        },
      ],
    },
  ],

  FRONTMENUS: [
    {
      id: 1,
      name: "ホーム",
      link: "/",
      icon: "/fronts/front/header/home.svg",
    },
    {
      id: 2,
      name: "商品一覧",
      link: "/product",
      icon: "/fronts/front/header/menu-list.svg",
    },
    // {
    //   id: 3,
    //   name: "コンセプト",
    //   link: "/",
    //   icon: "/fronts/front/header/concept.svg",
    // },
    {
      id: 3,
      name: "ご利用案内",
      link: "/guide",
      icon: "/fronts/front/header/guide.svg",
    },
    {
      id: 4,
      name: "カート",
      link: "/cart",
      icon: "/fronts/front/header/cart.svg",
    },
  ],

  FRONTMENUS_S: [
    {
      id: 1,
      name: "ホーム",
      link: "/",
      icon: "/fronts/front/header/home.svg",
    },
    {
      id: 2,
      name: "商品一覧",
      link: "/product",
      icon: "/fronts/front/header/menu-list.svg",
    },
    // {
    //   id: 3,
    //   name: "コンセプト",
    //   link: "/",
    //   icon: "/fronts/front/header/concept.svg",
    // },
    {
      id: 3,
      name: "ご利用案内",
      link: "/guide",
      icon: "/fronts/front/header/guide.svg",
    },
  ],

  FOOTERMENUS: [
    {
      id: 1,
      name: "ホーム",
      link: "/"
    },
    {
      id: 2,
      name: "商品一覧",
      link: "/product"
    },
    // {
    //   id: 3,
    //   name: "コンセプト",
    //   link: "/concept"
    // },
    {
      id: 3,
      name: "ご利用案内",
      link: "/guide"
    },
    {
      id: 4,
      name: "利用規約",
      link: "/terms/use"
    },
    {
      id: 5,
      name: "プライバシーポリシー",
      link: "/terms/privacy_policy"
    },
    {
      id: 6,
      name: "特定商取引法に基づく表記",
      link: "/terms/law"
    }
  ],
};

export default ({}, inject) => {
  inject("constants", constants);
};
