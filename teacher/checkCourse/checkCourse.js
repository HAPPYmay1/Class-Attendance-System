// teacher/checkCourse/checkCourse.js
Page({
  data: {
    courseNum:false,
    teaCourselist:[]
  },
  onLoad(options) {
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
        console.log(res.result.data);
        console.log(res.result.data.length);
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

})