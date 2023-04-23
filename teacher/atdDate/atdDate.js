// teacher/atdDate/atdDate.js
Page({
  data: {
    courseNum : false
  },
  onLoad() {
    this.check_atdCourse();
  },
  check_atdCourse: function(){
    let workId = wx.getStorageSync('teacherInfo').workId
    wx.cloud.callFunction({
      name:'addCourse',
      data:{
        option:"courseList",
        workId:workId
      },
      success: res =>{
        // console.log(res.result.data);
        // console.log(res.result.data.length);
        if(res.result.data.length == 0){
          this.setData({
            teaCourselist: [], // 更新 teaCourselist 数组的值
            courseNum : false
          })
        }
        else{
        let teaCourselist = res.result.data;
        let courseNum = true
        this.setData({
          teaCourselist:teaCourselist,
          courseNum : courseNum
        })
      }
      }
    })
  },
  checkStu(e){
    // console.log("点击查看学生");
    const cname = e.currentTarget.dataset.id;
    // console.log(e);
    wx.setStorageSync('coursename', cname)
    wx.navigateTo({
      url: '../courseClassData/courseClassData',
    })
  },
})