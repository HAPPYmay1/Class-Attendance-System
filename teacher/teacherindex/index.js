// teacher/index/index.js
Page({
  data:{
    teacherInfo:''
  },
  onLoad(){
    let teacherInfo = wx.getStorageSync('teacherInfo')
    this.setData({
      teacherInfo : teacherInfo
    })
  },
  checkCourse(){
    wx.navigateTo({
      url: '../checkCourse/checkCourse',
    })
  },
  attendanceManage(){
    wx.navigateTo({
      url: '../attdenceMng/attdenceMng',
    })
  },
  courseStuMng(){
    wx.navigateTo({
      url: '../courseStuMng/courseStuMng',
    })
  },
  setting(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  atdDate(){
    wx.navigateTo({
      url: '../atdDate/atdDate',
    })
  }
})