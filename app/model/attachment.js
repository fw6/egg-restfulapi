'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AttachmentSchema = new Schema({
    extname: String,
    url: String,
    filename: String,
    extra: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('Attachment', AttachmentSchema);
};
