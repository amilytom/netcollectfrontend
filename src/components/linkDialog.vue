<template>
  <div class="dialog-box">
    <el-dialog
      :title="isEdit ? '编辑链接' : '新增链接'"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      class="box-modal"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="80px"
      >
        <el-form-item label="链接名称" prop="title">
          <el-input
            size="small"
            v-model.trim="addForm.title"
            placeholder="请输入链接名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="链接网址" prop="url">
          <el-input
            size="small"
            v-model.trim="addForm.url"
            placeholder="请输入链接网址"
          ></el-input>
        </el-form-item>
        <el-form-item label="关键词" prop="key">
          <el-input
            size="small"
            v-model.trim="addForm.key"
            placeholder="请输入关键词"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select
            size="small"
            v-model="addForm.cat"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in cateList"
              :key="index"
              :label="item.name"
              :value="item.cid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否置顶" prop="istop">
          <el-select
            size="small"
            v-model="addForm.istop"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in topList"
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
import linkApi from "../api/linkApi";

export default {
  name: "addLinkDialog",
  props: {},
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      addForm: {
        title: "",
        url: "",
        key: "",
        cat: "",
        istop: "",
      },
      addFormRules: {
        title: [
          {
            required: true,
            message: "链接标题不能为空",
            trigger: "blur",
          },
        ],
        url: [
          {
            required: true,
            message: "链接地址不能为空",
            trigger: "blur",
          },
        ],
      },
      uid: JSON.parse(Cookies.get("userInfo")).uid,
      cateList: [],
      topList: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 1,
          label: "置顶",
        },
      ],
      btnLoading: false,
      id: 0,
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
      this.cid = rowData.cid;
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
        title: rowData.title,
        url: rowData.url,
        key: rowData.key,
        cat: rowData.cat,
        istop: rowData.istop,
      };
      this.id = rowData.id;
      // 保存编辑时修改前用户对象的值
      this.editUserval = Object.assign({}, this.addForm);
      //console.log(rowData)
    },
    // 获取顶级分类（下拉）
    getTopCateByPid() {
      let params = {
        dropList: true,
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
        })
        .catch((err) => {
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
      let params = this.addForm;
      linkApi
        .insertlink(params)
        .then((res) => {
          this.btnLoading = false;
          this.$message.success(`添加成功`);
          this.$emit("submit-success", this.cid);
          this.dialogVisible = false;
        })
        .catch((err) => {
          console.log(err);
          this.btnLoading = false;
        });
    },
    // 编辑用户
    handleEdit() {
      this.btnLoading = true;
      this.$set(this.addForm, "id", this.id);
      let params = this.addForm;

      linkApi
        .editlink(params)
        .then((res) => {
          this.btnLoading = false;
          this.$message.success(`修改成功`);
          this.$emit("submit-success", this.cid);
          this.dialogVisible = false;
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
