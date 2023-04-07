<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="name"> </el-table-column>
        <el-table-column label="店铺地址" prop="address"> </el-table-column>
        <el-table-column label="店铺介绍" prop="description"> </el-table-column>
        <el-table-column label="操作" width="235">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="Success"
              @click="addFood(scope.$index, scope.row)"
              >添加食品</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="count"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import { cityGuess, getResturantsCount, getResturants } from "@/api/getData";

export default {
  data() {
    return {
      tableData: [],
      city: {},
      currentPage: 1,
      offset: 0,
      count: 0,
      limit: 20,
    };
  },
  components: {
    headTop,
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化页面数据
    async initData() {
      try {
        this.city = await cityGuess();
        const { status, count } = await getResturantsCount();
        if (status === 1) {
          this.count = count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getResturants();
      } catch (error) {
        console.log(error.message);
      }
    },

    // 获取商家数据列表
    async getResturants() {
      const { latitude, longitude } = this.city;
      const restaurants = await getResturants({
        latitude,
        longitude,
        offset: this.offset,
        limit: this.limit,
      });
      // console.log(restaurants);
      this.tableData = [];
      restaurants.forEach((item) => {
        const tableData = {};
        tableData.name = item.name;
        tableData.address = item.address;
        tableData.description = item.description;
        tableData.id = item.id;
        tableData.phone = item.phone;
        tableData.rating = item.rating;
        tableData.recent_order_num = item.recent_order_num;
        tableData.category = item.category;
        tableData.image_path = item.image_path;
        this.tableData.push(tableData);
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getResturants();
    },
  },
  computed: {},
};
</script>
<style lang="less">
@import "../style/mixin";

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.table_container {
  padding: 20px;
}

.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
