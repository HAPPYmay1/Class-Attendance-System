Page({
  data: {
    openid:''
  },
  onLoad(options) {
    let teacherInfo = wx.getStorageSync('teacherInfo')
    this.setData({
      openid : teacherInfo.openid
    })
  },
  //个人资料
  teaInfo(){
    console.log("按钮进入个人资料");
    wx.navigateTo({
      url: '../teaInfo/teaInfo',
    })
  },
  //解绑微信号
  untilWx(){
    
  },
})