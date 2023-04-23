// pages/courseList/courseList.js
Page({
  data: {
    courseList:[],
    loginStatus:false
  },
  onLoad(){
    let openid = wx.getStorageSync('userInfo').openid
    if(openid != null){
      this.init();
      this.setData({
        loginStatus:true
      })
    }else{
      wx.showToast({
        title: '请登录后使用',
        icon:'none'
      })
    }
  },
  //获取打卡课程列表
  init:function(){
    //获取用户的班级信息
    let openid = wx.getStorageSync('userInfo').openid
    wx.cloud.callFunction({
      name : "databaseOpe",
      data :{
        option : 'get',
        getData : openid
      },
      success : res =>{
        //获取用户所在班级的所有考勤信息
        const userClass = res.result.data[0].userGrade + res.result.data[0].userAcademy + res.result.data[0].classes
        // console.log(userClass);
        wx.cloud.callFunction({
          name : "attdenceCourse",
          data:{
            option:'get',
            getData:userClass
          },
          success: res =>{
            //考勤列表遍历出来
            var courseList = res.result.data
            // console.log(courseList);
            var now = new Date().getTime();
            for (let i = 0; i < courseList.length; i++) {
              let cId =  courseList[i].courseId;
              //课程courseid
              let course_id = courseList[i]._id
              //课程代码，不是唯一标识符_id
              let st = courseList[i].checkInStartTime + " " + courseList[i].startHour
              let et = courseList[i].checkInEndDay + " " + courseList[i].endHour
              // console.log(st,et);
              let courseStartTime = new Date(st).getTime();
              let courseEndTime = new Date(et).getTime();
              // console.log("开始",courseStartTime);
              // console.log("结束",courseEndTime);
              //获取打卡情况信息，查询学生是否已经打卡
              wx.cloud.callFunction({
                name:"attdenceCourse",
                data:{
                  option:"get_status",
                  courseId:course_id,
                  studentId:openid
                },
                success: res =>{
                  let checkinstatus = res.result.data
                  // console.log('第',i,'个',res.result.data);
                  if(checkinstatus.length != 0){
                    courseList[i].checkinstatus = "已打卡"
                    this.setData({
                      courseList : courseList,
                    })
                  }else{
                    if (now < courseStartTime) {
                      wx.cloud.callFunction({
                        name : "attdenceCourse",
                        data:{
                          option:'update',
                          getcourseId:course_id,
                          updateData:{
                            status:'0'
                          }
                        },
                        success: res =>{
                          courseList[i].checkinstatus = "未开始"
                          this.setData({
                            courseList : courseList,
                          })
                        }
                      })
                    }
                    // 如果当前时间在考勤期间内，则为考勤中
                    else if (now >= courseStartTime && now < courseEndTime) {
                          wx.cloud.callFunction({
                            name : "attdenceCourse",
                            data:{
                              option:'update',
                              getcourseId:course_id,
                              updateData:{
                                status:'1'
                              }
                            },
                            success: res =>{
                              courseList[i].checkinstatus = "打卡"
                              this.setData({
                                courseList : courseList,
                              })
                              // this.setData({
                              //   courseList:courseList[i]
                              // })
                            },
                            fail: err =>{
                              console.log(err,cId);
                            }
                          })
                        }
                    // 如果当前时间大于课程结束时间，则为已过期
                    else {
                      wx.cloud.callFunction({
                        name : "attdenceCourse",
                        data:{
                          option:'update',
                          getcourseId:course_id,
                          updateData:{
                            status:'2'
                          }
                        },
                        success: res =>{
                          courseList[i].checkinstatus = "已过期"
                          this.setData({
                            courseList : courseList,
                          })
                        },
                        fail: err =>{
                          // console.log(err,cId);
                        }
                      })
                    }
                  }
                  // this.setData({
                  //   courseList : courseList,
                  // })
                },
                fail: err =>{
                  wx.showToast({
                    title: '加载失败',
                    icon:"error"
                  },500)
                }
              })
            }
          }
        })
      }
    })
  },
   // 打卡按钮点击事件
  handleCheckIn: function(e) {
    //通过点击事件获取该课程ID
    const courseId = e.currentTarget.dataset.id;
    // console.log(courseId);
    //通过课程唯一标识符文档ID：_id 查询课程相关考勤信息
    wx.cloud.callFunction({
      name: "attdenceCourse",
      data: {
        option:"get_course",
        get_Id:courseId
      },
      success: function(res) {
        var course = res.result.data[0];
        // console.log(course);
        wx.setStorageSync('currentCourse', course);
        wx.navigateTo({
          url: '../checkin/checkin',
        })
      },
      fail: function(err) {
        console.error(err);
      }
    });
  },
  quickLogin(){
    wx.switchTab({
      url: '../user-center/usercenter',
    })
  }
})
