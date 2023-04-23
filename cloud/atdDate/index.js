// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-8g8xqfqy5b14662a'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  if(event.option=='getatdCourseId'){
    const  atdcourses  = await db.collection('attdenceCourse').where({
       courseName:event.courseName,
       courseClass:event.courseClass
      }).get()
      let atdclassesId = []
      for (let i = 0; i < atdcourses.data.length; i++) {
        atdclassesId.push(atdcourses.data[i]._id)
      }
      return atdclassesId
  }else if(event.option == 'checkinPeo'){
    const peoNum = await db.collection('attdenceData').where({
      courseId:event.courseId
     }).get()
     const num = peoNum.data.length
     return num
  }else if(event.option == 'getPeoNum'){
    const peoNum = await db.collection('userData').where({
      userGrade:event.stuInfo.stugrd,
      userAcademy:event.stuInfo.stufy,
      classes:event.stuInfo.stuclass
    }).get()
    const num = peoNum.data.length
    return num
  }
}