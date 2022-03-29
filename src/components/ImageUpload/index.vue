<template>
  <div>
    <el-upload 
    list-type="picture-card" 
    :limit="1" action="#" 
    :on-preview="preview"
    :file-list="fileList"
    :on-remove="handleRemove"
    :on-change="changeFile"
    :before-upload="beforeUpload"
    :class="{disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  data(){
    return{
      fileList:[{url:'http://localhost:3004/666.webp'}],
      showDialog:false,
      imgUrl:''
    }
  },
  computed:{
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    },
  },
  methods:{
    preview(file){
       // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file,fileList){
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item =>item.uid !== file.uid)
      // this.fileList = fileList
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file){
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // if(!types.includes(file.type)){
        if(!types.some(item => item === file.type)){
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if(maxSize < file.size){
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    }

  }

}
</script>

<style >
.disabled .el-upload--picture-card {
  display: none
}
</style>
