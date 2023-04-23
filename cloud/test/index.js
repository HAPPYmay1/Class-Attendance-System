// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-8g8xqfqy5b14662a'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //写有关于数据库操作的地方
  //获取数据库的连接对象
  const db = cloud.database();
  try {
    // 从 courseList 表中查询所有课程信息
    const courseList = await db.collection('attdenceCourse')
    .where({
      courseClass:event.courseClass
    }).get()
    // 从 checkinRecord 表中查询当前用户的打卡记录
    const checkinRecord = await db.collection('attdenceData')
      .where({
       courseId:event.courseId, // 课程ID
       studentId:event.studentId // 用户ID
      })
      .get()

    return {
      courseList: courseList.data,
      checkinRecord: checkinRecord.data
    }
  } catch (err) {
    console.log(err)
    return err
  }
}