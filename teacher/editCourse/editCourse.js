// teacher/editCourse/editCourse.js
Page({
  data: {
    course: {},
    checkInstartTime:'',
    checkInendTime:'',
    st:0,
    sh:0,
    et:0,
    eh:0
  },

  onLoad: function(option) {
    this.get_CourseInfo();
  },
  onTimeChange: function (e) {
    this.setData({
      timeIndex: e.detail.value
    });
  },
  get_CourseInfo(e){
    const get_Id = wx.getStorageSync('course_Id')
    // 调用云函数获取课程信息
    wx.cloud.callFunction({
      name: 'attdenceCourse',
      data: {
          option:'get_course',
          get_Id
        },
      success: res => {
        this.setData({
           course: res.result.data[0]
          });
      },
      fail: err => {
        console.error('获取课程信息失败', err);
      }
    });
  },
  //课程名称的修改
  // onNameChange: function(e) {
  //   console.log(e.detail.value);
  //   // console.log(e);
  //   this.setData({
  //      'course.courseName': this.data.course.courseName
  //     });
  // },
  onStartTimeChange: function(e) {
    // console.log(e);
    this.setData({
       'course.checkInStartTime': e.detail.value,
       st:1
      });
  },
  startChange: function(e) {
    // console.log(e);
    this.setData({
       'course.startHour': e.detail.value ,
       sh:1
      });
  },
  endChange: function(e) {
    // console.log(e);
    this.setData({
       'course.endHour': e.detail.value,
       eh:1
      });
  },
  onEndTimeChange: function(e) {
    // console.log(e);
    this.setData({
       'course.checkInEndDay': e.detail.value,
       et:1
      });
  },

  onFormSubmit: function(e) {
    var formData = e.detail.value;
    const course_id = wx.getStorageSync('course_Id')
    // console.log(this.data.st);
    if(!this.data.st && !this.data.sh && !this.data.et && !this.data.eh){
      wx.showToast({
        title: '未进行更改',
        icon:"error"
      })
      //只修改开始日期
    }else{
      if(this.data.st == 0){
        formData.checkInStartTime = this.data.course.checkInStartTime
      }
      if(this.data.sh == 0){
        formData.startHour = this.data.course.startHour
      }
      if(this.data.et == 0){
        formData.checkInEndTime = this.data.course.checkInEndDay
      }
      if(this.data.eh == 0){
        formData.endHour = this.data.course.endHour
      }
      let start = formData.checkInStartTime +" "+formData.startHour
      let end = formData.checkInEndTime +" "+formData.endHour
      // console.log("这是test开始时间",start);
      // console.log("这是test结束时间",end);
      let courseStartTime = new Date(start).getTime();
      let courseEndTime = new Date(end).getTime();
      // console.log("转化之后的开始时间",courseStartTime);
      // console.log("转化之后的结束时间",courseEndTime);
      if(courseStartTime<courseEndTime){
        wx.cloud.callFunction({
        name:"editCourse",
        data:{
          option:'edit_ST',
          getid:course_id,
          editcos:formData
        },
        success: res =>{
          wx.redirectTo({
            url: '../attdenceMng/attdenceMng',
            })
          wx.showToast({
            title: '更改成功',
            icon:'success'
          })
        },
        fail: err =>{
          wx.showToast({
            title: '更新失败，请重试', 
            icon: 'error'
            });
        }
      })
      }else{
        wx.showToast({
          title: '结束时间必须大于开始时间',
          icon:"none"
        })
      }
      // console.log("这是formData",formData);
    }
  }
})