<template>
  <div class="dialog-box">
    <el-dialog
      title="用户登录"
      :close-on-click-modal="false"
      :visible.sync="loginDialogVisible"
      class="box-modal"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            placeholder="用户名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            placeholder="密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item class="loginbut">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="loginLoading"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "用户账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "用户密码不能为空",
            trigger: "blur",
          },
        ],
      },
      loginLoading: false,
      loginDialogVisible: false,
    };
  },
  created() {
    // TAB选定提交按钮，响应键盘Enter事件
    var _this = this;
    document.onkeydown = function (e) {
      let key = window.event.keyCode;
      if (key == 13) {
        _this.submitForm("ruleForm");
      }
    };
  },
  methods: {
    open() {
      this.loginDialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginLoading = true;
          let params = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
          };

          this.$store
            .dispatch("login", params)
            .then((res) => {
              //console.log(res);
              this.loginLoading = false;
              if (res.data.username) {
                this.$message.success("登录成功");
                // 登录成功后通知父组件更新
                this.$emit("submit-success");
                //console.log("登录成功通知父组件");
                this.$router.push({ path: "/" });
              } else {
                this.$message.warning(res.data);
              }
            })
            .catch((err) => {
              //console.log(err);
              this.$message.warning("用户名或者密码错误，请重新输入");
              this.loginLoading = true;
              this.$router.go(0);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
