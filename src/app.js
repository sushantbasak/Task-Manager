require('./db/mongoose');
const express = require('express');
const app = express();
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.status(503).send('Site is under maintainence');
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.listen(port, () =>
  console.log('Server started successfully on port ' + port)
);
