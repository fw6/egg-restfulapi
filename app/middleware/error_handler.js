'use strict';

module.exports = (opts, app) =>
  async function(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发error事件，框架会记录一条错误日志
      app.emit('error', err, this);
      const status = err.status || 500;
      // 生产环境500错误详细内容不返回给客户端，因为可能包含敏感信息
      const error =
        status === 500 && app.config.env === 'prod'
          ? 'Internal Server Errror'
          : err.message;

      ctx.body = {
        code: status,
        error,
      };

      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = 200;
    }
  };
