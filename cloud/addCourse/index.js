// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:'cloud1-8g8xqfqy5b14662a'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  if(event.option=='checkCourse'){
    const  courses  = await db.collection('Course').where({ teacherId:event.teaId }).get()
    let classes = []
    let coursename = []
    for (let i = 0; i < courses.data.length; i++) {
      classes.push(courses.data[i].courseClass)
      coursename.push(courses.data[i].courseName)
    }
    // 将临时数组转换为 Set 集合，确保班级名称不重复
    const uniqueClasses = new Set(classes)
    const uniqueName = new Set(coursename)
    // 再将 Set 集合转换为数组，得到不重复的班级名称数组
    const distinctClasses = Array.from(uniqueClasses)
    const distinctName = Array.from(uniqueName)
    const courseInfo ={
      distinctClasses,
      distinctName
    }
    return courseInfo
  }else if(event.option == 'add'){
    return await db.collection('attdenceCourse').add({ data:event.courseInfo })
  }else if(event.option == 'courseList'){ //查找课程表，某一老师所教授课程
    return await db.collection('Course').where({teacherId:event.workId}).get()
  }else if(event.option == 'checkStu'){
    return await db.collection('userData').where({
      userGrade:event.stuInfo.stugrd,
      userAcademy:event.stuInfo.stufy,
      classes:event.stuInfo.stuclass
    }).get()
  }else if(event.option == 'getClass'){
    return await db.collection('Course').where({
      courseName:event.cname
    }).get()
  }
}