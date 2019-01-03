'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const download = require('image-downloader');

class UploadController extends Controller {
  // 单文件上传
  async create() {
    const { ctx, service } = this;
    // 要通过 ctx.getFileStream 便捷的获取用户上传的文件，需满足两个条件：
    //    1. 只支持上传一个文件
    //    2. 上传文件必须在所有其他的 fields 后面，否则拿不到文件流时可能还获取不到 fields
    const stream = await ctx.getFileStream();

    // 所有表单字段都能通过 stream.fields 获取到
    const filename = path.basename(stream.filename);
    const extname = path.extname(stream.fieldname).toLowerCase();

    const attachment = new this.ctx.model.Attachment();
    attachment.filename = filename;
    attachment.extname = extname;
    attachment.url = `/uploads/${attachment._id.toString()}${extname}`;

    const target = path.join(
      this.config.baseDir,
      'app/public/uploads',
      `${attachment._id.toString()}${attachment.extname}`
    );
    const writeStream = fs.createWriteStream(target);

    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    const res = await service.upload.create(attachment);
    ctx.helper.success({ ctx, res });
  }

  async url() {
    const { ctx, service } = this;

    const attachment = new this.ctx.model.Attachment();
    const { url } = ctx.request.body;
    const filename = path.basename(url);
    const extname = path.extname(url).toLowerCase();

    const options = {
      url,
      dest: path.join(
        this.config.baseDir,
        'app/public/uploads',
        `${attachment._id.toString()}${extname}`
      ),
    };

    let res;
    try {
      // 写入文件
      await download.image(options);
      attachment.extname = extname;
      attachment.filename = filename;
      attachment.url = `/uploads/${attachment._id.toString()}${extname}`;

      res = await service.upload.create(attachment);
    } catch (err) {
      throw err;
    }

    ctx.helper.success({ ctx, res });
  }

  // 多文件上传
  async multiple() {
    const { ctx, service } = this;
    const parts = ctx.multipart();
    const files = [];

    let part; // parts() return a promise
    while ((part = await parts()) != null) {
      if (part.length) {
        // 如果是数组的话是 filed
        // console.log('field: ' + part[0])
        // console.log('value: ' + part[1])
        // console.log('valueTruncated: ' + part[2])
        // console.log('fieldnameTruncated: ' + part[3])
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream, 但是 part.filename 为空)
          // 需要作出处理, 例如给出错误提示信息
          return;
        }

        // part 是上传的文件流
        // console.log('field: ' + part.fieldname)
        // console.log('filename: ' + part.filename)
        // console.log('extname: ' + part.extname)
        // console.log('encoding: ' + part.encoding)
        // console.log('mime: ' + part.mime)
        const filename = part.filename.toLowerCase();
        const extname = part.extname(part.filename).toLowerCase();

        const attachment = new ctx.model.Attachment();
        attachment.filename = filename;
        attachment.extname = extname;
        attachment.url = `/uploads/${attachment._id.toString()}${extname}`;

        const target = path.join(
          this.config.baseDir,
          'app/public/uploads',
          `${attachment._id.toString()}${extname}`
        );
        const writeStream = fs.createWriteStream(target);

        try {
          await awaitWriteStream(part.pipe(writeStream));
          await service.upload.create(attachment);
        } catch (err) {
          await sendToWormhole(part);
          throw err;
        }

        files.push(`${attachment._id}`);
      }
    }

    ctx.helper.success({ ctx, res: { _ids: files } });
  }

  async destroy() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    await service.upload.destroy(id);

    ctx.helper.success({ ctx });
  }

  // 修改单个文件
  async update() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const attachment = await service.upload.updatePre(id);

    const stream = await ctx.getFileStream();
    const extname = path.extname(stream.filename).toLowerCase();
    const filename = path.basename(stream.filename);

    attachment.extname = extname;
    attachment.filename = filename;
    attachment.url = `/uploads/${attachment._id.toString()}${extname}`;

    const target_U = path.join(
      this.config.baseDir,
      'app/public/uploads',
      `${attachment._id}${extname}`
    );
    const writeStream = fs.createWriteStream(target_U);

    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }

    // 保持原图片 _id 不变, 更新其他属性
    await service.upload.update(id, attachment);
    ctx.helper.success({ ctx });
  }

  // 添加图片描述
  async extra() {
    const { ctx, service } = this;
    const { id } = ctx.params;

    const payload = ctx.request.body || {};
    await service.upload.extra(id, payload);

    ctx.helper.success({ ctx });
  }

  // 获取单个文件
  async show() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const res = await service.upload.show(id);

    ctx.helper.success({ ctx, res });
  }

  // 获取所有文件
  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service.upload.index(payload);
    ctx.helper.success({ ctx, res });
  }

  // 删除所选文件(条件id[])
  async removes() {
    const { ctx, service } = this;
    const { id } = ctx.request.body;
    const payload = id.split(',') || [];

    for (const attachment of payload) {
      await service.upload.destroy(attachment);
    }
    ctx.helper.success({ ctx });
  }
}

module.exports = UploadController;
