var ctx = require.context('../', true, /.ts$/);
ctx.keys().forEach(ctx);
module.exports = ctx;
