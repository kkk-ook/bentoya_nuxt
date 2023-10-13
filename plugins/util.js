class Util {

  // ログイン判定
  isFrontLogin() {
    const uid = localStorage.getItem('user-uid');
    const client = localStorage.getItem('user-client');
    const accessToken = localStorage.getItem('user-access-token');
    if (accessToken && client && uid) {
      return true;
    } else {
      window.location.href = '/login';
    }
  }

  isAdminLogin() {
    const uid = localStorage.getItem('admin-uid');
    const client = localStorage.getItem('admin-client');
    const accessToken = localStorage.getItem('admin-access-token');
    if (accessToken && client && uid) {
      return true;
    } else {
      window.location.href = '/admin/login';
    }
  }

  isLostLogin(){
    localStorage.removeItem('user-access-token');
    localStorage.removeItem('user-client');
    localStorage.removeItem('user-uid');
    localStorage.removeItem("deliveryDays");
    localStorage.removeItem("orderStopDayBefore");
    localStorage.removeItem("orderStopThatDay");
    localStorage.removeItem("orderStopHolidayBefore");
    localStorage.removeItem("purchaseable");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("orderData");
    window.location.href = "/login";
  }

  /**
   * ページネーションカウント
   * @param {*} lengthCount 取得数
   * @param {*} perPage １ページあたりの表示件数
   * @param {*} currentPage 現在のページ
   * @param {*} total 総数
   * @returns
   */
  displayCount(lengthCount, perPage, currentPage) {
    const startOffset = perPage * (currentPage - 1) + 1;
    const endOffset = lengthCount == perPage ? perPage * currentPage : startOffset + lengthCount - 1;
    return `${startOffset}-${endOffset}件を表示`
  }
  
  // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  // 正規表現：エラーがあればエラーメッセージ、なければ何も返さない
  // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

  // メールアドレスチェック
  regexEmail(email) {
    const regex = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if (!regex.test(email) && email) {
      return "正しいメールアドレスを入力してください";
    } else {
      return
    }
  }

  // パスワードチェック
  regexPass(password) {
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,16}$/i;
    if (!regex.test(password) && password) {
      return "半角英数字を1種類以上含む8文字以上にしてください";
    } else {
      return
    }
  }
  
  // 半角数字のみかどうかのチェック
  regexHankakuNum(num) {
    const regex = /^[0-9]*$/;
    if (!regex.test(num)) {
      return "半角数字のみで入力してください";
    } else {
      return 
    }
  }

  // 携帯電話番号チェック
  regexTel(tel) {
    const regex = /^0[789]0\d{8}$/;
    if (!regex.test(tel) && tel) {
      return "正しい携帯電話番号を入力してください";
    } else {
      return
    }
  }

  // 携帯・固定番号チェック
  regexTel2(tel) {
    const regex = /^0\d{9,10}$/;
    if (!regex.test(tel) && tel) {
      return "正しい携帯電話番号を入力してください";
    } else {
      return
    }
  }

  // FAX電話番号チェック
  regexFax(fax) {
    const regex = /^0\d{9,10}$/;
    if (!regex.test(fax) && fax) {
      return "正しい電話番号を入力してください";
    } else {
      return
    }
  }

  // カナチェック
  regexKana(kana) {
    const regex = /^[\u30A0-\u30FF]+$/;
    if (!regex.test(kana) && kana) {
      return "カナで入力してください";
    } else {
      return
    }
  }

  /**
   * ページ上部までスクロールする
   */
  scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

/**
 * 住所自動入力
 * @param {*} userData
 * @param {*} addressErrorMessages
 */
async function inputAddress(userData, addressErrorMessages) {
  addressErrorMessages.splice(0, addressErrorMessages.length);
  if (userData.postal_code) {
    const postalCode = userData.postal_code;
    if (postalCode.match(/^[0-9]{7}$/)) {
      const address = await this.$commonApi.searchAddress(postalCode);
      if (address) {
        userData.prefecture = this.$constants.PREFECTURES.find(
          (prefecture) => {
            return address.address1 == prefecture.name
          }
        ).id;
        userData.address1 = address.address2 + address.address3;
      } else {
        addressErrorMessages.push("住所が見つかりませんでした。")
      }
    } else {
      addressErrorMessages.push("郵便番号は半角数字7桁で入力してください。")
    }
  } else {
    addressErrorMessages.push("郵便番号を入力してください")
  }
  return false;
}

function replaceZenkaku(val) {
  const CHAR_REG = new RegExp(
  "(" + Object.keys(this.$constants.CHAR_DICT).join("|") + ")",
  "g"
)
  const formatAlphanumeric = val.replace(
        /[a-zA-Z0-9!-/:-@¥[-`{-~]/g,
        (s) => {
          return String.fromCharCode(s.charCodeAt(0) + 65248);
        }
      );
      const zenkakuData = formatAlphanumeric
        .replace(CHAR_REG, (s) => {
          return this.$constants.CHAR_DICT[s];
        })
        .replace(/ﾞ/g, "゛")
        .replace(/ﾟ/g, "゜");
  return zenkakuData;
}

export default ({ }, inject) => {
  const util = new Util();
  inject("util", util);
  inject('inputAddress', inputAddress);
  inject('replaceZenkaku', replaceZenkaku);
}
