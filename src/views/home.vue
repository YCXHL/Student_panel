<template>
    <div class="dashboard-container">
  
      <main class="content-area">
        <div class="cards-container">
          <div class="card left-card">
            <h2>系统状态</h2>
            <p :style="{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.2rem' }">当前用户状态正常</p>
            <div class="description">
              <p>你好，{{userdata["username"]}} ！</p>
              <p>欢迎使用智能教学分析系统</p>
              <p>须知：由于我个人经费有限，该前端网页托管于海外服务器，访问速度会略有小慢（客观因素），与项目本身无关，请见谅</p>
            </div>
          </div>
  
          <div class="card right-card">
            <h2>用户信息</h2>
            <div class="data-item">
              <a style="font-size: large; color: #3498db;">你好，{{userdata["username"]}} ！</a>
              <br />
              <a style="font-size: large; color: #7f8c8d;">地区: {{userdata["province"]}}省{{userdata["city"]}}市 </a>
              <br />
              <a style="font-size: large; color: #7f8c8d;">学校: {{userdata["school"]}} </a>
              <br />
              <a style="font-size: large; color: #7f8c8d;">班级: {{userdata["class"]}} </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import Cookies from 'js-cookie'
  
  export default {
    data() {
      return {
        isLogin: 0,
        userdata: {
          "city": "未知",
          "class": "未知",
          "class_id": 10000000,
          "created_at": "未知",
          "id": "",
          "password": "",
          "province": "未知",
          "school": "未知",
          "username": "用户"
      },
      }
    },
    mounted() {
      this.loadFromCookie();
    },
    methods: {
      async request_userdata() {
          axios.post("https://sapi.ycxhl.top/api/userdata/"+this.userdata["id"]+"/"+this.userdata["password"])
            .then((result) => {
              console.log(result.data)
              this.userdata=result.data["data"]
          })
      },
      saveToCookie() {
        Cookies.set('userdata', JSON.stringify(this.userdata), { 
          expires: 7,
        });
      },
      loadFromCookie() {
          const data = Cookies.get('userdata');
          if (data) {
            this.userdata = JSON.parse(data);
          }
      }
    }
  }
  </script>
  
  <style scoped>
  @import url(/src/assets/main.css);
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  </style>