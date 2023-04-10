<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <!-- 店铺列表 -->
      <el-table :data="tableData" style="width: 100%">
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
        <el-table-column label="操作" width="240">
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
      <!-- 分页栏 -->
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
      <!-- 店铺编辑页面 -->
      <el-dialog title="修改店铺信息" :visible.sync="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="店铺名称" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px">
            <el-autocomplete
              v-model="selectTable.address"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%"
              @select="addressSelect"
              clearable
            ></el-autocomplete>
            <span>当前城市：{{ city.name }}</span>
          </el-form-item>
          <el-form-item label="店铺介绍" label-width="100px">
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="selectTable.phone"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类" label-width="100px">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="商铺图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/v1/addimg/shop'"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="selectTable.image_path"
                :src="baseImgPath + selectTable.image_path"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateShop">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import headTop from "../components/headTop";
import {
  cityGuess,
  getResturantsCount,
  getResturants,
  searchplace,
  foodCategory,
} from "@/api/getData";

export default {
  data() {
    return {
      baseUrl: "//elm.cangdu.org",
      baseImgPath: "//elm.cangdu.org/img/",
      tableData: [],
      city: {},
      currentPage: 1,
      offset: 0,
      count: 0,
      limit: 20,
      dialogFormVisible: false,
      selectTable: {},
      location: {},
      selectedCategory: [],
      categoryOptions: [],
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

    // 当前页改变时触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getResturants();
    },

    // 编辑商家时触发
    handleEdit(index, row) {
      // console.log(row);
      this.selectTable = row;
      this.dialogFormVisible = true;
      this.selectedCategory = row.category.split("/");
      if (!this.categoryOptions.length) {
        this.getCategory();
      }
    },

    addressSelect(value) {
      const { address, latitude, longitude } = value;
      this.location = { address, latitude, longitude };
      // console.log(this.location);
    },

    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchplace({
            city_id: this.city.id,
            keyword: queryString,
          });
          // console.log(cityList)
          if (cityList instanceof Array) {
            cityList.map((item) => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    },

    // 获取商铺种类
    async getCategory() {
      try {
        const categories = await foodCategory();
        // console.log(categories);
        categories.forEach((item) => {
          if (item.sub_categories.length) {
            const addnew = {
              value: item.name,
              label: item.name,
              children: [],
            };
            item.sub_categories.forEach((subitem, index) => {
              if (index == 0) {
                return;
              }
              addnew.children.push({
                value: subitem.name,
                label: subitem.name,
              });
            });
            this.categoryOptions.push(addnew);
          }
        });
      } catch (error) {
        console.log("获取商铺种类失败");
      }
    },

    // 上传图片之前的钩子函数
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
    },

    // 图片上传成功的钩子函数
    handleServiceAvatarScucess() {
      if (res.status == 1) {
        this.selectTable.image_path = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },

    // 编辑完商家后触发
    async updateShop() {
      this.dialogFormVisible = false;
      try {
        Object.assign(this.selectTable, this.address);
        this.selectTable.category = this.selectedCategory.join("/");
        const res = await updateResturant(this.selectTable);
        if (res.status == 1) {
          this.$message({
            type: "success",
            message: "更新店铺信息成功",
          });
          this.getResturants();
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      } catch (error) {
        console.log("更新餐馆信息失败");
      }
    },
  },
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
