 
 ### 环境 git node grep
  ```
  npm i -g zx
  ```
 
 ### 配置
 ##### 1、 申请 Personal access tokens =>  repo => 全部 打勾
```
https://github.com/settings/apps
```
  ##### 2、curl to fetch  获取 token
```
  curl -i -u userName:Author-Token "https://api.github.com/orgs/{org}/repos?per_page=100&page=1"

  https://kigiri.github.io/fetch/
```
  ##### 3、复制 “Basic xxxxxxxx”  粘贴到 git.mjs 中的 token 变量

### 使用
 ```
 chmod u+x ./git.mjs
 ./git.mjs -org {rogName}
 ```  