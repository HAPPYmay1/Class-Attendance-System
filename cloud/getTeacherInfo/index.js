// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-8g8xqfqy5b14662a'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  if(event.option=='get_loginInfo'){
    return await db.collection('teacherInfo').where({
      workId:event.loginInfo.act,
      loginPassword:event.loginInfo.psw
    }).get();
  }
  else if(event.option=='get_allcourse'){
    return await db.collection('attdenceCourse').where({
      workId:event.workId
    }).get();
  }
  else if(event.option=='del_atdCourse'){
    return await db.collection('attdenceCourse').where({
      _id:event.get_id
    }).remove();
  }
}