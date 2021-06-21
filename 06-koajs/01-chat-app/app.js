const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  return new Promise((resolve) => {
    const id = Math.random();
    subscribers[id] = ctx;
    ctx.res.on('close', () => {
      resolve();
      delete subscribers[id];
    });
  });
});

router.post('/publish', async (ctx, next) => {
  const {request: {body: {message} = {}} = {}} = ctx;

  if (message) {
    for (const id in subscribers) {
      subscribers[id].status = 200;
      subscribers[id].res.end(message);
    }
    ctx.status = 200;
    ctx.res.end();
  }
});

app.use(router.routes());

module.exports = app;
