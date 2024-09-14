### 注意 node 版本，自行安装 nvm 后，在根目录下执行下列命令即可
```shell
nvm use $(Get-Content .nvmrc)
```
注：node版本不对可能会导致数据库连接不上


初始化数据库
1. 创建数据库 mobile，用户名是root，密码是123456。
2. 导入sql数据，把 mobile.sql 导入数据库。