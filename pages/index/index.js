// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    count: 0,
    flag: true,
    latitude: null,
    longitude: null,
    location: null,
    week: [
      'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    ],
    week_index: null,
    daily_forecast: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: false,
      success: (result) => {
        _this.setData({
          latitude: result.latitude,
          longitude: result.longitude
        })
        wx.request({
          url: 'https://free-api.heweather.com/s6/weather/forecast?location=' + result.longitude + ',' + result.latitude + '&key=2da0d5a5faed45d28b553114f704edfa',
          success: (res) => {
            var forecast = res.data.HeWeather6[0].daily_forecast
            var week_index = []
            for (var i = 0; i < forecast.length; i++) {
              var date = new Date(forecast[i].date)
              week_index.push(date.getDay)
            }
            _this.setData({
              week_index: week_index,
              location: res.data.HeWeather6[0].basic.location,
              daily_forecast: forecast
            })
            wx.request({
              url: 'https://free-api.heweather.com/s6/weather/now?location=' + result.longitude + ',' + result.latitude + '&key=2da0d5a5faed45d28b553114f704edfa',
              success: (result) => {
                var tmp = result.data.HeWeather6[0].now.tmp + "℃";
                const ctx = wx.createCanvasContext('myCanvas1', this);
                var cond_code = result.data.HeWeather6[0].now.cond_code
                if (cond_code === 100 || cond_code === 101 || cond_code === 102 || cond_code === 103) {
                  _this.grad(ctx, 'rgb(241,110,118)', 'rgb(245,141,121)')
                } else {
                  _this.grad(ctx, 'rgb(78,104,133)', 'rgb(226,220,214)')
                  wx.setNavigationBarColor({
                    frontColor: '#ffffff',
                    backgroundColor: '#4E6885',
                    animation: {
                      duration: 0,
                      timingFunc: 'linear'
                    },
                    success: (result) => {

                    },
                    fail: () => { },
                    complete: () => { }
                  });
                }
                ctx.setFontSize(15);
                ctx.setFillStyle('white');
                ctx.fillText(result.data.HeWeather6[0].basic.location, 80, 120)
                var date = new Date();
                var weekNum = date.getDay();
                var week = null
                switch (weekNum) {
                  case 0: week = '周日'; break;
                  case 1: week = '周一'; break;
                  case 2: week = '周二'; break;
                  case 3: week = '周三'; break;
                  case 4: week = '周四'; break;
                  case 5: week = '周五'; break;
                  case 6: week = '周六'; break;
                }
                ctx.fillText(week + ', ' + result.data.HeWeather6[0].now.cond_txt, 80, 150)
                ctx.setFontSize(70)
                ctx.fillText(tmp, 70, 240)
                ctx.draw()
              }
            })
          }
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },
  grad: function(ctx, color, colorstop) {
    // 创建线性渐变
    const grd = ctx.createLinearGradient(0, 0, 0, 400)
    grd.addColorStop(0, color)
    grd.addColorStop(1, colorstop)
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, 600, 600)
  },
  onShareAppMessage: function() {

  },
})
