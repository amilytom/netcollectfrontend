<template>
  <div class="tree-box">
    <div class="form-box">
      <el-input
        class="key"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        @clear="queryClearfresh"
        clearable
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
        highlight-current="true"
        node-key="cid"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="treetitle" @click="() => linkTo(data)">{{
            node.label
          }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => editCate(data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button
              type="text"
              size="mini"
              :loading="btnLoading"
              @click="() => removeCate(node, data)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 新增或编辑分类框 -->
    <cate-dialog ref="cateDialog" @submit-success="submitSuccess"></cate-dialog>
  </div>
</template>

<script>
import cateApi from "../api/cateApi";
import Cookies from "js-cookie";
import cateDialog from "../components/cateDialog";
import bus from "../utils/bus";

export default {
  name: "cateTreePage",
  props: {},
  components: {
    cateDialog,
  },
  data() {
    return {
      filterText: "",
      cateTreeData: [],
      btnLoading: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      uid: JSON.parse(Cookies.get("userInfo")).uid,
      checkNode: [],
    };
  },
  mounted() {
    this.getCateData();
    this.$nextTick(() => {
      bus.$on("updataCate", () => {
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
          //console.log(res);
          this.cateTreeData = this.toTree(res.data.list);
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    queryClearfresh() {
      this.$refs.cateTree.setCheckedKeys([]);
      this.getCateData();
    },

    addCate() {
      //this.$parent.$parent.$refs.cateDialog.open(false);
      this.$refs.cateDialog.open(false);
    },

    appendCate(data) {
      //this.$parent.$parent.$refs.cateDialog.open(false, data);
      this.$refs.cateDialog.open(false, data);
    },

    editCate(data) {
      //this.$parent.$parent.$refs.cateDialog.open(true, data);
      this.$refs.cateDialog.open(true, data);
    },

    removeCate(node, data) {
      console.log(data);
      if (node) {
        this.$confirm(
          "此操作将永久删除该分类及下级所有分类, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.btnLoading = true;
            let params = {
              cid: data.cid,
            };
            cateApi
              .deletecate(params)
              .then((res) => {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex((d) => d.id === data.id);
                children.splice(index, 1);
                this.$message.success("删除成功！");
                this.getCateData();
                this.btnLoading = false;
              })
              .catch((err) => {
                console.log(err);
                this.btnLoading = false;
              });
          })
          .catch(() => {
            this.$message.info("已取消删除");
            this.btnLoading = false;
          });
      }
    },

    linkTo(data) {
      console.log(data);
      bus.$emit("sendCate", data.cid);
    },

    // 查找节点
    filterNode(value, data) {
      if (!value) {
        this.$refs.cateTree.setCheckedKeys([]);
        return true;
      }
      //console.log(data);
      if (data.name.indexOf(value) !== -1) {
        this.checkNode.push(data);
        this.$refs.cateTree.setCheckedNodes(this.checkNode);
        return true;
      }
    },

    // 新增编辑提交成功刷新列表
    submitSuccess(type) {
      this.getCateData();
    },
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
