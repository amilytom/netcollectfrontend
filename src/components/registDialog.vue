<template>
  <div class="dialog-box">
    <el-dialog
      title="用户注册"
      :close-on-click-modal="false"
      :visible.sync="regDialogVisible"
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
        <el-form-item prop="name">
          <el-input
            type="text"
            v-model="ruleForm.name"
            placeholder="姓名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select
            v-model="ruleForm.role"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option label="普通用户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="loginbut">
          <el-button
            type="primary"
            class="submitBtn"
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
import loginApi from "../api/loginApi";

export default {
  name: "regist",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        name: "",
        role: "",
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
        name: [
          {
            required: true,
            message: "用户姓名不能为空",
            trigger: "blur",
          },
        ],
        role: [
          {
            required: true,
            message: "用户角色不能为空",
            trigger: "blur",
          },
        ],
      },
      loginLoading: false,
      regDialogVisible: false,
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
      this.regDialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginLoading = true;
          let params = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            name: this.ruleForm.name,
            role: this.ruleForm.role,
          };
          loginApi
            .regist(params)
            .then((res) => {
              this.btnLoading = false;
              this.$message.success(`添加成功`);
              // 注册成功后通知父组件更新
              this.$emit("submit-success");
              //console.log("登录成功通知父组件");
              this.regDialogVisible = false;
            })
            .catch((err) => {
              console.log(err);
              this.btnLoading = false;
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
