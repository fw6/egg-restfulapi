'use strict';

const Service = require('egg').Service;

class UserAccessService extends Service {
  async login(payload) {
    const { ctx, service } = this;
    const user = await service.user.findByMobile(payload.mobile);
    if (!user) {
      ctx.throw(404, 'user not found');
    }

    const verifyPwd = await ctx.compare(payload.password, user.password);
    if (!verifyPwd) {
      ctx.throw(404, 'user password is error');
    }

    // 生成Token令牌
    return { token: await service.actionToken.apply(user._id) };
  }

  async resetPwd(values) {
    const { ctx, service } = this;
    // ctx.state.user 可以提取 JWT 编码的 data
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);

    if (!user) {
      ctx.throw(404, 'user is not found');
    }

    const verifyPwd = await ctx.compare(values.oldPassword, user.password);
    if (!verifyPwd) {
      ctx.throw(404, 'user password error');
    } else {
      values.password = await ctx.genHash(values.password);
      return service.user.findByIdAndUpdate(_id, values);
    }
  }

  async current() {
    const { ctx, service } = this;
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);

    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    user.password = 'How old are you?';
    return user;
  }

  async resetSelf(values) {
    const { ctx, service } = this;
    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    return service.user.findByIdAndUpdate(_id, values);
  }

  async resetAvatar(values) {
    const { ctx, service } = this;
    await service.upload.create(values);

    const _id = ctx.state.user.data._id;
    const user = await service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    return service.user.findByIdAndUpdate(_id, { avatar: values.url });
  }

  async logout() {
    // 客户端清除 Token 即可退出登录
    console.log('logout');
  }
}

module.exports = UserAccessService;
