<template>
  <el-dialog title="新增部门" :visible="showDialog">
      <!-- 匿名插槽 -->
      <el-form label-width="120px">
          <el-form-item label="部门名称">
              <el-input style="width:80%" placeholder="1-50个字符"/>
          </el-form-item>
          <el-form-item label="部门编码">
              <el-input style="width:80%" placeholder="1-50个字符"/>
          </el-form-item>
          <el-form-item label="部门负责人">
              <el-select style="width:80%" placeholder="请选择"/>
          </el-form-item>
          <el-form-item label="部门介绍">
              <el-input style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
          </el-form-item>
      </el-form>
      <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
      <el-row slot="footer" type="flex" justify="center">
          <el-col :span='18' class="dialog-footer">
              <el-button type="primary" size="small">确定</el-button>
              <el-button size="small">取消</el-button>
          </el-col>
      </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props:{
      showDialog:{
          type: Boolean,
          default: false
      }
  }
}
</script>

