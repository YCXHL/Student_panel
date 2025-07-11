<template>
    <div class="dashboard-container">
  
      <main class="content-area">
        <div class="cards-container">
          <div class="card left-card">
            <h2>登录</h2>
            <p :style="{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.2rem' }">请输入你的账号和密码</p>
  
            <div class="input-container">
                <input 
                    v-model="userdata.id"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">用户ID</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="userdata.password"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">用户密码</label>
            </div>
  
            <a class="Button" @click="requestUserdata()">登录</a>
            <router-link class="Button" to="/register">注册</router-link>
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
      async requestUserdata() {
        axios.post("https://sapi.ycxhl.top/api/userdata/"+this.userdata["id"]+"/"+this.userdata["password"])
          .then((result) => {
            if(result.data.message==1){
              this.userdata = result.data.data;
              this.saveToCookie();
            }else{
              alert("登录失败，请检查账号密码");
            }

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