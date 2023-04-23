// pages/checkin/checkin.js
var timeUtil = require('../timeUtil.js');
Page({
  data: {
    latitude: '',
    longitude: '',
    address: '',
    markers: [],
    isPunched: false,
    sucgetloction:true,
    sucgetphoto:true,
    userInfo : null,
    cloudPath:''
  },
  onLoad: function () {
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo : userInfo
    })
  },
  // 点击打卡后，将数据上传到数据库中
  signin(e){
    var currentTime = timeUtil.getTimestamp();
    var currentCourse = wx.getStorageSync('currentCourse')
    // console.log("点击打卡后传回的数据",e);
    // console.log("地址",e.detail.value.location);
    // console.log("拍照数据",this.data.cloudPath);
    // console.log("用户信息数据",this.data.userInfo.openid);
    // console.log("课程id",currentCourse._id);
    // console.log("老师姓名",currentCourse.courseTeacher);
    //当前时间
    // console.log("时间",currentTime);
    //需要传回数据库中的数据
    // data:{
    //   openid : this.data.userInfo.openid,
    //   location : e.detail.value.location,
    // }
    wx.cloud.callFunction({
      name : "checkinDatabase",
      data:{
        option:"add",
        addData:{
          courseId:currentCourse._id,
          teacherId:currentCourse.courseTeacher,
          studentId:this.data.userInfo.openid,
          checkInTime:currentTime,
          status:'1',
          location:e.detail.value.location
        }
      },
      success: res =>{
        wx.navigateBack({
          delta: 0,
        })
        wx.showToast({
          title: '打卡成功',
          icon:'success'
        },1000)
      },
      fail: err =>{
        console.log(err);
      }
    })
  },
  // 获取当前位置
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success:res =>{
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        this.getAddress(res.latitude, res.longitude)
        this.setMarkers(res.latitude, res.longitude)
        wx.hideLoading()
      },
      fail:err =>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '获取位置失败，请检查网络',
          icon: 'none'
        })
      }
    })
  },
  // 获取位置对应的地址
  getAddress(latitude, longitude) {
    // console.log(this.data.latitude,this.data.longitude);
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&key=ZSEBZ-NU7N3-KE23Q-3KMPB-K3T7Q-JGFJU',
      success:res =>{
        let address = res.data.result.address
        // console.log(address);
        // console.log(userInfo.openid);
        this.setData({
          address: address,
          sucgetloction : false
        })
      },
      fail:err => {
        console.log(err)
        wx.showToast({
          title: '获取地址失败，请检查网络',
          icon: 'none'
        })
      }
    })
  },
  // 设置地图标记
  setMarkers(latitude, longitude) {
    let marker = {
      id: 1,
      latitude: latitude,
      longitude: longitude,
      width: 32,
      height: 32
    }
    let markers = []
    markers.push(marker)
    this.setData({
      markers: markers
    })
  },
  // 拍摄人脸
  takePhoto() {
    // console.log(this.data.userInfo);
    this.setData({
      sucgetphoto : false
    })
    wx.showLoading({
      title: '正在拍摄人脸...',
      success: res =>{
        wx.showToast({
              title: '拍摄完成，请确认打卡',
              icon: 'success'
            },500)
      }
    })
    // },setTimeout(function (){
    //   wx.hideLoading()
    //   wx.showToast({
    //     title: '拍摄超时，请重试',
    //     icon: 'none'
    //   })
    // },5000))
    wx.createCameraContext().takePhoto({
      quality: 'high',
      success:res =>{
        this.uploadFacePhoto(res.tempImagePath)
      },
      fail:err =>{
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '拍摄失败，请重试',
          icon: 'none'
        })
      }
    })
  },
  // 上传人脸图片
  uploadFacePhoto(path) {
    // let userInfo = wx.getStorageSync('userInfo')
    // console.log(this.data.userInfo);
    wx.cloud.uploadFile({
      cloudPath: 'face/' + this.data.userInfo.openid +'/'+ this.data.userInfo.nickName + '-' + Date.now() + '.jpg',
      filePath: path,
      success:res =>{
        console.log(res.fileID);
        // this.checkFace(res.fileID)
        this.setData({
          cloudPath : res.fileID,
          sucgetphoto : false
        })
      },
      fail:err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })
      }
    })
  }
})
