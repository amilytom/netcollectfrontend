<template>
  <div class="dialog-box">
    <el-dialog
      :title="isEdit ? '编辑分类' : '新增分类'"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      class="box-modal"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            size="small"
            v-model.trim="addForm.name"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级分类" prop="pid">
          <el-select size="small" v-model="addForm.pid" placeholder="请选择">
            <el-option
              v-for="(item, index) in cateList"
              :key="index"
              :label="item.name"
              :value="item.cid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐" prop="isgood">
          <el-select size="small" v-model="addForm.isgood" placeholder="请选择">
            <el-option
              v-for="(item, index) in goodList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendSubmit" :loading="btnLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import cateApi from "../api/cateApi";
import bus from "../utils/bus";

export default {
  name: "addCateDialog",
  props: {},
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        name: "",
        pid: "",
        isgood: "",
      },
      addFormRules: {
        name: [
          {
            required: true,
            message: "分类名称不能为空",
            trigger: "blur",
          },
        ],
      },
      uid: JSON.parse(Cookies.get("userInfo")).uid,
      cateList: [],
      goodList: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 1,
          label: "推荐",
        },
      ],
      btnLoading: false,
      cid: 0,
    };
  },
  mounted() {
    this.getTopCateByPid();
  },
  methods: {
    // 打开弹窗，第一个参数是否为编辑，第二参数传入的表单参数
    open(isEdit, rowData = {}) {
      this.isEdit = isEdit;
      this.dialogVisible = true;
      this.$nextTick(() => {
        // 每次打开弹窗执行重置表单方法，为避免首次报错，在弹窗dom加载后才执行
        this.$refs.addForm.resetFields();

        // 如果市编辑状态需要在重置表单后，将传入的数据进行表单赋值
        if (isEdit) {
          this.assignmentAddForm(rowData);
        }
      });
    },
    // 编辑状态给表单赋值
    assignmentAddForm(rowData) {
      this.addForm = {
        name: rowData.name,
        pid: rowData.pid,
        isgood: rowData.isgood,
      };
      this.cid = rowData.cid;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
      //console.log(rowData)
    },
    // 获取顶级分类（下拉）
    getTopCateByPid() {
      this.tableLoading = true;
      let params = {
        dropList: true,
        pid: 0,
        uid: this.uid,
      };
      cateApi
        .cateList(params)
        .then((res) => {
          res.data.list.forEach((item, index) => {
            this.cateList[index] = {
              cid: item.cid,
              name: item.name,
              pid: item.pid,
            };
          });
          this.cateList.unshift({
            cid: 0,
            name: "无上级",
            pid: 0,
          });
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
          console.log(err);
        });
    },
    // 提交新增或修改
    sendSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            this.handleAdd();
          } else {
            this.handleEdit();
          }
        } else {
          this.$message.warning("请正确填写表单内容");
          return false;
        }
      });
    },

    handleAdd() {
      this.btnLoading = true;
      this.addForm.uid = this.uid;
      let params = this.addForm;
      console.log(params);
      debugger;
      cateApi
        .insertcate(params)
        .then((res) => {
          this.btnLoading = false;
          this.$message.success(`添加成功`);
          this.$emit("submit-success");
          this.dialogVisible = false;
          //this.getData();
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },
    // 编辑用户
    handleEdit() {
      this.btnLoading = true;
      this.addForm.cid = this.cid;
      this.addForm.uid = this.uid;
      let params = this.addForm;

      cateApi
        .editcate(params)
        .then((res) => {
          this.btnLoading = false;
          this.$message.success(`修改成功`);
          this.$emit("submit-success");
          this.dialogVisible = false;
          this.getData();
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },
  },
};
</script>

<style scoped></style>
