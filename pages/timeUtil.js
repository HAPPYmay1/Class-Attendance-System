function getTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()
  return `${year}/${month}/${date}  ${hour}:${minute}:${second}`
}

//错误提示：创建了一个新的函数记得模块化导出，不然在别的文件中引用该Js文件将显示 "not have this function"
module.exports = {
  getTimestamp: getTimestamp
}
