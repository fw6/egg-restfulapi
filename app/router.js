'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  // role CRUD
  router.delete('/api/role', controller.role.removes);
  router.resources('role', '/api/role', controller.role);

  // userAccess
  router.post('/api/user/access/login', controller.userAccess.login);
  router.get(
    '/api/user/access/current',
    app.jwt,
    controller.userAccess.current
  );
  router.get('/api/user/access/logout', controller.userAccess.logout);
  router.put(
    '/api/user/access/resetPwd',
    app.jwt,
    controller.userAccess.resetPwd
  );

  // user
  router.delete('/api/user', controller.user.removes);
  router.resources('user', '/api/user', controller.user);

  // upload
  // 单文件上传
  router.post('/api/upload', controller.upload.create);
  router.post('/api/upload/url', controller.upload.url);
  // 多文件上传
  router.post('/api/uploads', controller.upload.multiple);
  // 单文件删除
  router.delete('/api/upload/:id', controller.upload.destroy);
  // 单文件更新
  router.put('/api/upload/:id', controller.upload.update);
  router.put('/api/upload/:id/extra', controller.upload.extra);
  // 获取单文件
  router.get('/api/upload/:id', controller.upload.show);
  // 获取所有
  router.get('/api/upload', controller.upload.index);
  // 删除所有
  router.delete('/api/upload', controller.upload.removes);
};
