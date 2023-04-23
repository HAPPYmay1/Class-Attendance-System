// teacher/stuList/stuList.js
Page({
  data: {
    classes:'',
    num:0,
    stuName:''
  },
  onLoad(options) {
    const classes = wx.getStorageSync('classes')
    this.setData({
      classes:classes
    })
    this.checkStu();
  },
  checkStu(){
    //年级
    const stugrd = this.data.classes.slice(0, 5)
    //分院
    const stufy = this.data.classes.slice(5, 9)
    //班级
    const stuclass = this.data.classes.slice(9, 11)
    // console.log(stugrd,stufy,stuclass);
    wx.cloud.callFunction({
      name:'addCourse',
      data:{
        option:'checkStu',
        stuInfo:{
          stugrd:stugrd,
          stufy:stufy,
          stuclass:stuclass
        }
      },
      success: res =>{
        const stuNum = res.result.data.length
        // console.log(stuNum);
        console.log(res);
        this.setData({
          num:stuNum,
          stuName:res.result.data
        })
      },
      fail: err =>{
        console.log(err);
      }
    })

  },
  onUnload() {
    wx.removeStorageSync('classes')
  },
})