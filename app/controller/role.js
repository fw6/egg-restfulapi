'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      name: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
      access: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
    };
  }

  async create() {
    const { ctx, service } = this;
    ctx.validate(this.createRule);
    const payload = ctx.request.body || {};

    const res = await service.role.create(payload);
    ctx.helper.success({ ctx, res });
  }

  async destroy() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    await service.role.destroy(id);
    ctx.helper.success({ ctx });
  }

  async update() {
    const { ctx, service } = this;
    ctx.validate(this.createRule);
    const { id } = ctx.params;
    const payload = ctx.request.body || {};

    await service.role.update(id, payload);
    ctx.helper.success({ ctx });
  }

  async show() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const res = await service.role.show(id);

    ctx.helper.success({ ctx, res });
  }

  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service.role.index(payload);

    ctx.helper.success({ ctx, res });
  }

  async removes() {
    const { ctx, service } = this;
    // {id: '5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41'}
    const { id } = ctx.request.body;
    const payload = id.split(',') || [];
    await service.role.removes(payload);

    ctx.helper.success({ ctx });
  }
}

module.exports = RoleController;
