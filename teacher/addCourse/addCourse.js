Page({
  data: {
    checkInStartTime: '',
    startHour:'',
    class:'',
    courseName:'',
    st:0,
    sh:0,
    et:0,
    eh:0,
    cn:0,
    cs:0
  },

  onLoad(options) {
    //获取时间
    this.onsetCourseTime();
    //获取教师所教授相关班级及课程
    this.checkCourseInfo();
  },
  checkCourseInfo:function(){
    let teaId = wx.getStorageSync('teacherInfo').workId
    wx.cloud.callFunction({
      name:'addCourse',
      data:{
        option:'checkCourse',
        teaId
      },
      success: res =>{
        const classes = res.result
        // console.log(classes);
        this.setData({
          class:classes.distinctClasses,
          courseName:classes.distinctName
        })
      },
      fail: err =>{
        console.log(err);
      }
    })
  },
  onsetCourseTime:function(){
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes().toString().padStart(2, '0');
    // console.log(year + '-' + month + '-' + day + ' ' + currentHour + ':' + currentMinute);
    this.setData({
      'course.checkInStartTime': year + '-' + month + '-' + day,
      'course.startHour':currentHour + ':' + currentMinute,
      'course.checkInEndDay': year + '-' + month + '-' + (day+1),
      'course.endHour':currentHour + ':' + currentMinute,
      class:this.data.class,
      courseName:this.data.courseName
    })
  },
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
  onClassChange:function(e){
    // console.log(e);
    this.setData({
      'course.class':this.data.class[e.detail.value],
      cs:1
    })
  },
  onCourseName:function(e){
    // console.log(this.data.courseName[e.detail.value]);
    this.setData({
      'course.courseName':this.data.courseName[e.detail.value],
      cn:1
    })
  },
  onFormSubmit: function(e) {
    var formData = e.detail.value;
    console.log(formData);
    const workId = wx.getStorageSync('teacherInfo').workId
    console.log(workId);
    // // console.log(this.data.st);
    if(!this.data.st && !this.data.sh && !this.data.et && !this.data.eh && !this.data.cn && !this.data.cs){
      wx.showToast({
        title: '请填写完整',
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
      if(this.data.cs == 0 || this.data.cn ==0){
        wx.showToast({
          title: '请填写完整',
          icon:'error'
        })
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
        console.log(formData);
        wx.cloud.callFunction({
        name:"addCourse",
        data:{
          option:'add',
          courseInfo:{
            courseName:formData.corName,
            workId:workId,
            courseClass:formData.atnClass,
            checkInStartTime:formData.checkInStartTime,
            startHour:formData.startHour,
            checkInEndDay:formData.checkInEndTime,
            endHour:formData.endHour,
            status:1
          }
        },
        success: res =>{
          wx.redirectTo({
            url: '../attdenceMng/attdenceMng',
            })
          wx.showToast({
            title: '发布成功',
            icon:'success'
          })
        },
        fail: err =>{
          wx.showToast({
            title: '发布失败，请重试', 
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