Page({
  data: {
    account:'',
    password:''
  },
  get_act(event){
    console.log("获取输入的账号",event.detail.value);
    this.setData({
      account:event.detail.value
    })
  },
  get_psw(event){
    console.log("获取输入的密码",event.detail.value);
    this.setData({
      password:event.detail.value
    })
  },
  login(){
    let account = this.data.account;
    let password = this.data.password
    console.log(account,password);
    wx.cloud.callFunction({
      name:'getTeacherInfo',
      data:{
        option:"get_loginInfo",
        loginInfo:{
          act:account,
          psw:password
        }
      },
      success: res =>{
        console.log(res.result.data[0]);
        if(res.result.data.length == 1){
          console.log("登录成功");
          wx.setStorageSync('teacherInfo', res.result.data[0])
          wx.redirectTo({
            url: '../teacherindex/index',
          })
        }
        else if(res.result.data.length > 1){
          wx.showToast({
            title: '系统出错，请联系管理员',
            icon:'error'
          })
        }
        else{
          wx.showToast({
            title: '账号或密码错误',
            icon:'error'
          })
        }
      },
      fail:err =>{
        console.log(err);
      }
    })
  }

})