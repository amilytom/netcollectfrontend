<template>
  <div class="container">
    <div class="handle-head">
      <div class="headleft">
        <i class="el-icon-s-home"></i>
        <i class="el-icon-menu"></i>
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

    <!--  搜索框 -->
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
      <el-button type="success" icon="search" @click="handleAdd"
        >添加
      </el-button>
    </div>

    <!--  分类标题 -->
    <div class="handle-tabs">
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        editable
        @edit="handleTabsEdit"
      >
        <el-tab-pane
          :key="item.name"
          v-for="(item, index) in editableTabs"
          :label="item.title"
          :name="item.name"
        >
          {{ item.content }}
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 显示内容 -->
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

    <!-- 修改密码 -->
    <pass-dialog ref="passDialog"></pass-dialog>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import passDialog from "../components/passDialog";

export default {
  name: "login",
  components: {
    passDialog,
  },
  data() {
    return {
      title: this.$route.meta.title,
      username: Cookie.get("username"),
      searchName: "",
      tableData: [],
      curPage: 1,
      rows: 12,
      editableTabsValue: "2",
      editableTabs: [
        {
          title: "Tab 1",
          name: "1",
          content: "Tab 1 content",
        },
        {
          title: "Tab 2",
          name: "2",
          content: "Tab 2 content",
        },
      ],
      tabIndex: 2,
    };
  },
  computed: {},
  mounted() {},
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
    getData(search) {},
    queryClear() {
      this.curPage = 1; // 重置页数
      this.getData();
    },
    searchKey() {
      this.curPage = 1;
      this.getData(true);
    },
    addLink() {
      this.$message.warning("请先登录");
    },
    handleAdd() {},
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "New Tab",
          name: newTabName,
          content: "New Tab content",
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      }
    },
  },
};
</script>

<style scoped></style>
