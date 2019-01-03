## RESTful API

以下 api 路径均以 http://127.0.0.1:7001/api 为前缀

### role 昵称 && 权限 😊

| Method | Path      | Controller.Action           |
| :----- | :-------- | :-------------------------- |
| GET    | /role     | app.controller.role.index   |
| GET    | /role/:id | app.controller.role.show    |
| POST   | /role     | app.controller.role.create  |
| PUT    | /role/:id | app.controller.role.update  |
| DELETE | /role/:id | app.controller.role.destroy |
| DELETE | /role     | app.controller.role.removes |

#### `GET /role` 用户管理首页

接受 get 参数

- pageSize Number 每一页数量
- currentPage Number 当前页数
- isPaging Boolean 是否分页
- search String 检索内容
  实例：/api/role

#### `GET /role/:id` 查看特定用户

接受 URL 参数

#### `POST /role` 新建昵称

接受 post 参数

- name String
- access String
- extra (可选项) 额外说明

#### `PUT /role/:id` 更新信息

接受 put 参数

- name
- access

### userAccess 用户登入/登出 😊

| Method | Path                  | Controller.Action                  |
| :----- | :-------------------- | :--------------------------------- |
| GET    | /user/access/current  | app.controller.userAccess.current  |
| GET    | /user/access/logout   | app.controller.userAccess.logout   |
| POST   | /user/access/login    | app.controller.userAccess.login    |
| PUT    | /user/access/resetPwd | app.controller.userAccess.resetPwd |

> Token Authorization: Bearer token / OAuth 2.0

#### `GET /user/access/current` 用户详情

示例：/api/user/access/current

#### `GET /user/access/logout` 退出登录

#### `POST /user/access/login` 用户登入

接受 post 参数

- mobile 手机号 required
- password 密码 required
- realName 用户真实姓名
- avatar 用户头像
- role 权限、昵称信息
- extra

> 暂未提供更换 avatar 接口

### user 用户管理 CRUD 😊

| Method | Path      | Controller.Action           |
| :----- | :-------- | :-------------------------- |
| GET    | /user     | app.controller.user.index   |
| GET    | /user/:id | app.controller.user.show    |
| POST   | /user     | app.controller.user.create  |
| PUT    | /user/:id | app.controller.user.update  |
| DELETE | /user/:id | app.controller.user.destroy |
| DELETE | /user     | app.controller.user.removes |

### upload 文件上传 (🙃 暂无测试)

| Method | Path              | Controller.Action              |
| :----- | :---------------- | :----------------------------- |
| GET    | /upload           | app.controller.upload.index    |
| GET    | /upload/:id       | app.controller.upload.show     |
| POST   | /upload           | app.controller.upload.create   |
| POST   | /upload/url       | app.controller.upload.url      |
| POST   | /uploads          | app.controller.upload.multiple |
| PUT    | /upload/:id       | app.controller.upload.update   |
| PUT    | /upload/:id/extra | app.controller.upload.extrs    |
| DELETE | /upload/:id       | app.controller.upload.destroy  |
| DELETE | /upload           | app.controller.upload.removes  |
