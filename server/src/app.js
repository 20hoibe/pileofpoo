const http = require('http');
const express = require('express');
const app = express();

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res
 * @param {() => void} next
 */
const logMiddleware = (req, res, next) => {
  const {method, url, body} = req;
  console.log(`${method} ${url}:\n${JSON.stringify(req.headers)}\n${JSON.stringify(body)}`);
  next();
};

app.use(express.json());
app.use(logMiddleware);


let nextUserId = 1;
const userIdByToken = new Map();
const userById = new Map();

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res
 * @param {() => void} next
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('authorization') || '';
  if (!/^Bearer\s+(.+)$/.test(authHeader)) {
    res.writeHead(400, 'invalid auth header');
    res.end();
    return;
  }
  
  const token = RegExp.$1;

  const userId = userIdByToken.get(token);
  if (!userId) {
    res.writeHead(403, 'go away');
    res.end();
    return;
  }

  req.user = userById.get(userId);
  next();
};

app.post('/user', (req, res) => {
  if (!req.body.name) {
    res.writeHead(400, 'missing name');
    res.end();
    return;
  }
  
  const token = `token-${Date.now()}`;

  const user = {
    id: nextUserId++,
    name: req.body.name,
    pooCount: 1,
    token
  };

  userIdByToken.set(token, user.id);
  userById.set(user.id, user);
  
  res.send(user);
  res.end();
});

app.get('/user', authMiddleware, (req, res) => {
  const users = [];
  userById.forEach(user => {
    users.push({id: user.id,  name: user.name});
  });

  res.send(users);
  res.end();
});

app.get('/poo', authMiddleware, (req, res) => {
  res.send({pooCount: req.user.pooCount});
  res.end();
});

app.post('/user/:userId/poo', authMiddleware, (req, res) => {
  const userId = +req.params.userId;

  if (req.user.pooCount <= 0) {
    res.writeHead(400, 'not enough poo');
    res.end();
    return;
  }

  if (!userById.has(userId)) {
    res.writeHead(400, 'unknown user');
    res.end();
    return;
  }

  req.user.pooCount--;
  userById.get(userId).pooCount++;

  res.end();
});

const server = new http.Server(app);
server.listen(3000, '0.0.0.0');