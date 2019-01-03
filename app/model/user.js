'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    realName: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    avatar: {
      type: String,
      default: 'https://avatars3.githubusercontent.com/u/45113594?s=40&v=4',
    },
    extra: {
      type: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('User', UserSchema);
};
