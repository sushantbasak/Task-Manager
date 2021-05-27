require('./db/mongoose');
const express = require('express');
const app = express();
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//   res.status(503).send('Site is under maintainence');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

const multer = require('multer');

const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 100000,
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf')) {
    //   cb(new Error('Please Upload PDF file'));
    // }

    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please upload doc file'));
    }

    cb(undefined, true);
    // cb(new Error("File must be a PDF"));
    // cb(undefined,true);
    // cb(undefined,false)
  },
});

app.post(
  '/upload',
  upload.single('upload'),
  (req, res) => {
    res.send('Uploaded Successfully');
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.listen(port, () =>
  console.log('Server started successfully on port ' + port)
);
