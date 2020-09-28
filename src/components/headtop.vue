<template>
  <div>
    <div class="handle-head">
      <div class="headleft">
        <i class="el-icon-s-home"></i>
        <i class="el-icon-menu" @click="openDrawer"></i>
      </div>
      <div class="headright">
        <i class="el-icon-s-custom"></i>
        <el-dropdown @command="userOperation">
          <span class="el-dropdown-link">
            {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 修改密码 -->
    <pass-dialog ref="passDialog"></pass-dialog>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import passDialog from "../components/passDialog";

export default {
  name: "headtop",
  components: {
    passDialog,
  },
  data() {
    return {
      username: Cookie.get("username"),
    };
  },
  methods: {
    userOperation(command) {
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "editPwd":
          this.editPass();
          break;
      }
    },
    logout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$message.success("退出登录");
          this.$router.push({ path: "/login" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editPass() {
      this.$refs.passDialog.open();
    },
    openDrawer() {
      this.$parent.drawer = true;
    },
  },
};
</script>

<style scoped></style>
