const mongoose = require('mongoose');

module.exports = (schema) => {
  const Schema = new mongoose.Schema(schema.fields, schema.options);

  // Register methods and statics on the schema.
  Schema.methods = schema.methods;
  Schema.statics = schema.statics;

  // Register plugins on the schema.
  if (schema.plugins) {
    schema.plugins.forEach((p) => {
      if (typeof p === 'function') {
        Schema.plugin(p);
      } else {
        Schema.plugin(p.register, p.options);
      }
    });
  }

  // Register hooks on the schema.
  if (schema.hooks) {
    if (schema.hooks.pre) {
      Object.keys(schema.hooks.pre).forEach((name) => {
        const hook = schema.hooks.pre[name];
        Schema.pre(name, hook);
      });
    }
    if (schema.hooks.post) {
      Object.keys(schema.hooks.post).forEach((name) => {
        const hook = schema.hooks.post[name];
        Schema.post(name, hook);
      });
    }
  }

  // Register virtuals on the schema.
  if (schema.virtuals) {
    Object.keys(schema.virtuals).forEach((name) => {
      const virt = schema.virtuals[name];
      if (typeof virt === 'function') {
        virt(Schema.virtual(name));
      } else {
        Schema.virtual(name, virt);
      }
    });
  }

  // Register indexes on the schema.
  if (schema.indexes) {
    schema.indexes.forEach(i => Schema.index(i.fields || { }, i.options || { }));
  }

  return Schema;
};
