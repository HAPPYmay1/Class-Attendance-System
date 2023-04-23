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
  //在一个云函数里面有4种数据库操作。所以要先判断是什么操作：增删改查

 //增
  if(event.option=='add'){
    return await db.collection('attdenceCourse').add({
      //花括号里面是你要添加的对象
      data:event.addData
      //可添加多条或一条
      //event:包含传过来的所有数据的一个对象
  });
  }
  //删
  else  if(event.option=="delete"){
  return await db.collection('attdenceCourse').where({
    //将要删除的值赋给name
    _id:event.delId
  }).remove();
  }

  //根据班级查询数据
  else if(event.option=="get"){
    return await db.collection('attdenceCourse').where({
      courseClass:event.getData
    }).get();
  }
  //通过courseId查询到相关数据进行修改
  else if(event.option=="update"){
    return await db.collection('attdenceCourse').where({
      _id : event.getcourseId
    }).update({
      data:event.updateData
    })
  }
  else if(event.option=="get_course"){
    return await db.collection('attdenceCourse').where({
      _id:event.get_Id,
    }).get();
  }
  else if(event.option=="get_status"){
    return await db.collection('attdenceData').where({
      courseId:event.courseId,
      studentId:event.studentId
    }).get({
      success:function(res){
        // console.log(res);
        return res
      }
    })
  }
}