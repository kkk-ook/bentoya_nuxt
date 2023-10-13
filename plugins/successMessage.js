// フラッシュメッセージ
function showSuccessMessage(content) {
  this.$store.commit('success/setMessage', {
    message: content
  })
  setTimeout(() => {
    this.$store.commit('success/deleteMessage')
  }, 2500)
}

export default ({ }, inject) => {
  inject('showSuccessMessage', showSuccessMessage);
}