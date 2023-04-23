// 引入图表
import * as echarts from '../../ec-canvas/echarts';
let chart = null;
Page({
  data: {
    ec: {
      onInit: true
    },
    //签到率
    checkinDate:'',
  },
  onLoad(options) {
    const coursename = wx.getStorageSync('coursename')
    const classes = wx.getStorageSync('classes')
    this.setData({
      coursename,
      classes,
    })
    this.averageAtdDate()
    this.lazyComponent = this.selectComponent('#my-echart')
    setTimeout(() =>{
      let atdDate  = (this.data.atdDate).toFixed(0)
      // console.log(atdDate);
      this.init(atdDate)
    },1000)
  },
  init(checkinStu){
    this.lazyComponent.init((canvas,width,height,dpr) =>{
      let chart = echarts.init(canvas,null,{
        width:width,
        height:height,
        devicePixelRatio:dpr
      })
      let option = getOption(checkinStu)
      chart.setOption(option)
      this.chart = chart  //将图表实例绑定到this上，方便在其他函数中访问
      return chart
    })
  },
  averageAtdDate(){
    wx.cloud.callFunction({
      name:'atdDate',
      data:{
        option:'getatdCourseId',
        courseName:this.data.coursename,
        courseClass:this.data.classes
      },
      success: res =>{
        // console.log(res.result[0]);
          this.setData({
            checkinDate:0,
            courseID:res.result
          })
          this.checkinPeople();
      },
      fail: err =>{
        console.log(err);
      }
    })
  },
  // checkinPerple(){
  //   const allnum = wx.getStorageSync('classerNum')
  //   // console.log(allnum);
  //   const courseID = this.data.courseID;
  //   let num = 0
  //   // console.log("考勤课程id",courseID);
  //   // console.log("考勤课程有多少",courseID.length);
  //   if(courseID.length == 0){
  //     console.log("该课程无打卡");
  //   }else{
  //     for(let i=0; i<courseID.length; i++){
  //       // console.log(courseID[i]);
  //       wx.cloud.callFunction({
  //         name:'atdDate',
  //         data:{
  //           option:'checkinPeo',
  //           courseId:courseID[i]
  //         },
  //         success: res =>{
  //           // console.log(res.result);
  //           num = num + res.result
  //           this.setData({
  //             num
  //           })
  //         }
  //       })
        
  //       // console.log("第",i,"次",this.data.peonum);
  //       // num = num + this.data.peonum 
  //       // console.log(this.data.peonum);
  //     }
  //     console.log(allnum);
  //     console.log(courseID.length);
  //     console.log(this.data.num);
  //   }
    
    // let atdDate = (this.num)/(allnum * courseID.length)
    // console.log(atdDate);
  // },
  checkinPeople() {
    const allnum = wx.getStorageSync('classerNum');
    const courseID = this.data.courseID;
    let num = 0;
  
    if (courseID.length == 0) {
      console.log("该课程无打卡");
    } else {
      const promises = courseID.map((id) => {
        return wx.cloud.callFunction({
          name: 'atdDate',
          data: {
            option: 'checkinPeo',
            courseId: id,
          },
        });
      });
      Promise.all(promises).then((res) => {
        for (let i = 0; i < res.length; i++) {
          num += res[i].result;
        }
        this.setData({
          num: num,
        });
        // console.log(allnum);
        // console.log(courseID.length);
        // console.log(this.data.num);
        let atdDate = ((this.data.num)/(allnum * courseID.length)*100)
        let atdDate1 = atdDate.toFixed(0) + "%"
        // console.log(atdDate);
        this.setData({
          atdDate,
          atdDate1
        })
      });
    }
  },

})
function getOption(checkinStu) {
  console.log();
  return {
    title: {
      text: '学生考勤状况',
      // subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '打卡百分比（%）',
        type: 'pie',
        radius: '50%',
        data: [
          { value: checkinStu, name: '已打卡' },
          { value: (100-checkinStu), name: '未打卡' },
          // { value: 580, name: 'Email' },
          // { value: 484, name: 'Union Ads' },
          // { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
}