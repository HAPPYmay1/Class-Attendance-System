// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-8g8xqfqy5b14662a'
})
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  if(event.option=='edit_ST'){
    return await db.collection('attdenceCourse').where({
      _id:event.getid
    }).update({
      data:event.editcos
    })
  }
  else if(event.option=='check'){
    return await db.collection('attdenceCourse').where({
      _id:event.getid
    }).get()
  }
}