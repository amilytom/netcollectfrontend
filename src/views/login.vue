<template>
  <div class="container">
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        placeholder="请输入搜索内容"
        class="handle-input"
        @clear="queryClear"
        @blur="queryClear"
        clearable
      ></el-input>
      <el-button type="primary" icon="search" @click="searchKey"
        >搜索</el-button
      >
    </div>
    <div class="hande-table">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div
            class="grid-content bg-green-dark"
            @click="addLogin(islogin)"
            v-html="loginHtm"
          ></div>
        </el-col>
        <el-col :span="6">
          <div
            class="grid-content bg-blue"
            @click="addRegist(isreg)"
            v-html="regHtm"
          ></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--  登录Dialog  -->
    <login-dialog
      ref="loginDialog"
      @submit-success="loginSuccess"
    ></login-dialog>

    <!--  注册Dialog  -->
    <regist-dialog
      ref="registDialog"
      @submit-success="registSuccess"
    ></regist-dialog>
  </div>
</template>

<script>
import loginDialog from "../components/loginDialog";
import registDialog from "../components/registDialog";

export default {
  name: "login",
  components: {
    loginDialog,
    registDialog,
  },
  data() {
    return {
      title: this.$route.meta.title,
      searchName: "",
      loginHtm: '<i class="el-icon-user"> 登录</i>',
      regHtm: '<i class="el-icon-circle-plus"> 注册</i>',
      islogin: false,
      isreg: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    queryClear() {
      this.searchName = "";
    },
    searchKey() {
      this.$message.warning("请先登录");
    },
    addLink() {
      this.$message.warning("请先登录");
    },
    addLogin(flag) {
      if (!flag) {
        this.$refs.loginDialog.open();
      } else {
        this.$router.push({ path: "/" });
      }
    },
    addRegist(flag2) {
      if (!flag2) {
        this.$refs.registDialog.open();
      } else {
        this.$refs.loginDialog.open();
      }
    },
    // 新增编辑提交成功刷新列表
    loginSuccess() {
      this.loginHtm = "<p>登录成功</p>";
      this.islogin = true;
      console.log("收到登录成功消息");
    },
    registSuccess() {
      this.regHtm = "<p>注册成功</p>";
      this.isreg = true;
      console.log("收到注册成功消息");
    },
  },
};
</script>

<style scoped>
.handle-box {
  margin: 90px auto 80px;
}
.handle-box .handle-input {
  width: 560px;
  display: block;
  float: left;
}
.handle-box .el-button {
  margin-left: 6px;
  width: 154px;
  float: left;
  height: 44px;
}
</style>
