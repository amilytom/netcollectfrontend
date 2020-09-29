<template>
  <div class="container">
    <head-top ref="headtop"></head-top>
    <!--  搜索框 -->
    <div class="handle-box">
      <el-input
        v-model.trim="searchName"
        placeholder="请输入搜索内容"
        class="handle-input"
        @clear="queryClear"
        clearable
      ></el-input>
      <el-button type="primary" icon="search" @click="searchKey"
        >搜索</el-button
      >
    </div>

    <content-view ref="contentView" :searchName="searchName"></content-view>

    <el-drawer
      ref="cateDrewer"
      title="分类管理"
      size="360px"
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
    >
      <cate-tree ref="cateTreeCom"></cate-tree>
    </el-drawer>

    <!-- 新增或编辑分类框 -->
    <cate-dialog ref="cateDialog" @submit-success="submitSuccess"></cate-dialog>
  </div>
</template>

<script>
import contentView from "./content";
import cateTree from "./catetree";
import cateDialog from "../components/cateDialog";
import headTop from "../components/headtop";
import bus from "../utils/bus";

export default {
  name: "indexPage",
  components: {
    contentView,
    cateTree,
    cateDialog,
    headTop,
  },
  data() {
    return {
      searchName: "",
      drawer: false,
      direction: "ltr",
    };
  },
  created() {},
  methods: {
    queryClear() {
      this.$refs.contentView.curPage = 1;
      this.$refs.contentView.getLinkList();
    },
    searchKey() {
      this.$refs.contentView.curPage = 1;
      this.$refs.contentView.getLinkList();
    },
    submitSuccess() {
      bus.$emit("updataCate");
    },
  },
};
</script>

<style scoped></style>
