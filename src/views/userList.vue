<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        border
        stripe
      >
        <el-table-column type="index" width="100"> </el-table-column>
        <el-table-column property="registe_time" label="注册日期" width="220">
        </el-table-column>
        <el-table-column property="username" label="用户姓名" width="220">
        </el-table-column>
        <el-table-column property="city" label="注册地址"> </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left; margin-top: 10px">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          :total="count"
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { getUserCount, getUserList } from "@/api/getData";
export default {
  data() {
    return {
      tableData: [],
      offset: 0,
      limit: 20,
      currentPage: 1,
      count: 0,
    };
  },
  created() {
    this.initData();
  },
  components: {
    headTop,
  },
  methods: {
    /**
     * 初始化数据的函数
     */
    async initData() {
      try {
        const { status, count } = await getUserCount();
        // console.log(countData);
        if (status === 1) {
          this.count = count;
          this.getUsers();
        } else {
          throw new Error("获取数据失败！！！");
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    /**
     * 获取用户列表的函数
     */
    async getUsers() {
      const users = await getUserList({
        offset: this.offset,
        limit: this.limit,
      });
      // console.log(users);
      this.tableData = [];
      users.forEach((item) => {
        const user = {};
        user.username = item.username;
        user.registe_time = item.registe_time;
        user.city = item.city;
        this.tableData.push(user);
      });
    },
    /**
     * 当前页改变时的操作函数
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getUsers();
    },
  },
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
</style>
