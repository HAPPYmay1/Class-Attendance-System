// pages/newlogin/newlogin.js
const db = wx.cloud.database()
Page({
  data:{
    //分院专业
    multiArray:[["电信分院","土建分院","文法分院"],['计算机科学与技术','网络工程']],
    multiIndex: [0, 0],
    fengyuan:'',
    //年级
    grade:'',
    gradeDetail:["2018级","2019级","2020级","2021级"],
    //班级
    classes:'',
    classesdetail:["1班","2班","3班","4班","5班","6班","7班","8班","9班","10班"]
  },
//分院
  bindchangefy(e){
    this.setData({
      multiIndex: e.detail.value,
      fengyuan:[
        [this.data.multiArray[0][e.detail.value[0]]],[this.data.multiArray[1][e.detail.value[1]]]
      ]
    })
  },
  //专业
  bindchangefyColumnChange(e){
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
    };
    // console.log(data);
    //变化成第column列第value个
    data.multiIndex[e.detail.column] = e.detail.value;
    switch(e.detail.column){
      //判断是第几列在变化
      case 0:
        switch(e.detail.value){
          case 0:
            data.multiArray[1] = ['计算机科学与技术','网络工程'];
            break;
          case 1:
            data.multiArray[1] = ['土木工程','工程造价'];
            break;
          case 2:
            data.multiArray[1] = ['法学','金融']
            break;
        }
        break;
    }
    // console.log('若改变了',data.multiArray[0][data.multiIndex[0]]+data.multiArray[1][data.multiIndex[1]]);
    this.setData(data);
  },
  //年级
  bindchangeGrade(e){
    // console.log(e.detail.value);
    const res = this.data.gradeDetail[e.detail.value];
    this.setData({
      grade:res
    })
  },
  bindchangebj(e){
    const res2 = this.data.classesdetail[e.detail.value];
    this.setData({
      classes:res2
    })
  },
  register(e){
    let userData = e.detail.value;
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(userData);
    if(!userData.userName){
      wx.showToast({
        icon:'error',
        title: '请填写姓名',
      })
      return;
    }
    if(!userData.userPhone){
      wx.showToast({
        icon:'error',
        title: '请填写电话',
      })
      return;
    }
    if(!userData.userId){
      wx.showToast({
        icon:'error',
        title: '请填写学号',
      })
      return;
    }
    if(!userData.userAcademy){
      wx.showToast({
        icon:'error',
        title: '请选择学院专业',
      })
      return;
    }
    if(!userData.userGrade){
      wx.showToast({
        icon:'error',
        title: '请选择年级',
      })
      return;
    }
    if(!userData.classes){
      wx.showToast({
        icon:'error',
        title: '请选择班级',
      })
      return;
    }
    wx.cloud.callFunction({
      name: "databaseOpe",
      data:{
        option:'update',
        getOpenid:userInfo.openid,
        updateData:{
        // _id:userData.userId,
        userName:userData.userName,
        userPhone:userData.userPhone,
        userId:userData.userId,
        userAcademy:(userData.userAcademy).slice(0,4),
        userMajor:(userData.userAcademy).slice(5,20),
        userGrade:userData.userGrade,
        classes:userData.classes
        }
      },
      success: res => {
        wx.showToast({
          title: '注册成功',
        })
        //返回个人中心页
        setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      },1000);
        console.log("详细资料数据添加成功");
      },
      fail: err =>{
        console.log("详细资料添加失败",err);
        wx.setStorageSync('userInfo',null)
        wx.cloud.callFunction({
          name:"databaseOpe",
          data:{
            option:"delete",
            delId:userInfo.openid
          },
          success: res =>{
            console.log("添加失败，删除该openid成功");
          }
        })
      }
    })
  },
  onUnload: function () {
    // // 清除 Storage 中的数据
    // let userInfo = wx.getStorageSync('userInfo')
    // let loginok = false
    // wx.cloud.callFunction({
    //   name:"databaseOpe",
    //   data:{
    //     option:"delete",
    //     delId:userInfo.openid
    //   },
    //   success: res =>{
    //     wx.removeStorageSync('userInfo');
    //     console.log("点击返回按钮，删除该openid成功");
    //   }
    // })
    
  }
})
    // 云开发，将数据存入云数据库的用户表中userData
  //   wx.cloud.database().collection('userData').add({
  //     data:{
  //       _id:userData.userId,
  //       userName:userData.userName,
  //       userPhone:userData.userPhone,
  //       userId:userData.userId,
  //       userAcademy:(userData.userAcademy).slice(0,4),
  //       userMajor:(userData.userAcademy).slice(5,20),
  //       userGrade:userData.userGrade,
  //       classes:userData.classes
  //     }
  //   }).catch(res =>{
  //     console.log('注册失败');
  //     wx.showToast({
  //       icon:'error',
  //       title: '手机号存在',
  //     })
  //   })
  // }
