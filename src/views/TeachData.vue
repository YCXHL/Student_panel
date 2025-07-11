<template>
  <div class="dashboard-container">
    <main class="content-area">
      <div class="cards-container">
        <!-- 左侧系统状态卡片 -->
        <div class="card left-card">
          <h2>系统状态</h2>
          <p :style="{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.2rem' }">当前用户状态正常</p>
          <div class="description">
            <p>你好，{{ userdata["username"] }} ！</p>
            <p>欢迎使用智能教学分析系统</p>
          </div>

          <!-- 教学数据卡片容器 -->
          <div style="flex-wrap: wrap; margin: -10px;">
            <div 
              class="card" 
              v-for="(item, key) in teach_data" 
              :key="key"
              style="
                margin: 10px;
                box-sizing: border-box;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                padding: 16px;
              "
            >
              <h3>记录</h3>
              开始时间：{{ formatFullTime(key) }}<br />
              结束时间：{{ formatFullTime(item.end_time) }}<br />
              <div :ref="'chart-' + key" style="width: 100%; height: 250px;"></div>
              <button class="ai-btn" @click="request_analyze(key,item)" :disabled="isLoading" :class="{ 'loading': isLoading }">{{ai_analyze_state}}</button>
              <br />
              <div class="card" style="white-space: pre-wrap;">{{ai_analyze[key]}}</div>
            </div>
          </div>
        </div>

        <!-- 右侧用户信息卡片 -->
        <div class="card right-card">
          <h2>用户信息</h2>
          <div class="data-item">
            <a style="font-size: large; color: #3498db;">你好，{{ userdata["username"] }} ！</a>
            <br />
            <a style="font-size: large; color: #7f8c8d;">地区: {{ userdata["province"] }}省{{ userdata["city"] }}市 </a>
            <br />
            <a style="font-size: large; color: #7f8c8d;">学校: {{ userdata["school"] }} </a>
            <br />
            <a style="font-size: large; color: #7f8c8d;">班级: {{ userdata["class"] }} </a>
          </div>
        </div>
      </div>
    </main>
  </div>
  
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import * as echarts from 'echarts';


