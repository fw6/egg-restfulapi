'use strict';
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const Controller = require('egg').Controller;

class UserAccessController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.UserLoginTransfer = {
      mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      password: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
    };

    this.UserResetPwdTransfer = {
      password: {
        type: 'password',
        required: true,
        allowEmpty: false,
        min: 6,
      },
      oldPassword: {
        type: 'password',
        required: true,
        allowEmpty: false,
        min: 6,
      },
    };

    this.UserUpdateTransfer = {
      mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      realName: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[\u2E80-\u9FFF]{2,6}$/,
      },
    };
  }

  // 用户登入
  async login() {
    const { ctx, service } = this;
    ctx.validate(this.UserLoginTransfer);

    const payload = ctx.request.body || {};

    const res = await service.userAccess.login(payload);

    ctx.helper.success({ ctx, res });
  }

  // 用户登出
  async logout() {
    const { ctx, service } = this;
    await service.userAccess.logout();

    ctx.helper.success({ ctx });
  }

  // 修改密码
  async resetPwd() {
    const { ctx, service } = this;

    ctx.validate(this.UserResetPwdTransfer);

    const payload = ctx.request.body || {};

    await service.userAccess.resetPwd(payload);
    ctx.helper.success({ ctx });
  }

  // 获取用户信息
  async current() {
    const { ctx, service } = this;
    const res = await service.userAccess.current();

    ctx.helper.success({ ctx, res });
  }

  // 修改基础信息
  async resetSelf() {
    const { ctx, service } = this;
    ctx.validate(this.UserUpdateTransfer);

    const payload = ctx.request.body || {};
    await service.userAccess.resetSelf(payload);

    ctx.helper.success({ ctx });
  }

  // 修改头像
  async resetAvatar() {
    const { ctx, service } = this;
    const stream = await ctx.getFileStream();
    const filename = path.basename(stream.filename);
    const extname = path.extname(stream.filename).toLowerCase();
    const attachment = new this.ctx.model.Attachment();

    attachment.extname = extname;
    attachment.filename = filename;
    attachment.url = `/uploads/avatar/${attachment._id.toString()}${extname}`;

    const target = path.join(
      this.config.baseDir,
      'app/public/uploads/avatar',
      `${attachment._id.toString()}${attachment.extname}`
    );
    const writeStream = fs.createWriteStream(target);

    try {
      await awaitWriteStream(stream.pipe(writeStream));

      await service.userAccess.resetAvatar(attachment);
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    ctx.helper.success({ ctx });
  }
}

module.exports = UserAccessController;
