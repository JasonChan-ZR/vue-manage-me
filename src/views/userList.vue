<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="100"> </el-table-column>
        <el-table-column property="registe_time" label="注册日期" width="220">
        </el-table-column>
        <el-table-column property="username" label="用户姓名" width="220">
        </el-table-column>
        <el-table-column property="city" label="注册地址"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { getUserCount } from "@/api/getData";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.initData();
  },
  components: {
    headTop,
  },
  methods: {
    initData() {
      getUserCount();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.table_container {
  padding: 20px;
}
</style>
