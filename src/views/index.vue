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

    <!--  分类标题 -->
    <div class="handle-tabs">
      <el-tabs
        v-model="currentTabsValue"
        type="card"
        editable
        @tab-click="handleTab"
        @tab-add="handleAdd"
      >
        <el-tab-pane
          :key="index"
          v-for="(item, index) in editableTabs"
          :label="item.name"
          :name="JSON.stringify(item.cid)"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <content-view ref="contentView"></content-view>

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
import Cookies from "js-cookie";
import contentView from "./content";
import cateTree from "./catetree";
import cateDialog from "../components/cateDialog";
import headTop from "../components/headtop";
import cateApi from "../api/cateApi";
import linkApi from "../api/linkApi";
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
      tableData: [],
      curPage: 1,
      rows: 12,
      currentTabsValue: "",
      editableTabs: [],
      linkListData: [],
      drawer: false,
      direction: "ltr",
      uid: JSON.parse(Cookies.get("userInfo")).uid,
    };
  },
  computed: {},
  created() {
    this.getTypeData();
    this.$nextTick(() => {
      console.log(this.$refs.cateDrewer);
    });
  },
  methods: {
    getTypeData() {
      let params = {
        dropList: true,
        uid: this.uid,
        isgood: 1,
      };
      cateApi
        .cateList(params)
        .then((res) => {
          //console.log(res);
          this.editableTabs = res.data.list;
          this.currentTabsValue = JSON.stringify(this.editableTabs[0].cid);
          let params = {
            page: this.curPage,
            rows: this.rows,
            cat: this.editableTabs[0].cid,
          };
          linkApi
            .linkList(params)
            .then((res) => {
              this.linkListData = res.data.list;
              console.log(this.linkListData);
              bus.$emit("getLinkData", this.linkListData);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getLinkList() {
      let params = {
        page: this.curPage,
        rows: this.rows,
        title: this.searchName,
      };
      linkApi
        .linkList(params)
        .then((res) => {
          this.linkListData = res.data.list;
          console.log(this.linkListData);
          bus.$emit("getLinkData", this.linkListData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    queryClear() {
      this.curPage = 1; // 重置页数
      this.getLinkList();
    },
    searchKey() {
      this.curPage = 1;
      this.getLinkList();
    },
    handleTab(vm) {
      console.log(vm);
      let params = {
        page: this.curPage,
        rows: this.rows,
        cat: JSON.parse(vm.name),
      };
      linkApi
        .linkList(params)
        .then((res) => {
          this.linkListData = res.data.list;
          console.log(this.linkListData);
          bus.$emit("getLinkData", this.linkListData);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleAdd() {
      this.$refs.cateDialog.open(false);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    submitSuccess() {
      this.$children[5].$children[0].getCateData();
      //this.getCateData();
    },
  },
};
</script>

<style scoped></style>
