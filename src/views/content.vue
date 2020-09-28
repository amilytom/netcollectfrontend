<template>
  <div class="content-box">
    <!-- 显示内容 -->
    <div class="hande-table">
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="grid-content bg-gray-light" @click="addLink">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
        <el-col :span="6" v-for="(item, index) in contentData" :key="index">
          <div
            class="grid-content bg-gray-light"
            :class="randColor"
            @click="handleTo(item.url)"
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
        :current-page="pageNum"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="tableDataTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import bus from "../utils/bus";
export default {
  name: "contentPage",
  props: {},
  data() {
    return {
      randColor: "",
      pageNum: 1,
      pageSize: 11,
      tableDataTotal: 0,
      contentData: [],
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
    };
  },
  mounted() {
    this.getRandColor();
    bus.$on("getLinkData", (data) => {
      this.contentData = data;
      this.tableDataTotal = this.contentData.length;
    });
  },
  methods: {
    getRandColor() {
      let index = Math.floor(Math.random() * this.color.length);
      this.randColor = this.color[index];
    },
    // size-change方法: pageSize改变时会触发
    handleSizeChange(val) {
      this.pageNum = 1; // 重置页数
      this.pageSize = val;
      this.getBaseUserListJson();
    },
    // current-change方法: currentPage 改变时会触发
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getBaseUserListJson();
    },
    handleTo(url) {
      //window.location.href = url;
      window.open(url, "_blank");
    },
    addLink() {
      this.$message.warning("请先登录");
    },
  },
};
</script>

<style scoped></style>
