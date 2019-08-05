const formatTime = date => {
  const year = date.getFullYear()
  const month = parseInt(date.getMonth() + 1)
  const day = parseInt(date.getDate())
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDateTime = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  console.log(month + ":" + day + ":" + hour + ":" + minute)
  return [month, day].join('.') + ' ' + [hour, minute].join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDateTime: formatDateTime
}