export default {
  data() {
    return {
      isLogin: 0,
      userdata: {
        city: "未知",
        class: "未知",
        class_id: 10000000,
        created_at: "未知",
        id: "",
        password: "",
        province: "未知",
        school: "未知",
        username: "用户"
      },
      teach_data: {},
      charts: {},
      ai_analyze: {},
      isLoading: false,
      ai_analyze_state: "AI智能分析"
    };
  },
  mounted() {
    this.loadFromCookie();
    this.request_userdata_teach();
  },
  methods: {
    // 请求用户数据
    async request_userdata() {
      try {
        const result = await axios.post(
          `https://sapi.ycxhl.top/api/userdata/${this.userdata["id"]}/${this.userdata["password"]}`
        );
        this.userdata = result.data["data"];
      } catch (error) {
        console.error("请求用户数据失败:", error);
      }
    },

    // 请求教学数据
    async request_userdata_teach() {
      try {
        const result = await axios.post(
          `https://sapi.ycxhl.top/api/getdata/${this.userdata["id"]}/${this.userdata["password"]}/teach_data`
        );
        this.teach_data = JSON.parse(result.data["data"]);
        this.$nextTick(() => {
          Object.keys(this.teach_data).forEach(key => {
            this.initChart(key);
          });
        });
      } catch (error) {
        console.error("请求教学数据失败:", error);
      }
    },

    async request_analyze(key,item) {
      this.isLoading=true;
      this.ai_analyze_state="分析中...";
      try {
        
        console.log(item)
        const result = await axios({
          method: 'post',
          url: 'https://sapi.ycxhl.top/api/aiprocess',
          data: {
            data: JSON.stringify(item)
          },
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(result.data.message)
        this.ai_analyze[key] = result.data.message
        this.isLoading=false;
        this.ai_analyze_state="AI智能分析";
      } catch (error) {
        alert("请求教学分析数据失败");
      }
    },

    // 保存到Cookie
    saveToCookie() {
      Cookies.set('userdata', JSON.stringify(this.userdata), { 
        expires: 7,
      });
    },

    // 从Cookie加载
    loadFromCookie() {
      const data = Cookies.get('userdata');
      if (data) {
        this.userdata = JSON.parse(data);
      }
    },

    // 时间格式化
    formatTime(timeStr) {
      return [
        timeStr.substring(8, 10),  // 时
        timeStr.substring(10, 12), // 分
        timeStr.substring(12, 14)  // 秒
      ].join(':');
    },

    // 完整时间格式化
    formatFullTime(timeStr) {
      const date = new Date(
        timeStr.substring(0, 4),   // 年
        timeStr.substring(4, 6) - 1, // 月
        timeStr.substring(6, 8),   // 日
        timeStr.substring(8, 10),  // 时
        timeStr.substring(10, 12), // 分
        timeStr.substring(12, 14)  // 秒
      );
      return date.toLocaleString();
    },

    // 初始化图表
    initChart(key) {
      try {
        const chartDom = this.$refs[`chart-${key}`][0];
        if (!chartDom) return;

        // 销毁旧实例
        if (this.charts[key]) {
          this.charts[key].dispose();
          delete this.charts[key];
        }

        const chart = echarts.init(chartDom);
        const data = this.teach_data[key].data;
        const userId = this.userdata.id; // 获取当前用户ID

        const option = {
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1,
            textStyle: {
              color: '#333',
              fontSize: 14
            },
            formatter: (params) => {
              const dataIndex = params[0].dataIndex;
              const timeData = data[dataIndex].time;
              
              const imageUrl = `https://img.ycxhl.top/studentData/${userId}/${timeData}.png`;

              return `
                <div style="max-width: 400px; min-width: 280px;">
                  <div style="margin-bottom: 8px; color: #666; font-size: 12px;">
                    ${this.formatFullTime(timeData)}
                  </div>
                  
                  ${params.map(p => `
                    <div style="margin: 3px 0;">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:5px"></span>
                      ${p.seriesName}: ${p.value}人
                    </div>
                  `).join('')}

                  <div style="margin-top: 10px; border-top: 1px solid #eee; padding-top: 8px;">
                    <img 
                      src="${imageUrl}" 
                      style="
                        width: 100%;
                        height: auto;
                        border-radius: 4px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        "
                      onload="this.style.background='none'"
                      onerror="this.onerror=null;this.src='https://dummyimage.com/300x200/eee/999&text=无';"
                    >
                  </div>
                </div>
              `;
            }
          },
          xAxis: {
            type: 'category',
            data: data.map(d => this.formatTime(d.time)),
            axisLabel: {
              rotate: 45,
              fontSize: 12,
              color: '#666'
            },
            axisLine: {
              lineStyle: {
                color: '#ddd'
              }
            }
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 50,
            axisLabel: {
              fontSize: 12,
              color: '#666'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#eee'
              }
            }
          },
          series: [
            {
              name: '抬头人数',
              type: 'line',
              data: data.map(d => d.head_up),
              smooth: true,
              lineStyle: {
                color: '#36a3eb',
                width: 2
              },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#36a3eb',
                borderColor: '#fff',
                borderWidth: 2
              }
            },
            {
              name: '低头人数',
              type: 'line',
              data: data.map(d => d.head_down),
              smooth: true,
              lineStyle: {
                color: '#f4516c',
                width: 2
              },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#f4516c',
                borderColor: '#fff',
                borderWidth: 2
              }
            }
          ],
          grid: {
            top: '15%',
            bottom: '25%',
            left: '8%',
            right: '4%',
            containLabel: true
          }
        };

        chart.setOption(option);
        this.charts[key] = chart;

        // 添加窗口resize监听
        window.addEventListener('resize', () => chart.resize());

      } catch (error) {
        console.error(`初始化图表 ${key} 失败:`, error);
      }
    },

    // 处理窗口resize
    handleResize() {
      Object.values(this.charts).forEach(chart => chart.resize());
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    Object.values(this.charts).forEach(chart => chart.dispose());
  }
};
</script>

<style scoped>
@import url(/src/assets/main.css);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  padding: 20px;
}

.cards-container {
  display: flex;
  gap: 20px;
}



.data-item {
  margin-top: 15px;
}

canvas {
  display: block;
}

.ai-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-image: linear-gradient(135deg, #6a11cb, #2557d5);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.ai-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.ai-btn:disabled {
  background-image: linear-gradient(135deg, #e0e0e0, #cccccc);
  color: #666666;
  cursor: not-allowed;
  opacity: 0.7;
}

.ai-btn.loading::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-left: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>