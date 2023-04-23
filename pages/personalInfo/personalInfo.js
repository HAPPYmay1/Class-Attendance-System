// pages/personalInfo/personalInfo.js
Page({
  data: {
  },
  onShow : function(){
    let openid = wx.getStorageSync('userInfo').openid
    wx.cloud.callFunction({
      name : "databaseOpe",
      data:{
        option : "get",
        getData : openid
      },
      success : res =>{
        let userInfo = res.result.data[0]
        // console.log(userInfo);
        this.setData({
          userInfo : userInfo
        }),
        wx.showToast({
          title: '正在加载',
          icon: 'loading',
          duration: 500 //持续的时间
        })
        // console.log(res);
      }
    })
  }
 
})