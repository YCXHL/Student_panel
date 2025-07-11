<template>
    <div class="dashboard-container">
  
      <main class="content-area">
        <div class="cards-container">
          <div class="card left-card">
            <h2>注册</h2>
            <p :style="{ color: '#27ae60', fontWeight: 'bold', fontSize: '1.2rem' }">请输入你的信息</p>
  
            <div class="input-container">
                <input 
                    v-model="temp.id"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">用户ID</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.username"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">用户名</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.password"
                    type="password"
                    placeholder=" "
                >
                <label class="input-label">用户密码</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.province"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">省份</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.city"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">城市</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.school"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">学校</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.class"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">班级</label>
            </div>
            <div class="input-container">
                <input 
                    v-model="temp.class_id"
                    type="text"
                    placeholder=" "
                >
                <label class="input-label">班级</label>
            </div>
  
            <a class="Button" @click="register_userdata()">注册</a>
            <router-link class="Button" to="/login">登录</router-link>
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
        temp: {
            "city": "",
            "class": "",
            "class_id": "",
            "created_at": "",
            "id": "",
            "password": "",
            "province": "",
            "school": "",
            "username": ""
        }
      }
    },
    mounted() {
      this.loadFromCookie();
    },
    methods: {
      async register_userdata() {
          axios.post("https://sapi.ycxhl.top/api/create/"+this.temp["id"]+"/"+this.temp["username"]+"/"+this.temp["password"]+"/"+this.temp["province"]+"/"+this.temp["city"]+"/"+this.temp["school"]+"/"+this.temp["class"]+"/"+this.temp["class_id"])
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