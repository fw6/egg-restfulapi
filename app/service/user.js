'use strict';
const Service = require('egg').Service;

class UserService extends Service {
  // create =========================
  async create(payload) {
    const { ctx, service } = this;
    const role = await service.role.show(payload.role);
    if (!role) {
      ctx.throw(404, 'role is not found');
    }
    payload.password = await this.ctx.genHash(payload.password);
    return ctx.model.User.create(payload);
  }

  // destroy ========================
  async destroy(_id) {
    const { ctx } = this;
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  // update =========================
  async update(_id, payload) {
    const { ctx } = this;
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload);
  }

  // show ===========================
  async show(_id) {
    const user = this.service.user.find(_id);
    if (!user) {
      this.ctx.throw(404, 'user is not found');
    }
    return this.ctx.model.User.findById(_id).populate('role');
  }

  // index ==========================
  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload;
    let res = [];
    let count = 0;
    const skip = (Number(currentPage) - 1) * Number(pageSize || 10);
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createAt: -1 })
          .exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({})
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createAt: -1 })
          .exec();
        count = res.length;
      }
    } else {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate('role')
          .sort({ createAt: -1 })
          .exec();
        count = res.length;
      } else {
        res = await this.ctx.model.User.find({})
          .populate('role')
          .sort({ createAt: -1 })
          .exec();
        count = res.length;
      }
    }

    const data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc);
      jsonObject.key = i;
      jsonObject.password = 'Are you Ok?';
      jsonObject.createAt = this.ctx.helper.formatTime(e.createAt);
      return jsonObject;
    });
    return {
      count,
      list: data,
      pageSize: Number(pageSize),
      currentPage: Number(currentPage),
    };
  }

  // removes =======================
  async removes(payload) {
    return this.ctx.model.User.remove({ _id: { $in: payload } });
  }

  // common ========================
  async findByMobile(mobile) {
    return this.ctx.model.User.findOne({ mobile });
  }

  async find(id) {
    return this.ctx.model.User.findById(id);
  }

  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values);
  }
}

module.exports = UserService;
