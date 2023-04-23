// pages/user-center/usercenter.js
Page({
  data:{
  },
  //授权登录
  login(){
    wx.getUserProfile({
      desc: '用户获取学生资料完善登录',
      success:res => {
        let user = res.userInfo;
        // console.log('用户信息',user);
        // console.log('整体信息',res);
        //获取用户唯一标识openId
        wx.login({
          //成功放回
          success:res => {
            // console.log(res);
            // 通过云函数获取用户openid
            this.setData({
              username : user.nickName,
              userheadimg : user.avatarUrl
            })
            console.log("我运行到这里了1");
            wx.cloud.callFunction({
              name:"getOpenid",
              success: res => {
                let useropenid = res.result.openid
                // console.log("获取openid成功",res.result.openid);
                user.openid = res.result.openid
                // console.log(useropenid);
                console.log("我运行到这里了2");
                //云函数查询数据库是否包含该openid
                wx.cloud.callFunction({
                  name:"databaseOpe",
                  data:{
                    option : 'get',
                    getData : useropenid
                  },
                  success : res => {
                    // console.log(res);
                    console.log("我运行到这里了3");
                    if(!res.result.data[0]){
                      console.log("没找到");
                      //数据库中没有该用户openid跳转到信息填写界面
                      wx.setStorageSync('userInfo',user)
                      wx.navigateTo({
                      url: '../register/newlogin',
                      success: function(res) {
                        // console.log(useropenid);
                        wx.cloud.callFunction({
                          name: "databaseOpe",
                          data:{
                            option:'add',
                            addData:{
                            _id:useropenid
                            }
                          },
                          success: res => {
                            console.log("openid数据添加成功");
                          },
                          fail: err =>{
                            console.log("openid添加失败",err);
                          }
                        })
                      },    
                      fail: function(res) {
                      },
                      complete: function(res) {
                      },
                    })
                    }else{
                      console.log("找到了");
                      this.setData({
                        loginok:true
                      })
                      wx.setStorageSync('userInfo', user)
                    }
                  },
                  fail : res => {
                    console.log("有问题",res);
                  }
                })
                // wx.setStorageSync('userInfo', user.openid)
                // wx.setStorageSync('username', user.nickName)
                // wx.setStorageSync('userheadimg',user.avatarUrl)
                },fail: res => {
                  console.log("获取openid失败",res);
                }
              })
            }
        })
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration: 500//持续的时间
        })
      },
      fail:res => {
        // console.log('授权失败',res);
      }
    })
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo')
    // console.log("userInfo",userInfo);
    // let userId = wx.getStorageSync('useropenId')
    // let username = wx.getStorageSync('username')
    // let userheadimg = wx.getStorageSync('userheadimg')
    //  console.log(userId);
    if(userInfo){
      this.setData({
        username : userInfo.nickName,
        userheadimg : userInfo.avatarUrl,
        loginok:true
      })
    }else{
      loginok: false
    }
  },
  //退出登录
  loginOut(){
    wx.showModal({
      title: '提示',
      content: '是否要退出登录',
      success: res => {
        if (res.confirm) { //这里是点击了确定以后
          this.setData({
            loginok:false
          }),
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration: 1000 //持续的时间
          }),
          // wx.setStorageSync('useropenId', null)
          // wx.setStorageSync('username', null)
          // wx.setStorageSync('userheadimg',null)
          wx.clearStorageSync()
        } else { //这里是点击了取消以后
          // console.log('取消退出')
        }
      }
    })
  },
  personal_btn(){
    // console.log("个人资料");
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },
  teacher_login(){
    // console.log("教师登录点击按钮");
    wx.redirectTo({
      url: '../../teacher/login/login',
    })
  }

})