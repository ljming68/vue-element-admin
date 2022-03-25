<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <!--插槽除了 slot="name" 还可以 v-slot  -->
      <!-- <span slot="before">我想你么们</span> -->
      <template v-slot:before>
        <span>我想你们</span>
      </template>
      <el-button type="primary" slot="after">导入excel</el-button>
    </page-tools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import PageTools from '@/components/PageTools/index'

export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
