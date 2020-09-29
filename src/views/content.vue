<template>
  <div class="content-box">
    <!-- 显示内容 -->
    <div class="hande-table">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLinkData">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6" v-for="(item, index) in linkData" :key="index">
          <div
            class="grid-content bg-blue"
            :class="`randColor${index}`"
            @click="handleToLink(item.url)"
          >
            <p>{{ item.title }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination-item">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-size="rows"
        layout="prev, pager, next"
        :total="tableDataTotal"
      ></el-pagination>
    </div>

    <!-- 新增或编辑链接 -->
    <link-dialog ref="linkDialog" @submit-success="submitSuccess"></link-dialog>
  </div>
</template>

<script>
import bus from "../utils/bus";
import linkApi from "../api/linkApi";
import linkDialog from "../components/linkDialog";
import Cookies from "js-cookie";

export default {
  name: "contentPage",
  props: {
    searchName: String,
  },
  components: {
    linkDialog,
  },
  data() {
    return {
      randColor: "",
      curPage: 1,
      rows: 11,
      tableDataTotal: 0,
      linkData: [],
      cid: 0,
      color: [
        "bg-purple-dark",
        "bg-purple",
        "bg-purple-light",
        "bg-blue",
        "bg-green",
        "bg-red-dark",
        "bg-green-dark",
        "bg-purple-gray",
        "bg-orange",
        "bg-black",
        "bg-yellow",
        "bg-red-add",
        "bg-blue-add",
        "bg-green-disc",
        "bg-blue-sky",
        "bg-pink",
      ],
      uid: JSON.parse(Cookies.get("userInfo")).uid,
    };
  },
  computed: {},
  mounted() {
    this.getLinkList();
    this.$nextTick(() => {
      bus.$on("sendCate", (cid) => {
        this.getLinkList(cid);
      });
    });
  },
  methods: {
    getRandColor() {
      let index = Math.floor(Math.random() * this.color.length);
      this.randColor = this.color[index];
    },
    getLinkList(data = "") {
      this.cid = data;
      let params = {
        page: this.curPage,
        rows: this.rows,
        cat: data,
        uid: this.uid,
        title: this.searchName,
      };
      linkApi
        .linkList(params)
        .then((res) => {
          console.log(res);
          this.linkData = res.data.list;
          this.tableDataTotal = parseInt(res.data.count);
          console.log(this.tableDataTotal);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // size-change方法: pageSize改变时会触发
    handleSizeChange(val) {
      this.curPage = 1; // 重置页数
      this.rows = val;
      this.getLinkList();
    },
    // current-change方法: currentPage 改变时会触发
    handleCurrentChange(val) {
      this.curPage = val;
      this.getLinkList();
    },

    handleToLink(url) {
      //window.location.href = url;
      window.open(url, "_blank");
    },

    addLinkData() {
      console.log(this.cid);
      let rowData = {
        cid: this.cid,
      };
      this.$refs.linkDialog.open(false, rowData);
    },
    submitSuccess(data) {
      this.getLinkList(data);
    },
  },
};
</script>

<style scoped></style>
