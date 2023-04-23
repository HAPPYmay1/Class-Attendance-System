Page({
  data: {
    teaCourselist:[],
    courseNum:false
  },
  onLoad(options) {
    // console.log(teacherId.workId);
    this.check_atdCourse();
  },
  //查询考勤课程
  check_atdCourse: function(){
    let teacherId = wx.getStorageSync('teacherInfo')
    wx.cloud.callFunction({
      name:'getTeacherInfo',
      data:{
        option:"get_allcourse",
        workId:teacherId.workId
      },
      success: res =>{
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
  editCourse: function(e) {
    const course_Id = e.currentTarget.dataset.id;
    console.log('编辑考勤课程');
    wx.setStorageSync('course_Id', course_Id)
    wx.navigateTo({
      url: '../editCourse/editCourse',
    })
  },
  deleteCourse: function(e) {
    // console.log('删除考勤课程');
    const course_Id = e.currentTarget.dataset.id;
    // console.log(course_Id);
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除该考勤吗？',
      success (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name:"getTeacherInfo",
            data:{
              option:'del_atdCourse',
              get_id:course_Id
            },
            success: res =>{
              that.check_atdCourse();
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              })
            },
            fail: err =>{
              // console.log(err);
              wx.showToast({
                title: '删除失败，请重试',
                icon: 'error'
              },500)
            }
          })
        } else if (res.cancel) {
          // console.log('取消删除')
        }
      }
    })
  },
  addCourse:function(){
    console.log("点击进入添加课程");
    wx.redirectTo({
      url: '../addCourse/addCourse',
    })
  }
})