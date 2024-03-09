## user-remark 插件
**如果需要把数据上传到GitHub，才需要做如下操作，否则可以忽略以下流程，直接使用插件**

Chrome浏览器插件设置：  
![](./images/d8d75daf838971e52dde120478d1ee9a_MD5.png)  
Edge浏览器插件设置：  
![](./images/b88c9b3244027e7baf116e23411740dd_MD5.png)

示例参考：  
![](./images/24da484f4922a4bacfa6f4cacfa54bb9_MD5.png)  
参数解释：  
https://api.github.com/repos/你的用户名/你的仓库名称/contents/路径/  
https://api.github.com/repos/ixxc/temp/contents/ ：表示数据放到temp仓库的根目录下  
https://api.github.com/repos/ixxc/temp/contents/data/ ：表示数据放到temp仓库的data目录下

### github token 获取
1、打开： https://github.com/settings/tokens?type=beta  
![](./images/8fe0d520a085723338f8f7318a96dd65_MD5.png)

2、配置Token，将得到的Token填入浏览器插件的对应的输入框中  
![](./images/196e329ffdd21f721c5a16f43207d889_MD5.png)  
