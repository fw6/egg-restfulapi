'use strict';

module.exports = appInfo => {
  const config = (exports = {});
  config.keys = appInfo.name + 'Fw6IsAHandsomeBoY';

  // add your config here
  config.middleware = [ 'errorHandler' ];

  // 只对 /api 前缀的 URL 路径有效
  config.errorHandler = {
    match: '/api',
  };

  // 安全验证
  config.security = {
    csrf: {
      enable: false,
    },
    // 白名单
    domainWhiteList: [ 'http://localhost:8000' ],
  };

  config.multipart = {
    fileExtensions: [
      '.apk',
      '.pptx',
      '.docx',
      '.doc',
      '.ppt',
      '.csv',
      '.pdf',
      '.pages',
      '.wav',
      '.mov',
    ],
  };

  config.bcrypt = {
    saltRounds: 10,
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/restfulapi',
      options: { useNewUrlParser: true },
    },
  };

  config.jwt = {
    secret: 'Great4-M',
    enable: true,
    match: '/jwt',
  };

  return config;
};
