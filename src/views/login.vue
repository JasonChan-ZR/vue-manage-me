<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <div class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>后台管理系统</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="password"
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
              @keyup.enter.native="submitForm"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click.native.prevent="submitForm"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
import { login } from "@/api/getData";
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [{ required: true, messaage: "请输入密码", trigger: "blur" }],
      },
      showLogin: false,
    };
  },
  mounted() {
    this.showLogin = true;
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  computed: {
    ...mapState(["adminInfo"]),
  },
  methods: {
    ...mapActions(["getAdminData"]),
    submitForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const res = await login({
            user_name: this.loginForm.username,
            password: this.loginForm.password,
          });
          console.log(res);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 210px);
  // .ctp(320px, 210px);
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -105px;
  margin-left: -160px;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
