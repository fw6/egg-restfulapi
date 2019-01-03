'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.UserCreateTransfer = {
      mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /(^1[34578]\d{9}$)|(^09\d{8}$)/,
      },
      // 不能包含空格， 长度6-18位
      password: {
        type: 'password',
        required: true,
        allowEmpty: false,
        min: 6,
        format: /^[\w\.\\\-\],?/|+*()[{}!"';<>@#$%^&`~=:]{6,18}$/,
      },
      realName: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[\u2E80-\u9FFF]{2,6}$/,
      },
    };

    this.UserUpdateTransfer = {
      mobile: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /(^1[34578]\d{9}$)|(^09\d{8}$)/,
      },
      realName: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[\u2E80-\u9FFF]{2,6}$/,
      },
    };
  }

  // 创建用户
  async create() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.UserCreateTransfer);
    // 组装参数
    const payload = ctx.request.body || {};
    // 调用 service 进行业务处理
    const res = await service.user.create(payload);
    // 设置响应内容和状态码
    ctx.helper.success({ ctx, res });
  }

  // 删除单个用户
  async destroy() {
    const { ctx, service } = this;
    const { id } = ctx.params;

    await service.user.destroy(id);
    ctx.helper.success({ ctx });
  }

  // 修改用户
  async update() {
    const { ctx, service } = this;
    // 校验参数
    ctx.validate(this.UserUpdateTransfer);
    const { id } = ctx.params;
    const payload = ctx.request.body || {};

    await service.user.update(id, payload);

    ctx.helper.success({ ctx });
  }

  // 获取单个用户
  async show() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const res = await service.user.show(id);
    ctx.helper.success({ ctx, res });
  }

  // 获取所有用户(分页/模糊)
  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service.user.index(payload);
    ctx.helper.success({ ctx, res });
  }

  // 删除所选用户(id[])
  async removes() {
    const { ctx, service } = this;
    const { id } = ctx.request.body;
    const payload = id.split(',') || [];
    await service.user.removes(payload);
    ctx.helper.success({ ctx });
  }
}

module.exports = UserController;
