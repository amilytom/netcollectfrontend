<template>
  <div class="tree-box">
    <div class="form-box">
      <el-input
        class="key"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
      >
      </el-input>
      <el-button
        class="add"
        plain
        icon="el-icon-plus"
        size="small"
        @click="addCate"
      ></el-button>
    </div>
    <div class="tree-list">
      <el-tree
        :props="defaultProps"
        ref="cateTree"
        :data="cateTreeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => appendCate(data)">
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button type="text" size="mini" @click="() => editCate(data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => removeCate(node, data)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import cateApi from "../api/cateApi";
import linkApi from "../api/linkApi";
import bus from "../utils/bus";
import Cookies from "js-cookie";

export default {
  name: "cateTreePage",
  props: {},
  components: {},
  data() {
    return {
      filterText: "",
      cateTreeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      uid: JSON.parse(Cookies.get("userInfo")).uid,
    };
  },
  mounted() {
    this.getCateData();
    this.$nextTick(() => {
      bus.$on("submit-success", () => {
        this.getCateData();
      });
    });
  },
  methods: {
    // 获取列表数据
    getCateData() {
      this.tableLoading = true;
      let params = {
        dropList: true,
        uid: this.uid,
      };
      cateApi
        .cateList(params)
        .then((res) => {
          console.log(res);
          this.cateTreeData = this.toTree(res.data.list);
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    addCate() {
      this.$parent.$parent.$refs.cateDialog.open(false);
    },
    appendCate(data) {
      this.$parent.$parent.$refs.cateDialog.open(false, data);
    },
    editCate(data) {
      this.$parent.$parent.$refs.cateDialog.open(true, data);
    },
    removeCate(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 新增编辑提交成功刷新列表
    submitSuccess(type) {},
    toTree(data) {
      let result = [];
      if (!Array.isArray(data)) {
        return result;
      }
      data.forEach((item) => {
        delete item.children;
      });
      let map = {};
      data.forEach((item) => {
        map[item.cid] = item;
      });
      data.forEach((item) => {
        let parent = map[item.pid];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.cateTree.filter(val);
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
