// teacher/courseClassData/courseClassData.js
Page({
  data: {
    courseNum : false,
    classList:''
  },
  onLoad(options) {
    this.checkClass();
  },
  checkClass(){
    const cname = wx.getStorageSync('coursename')
    wx.cloud.callFunction({
      name:'addCourse',
      data:{
        option:'getClass',
        cname
      },
      success: res =>{
        if(res.result.data.length == 0){
          this.setData({
            classList: [], // 更新 teaCourselist 数组的值
            courseNum : false
          })
        }
        else{
          let classList = res.result.data;
          let courseNum = true
          // console.log(classList);
          this.setData({
            classList:classList,
            courseNum : courseNum,
            cname
          })
        }
      },
      fail: err =>{
        console.log(err);
      }
    })
  },
  checkStu(e){
    // console.log("点击查看学生");
    const classes = e.currentTarget.dataset.id;
    //年级
    const stugrd = classes.slice(0, 5)
    //分院
    const stufy = classes.slice(5, 9)
    //班级
    const stuclass = classes.slice(9, 11)
    wx.cloud.callFunction({
      name:'atdDate',
      data:{
        option:'getPeoNum',
        stuInfo:{
          stugrd:stugrd,
          stufy:stufy,
          stuclass:stuclass
        }
      },
      success: res =>{
        // console.log(res);
        wx.setStorageSync('classes', classes)
        wx.setStorageSync('classerNum',res.result)
        wx.navigateTo({
          url: '../atdChartShow/atdChartShow',
        })
      }
    })
    // console.log(e);
    
  },
  

})