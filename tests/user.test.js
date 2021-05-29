const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');
beforeEach(setupDatabase);
// beforeEach(() => {
//   console.log('Before Each reached');
// });

// afterEach(() => {
//   console.log('After Each reached');
// });

// beforeEach(async () => {
//   await User.deleteMany();

//   await new User(userOne).save();
// });

test('Should signup User', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'SUshant BAsak',
      email: 'sushant@gmail.com',
      password: '2i1pp1L@ddd',
    })
    .expect(201);

  // Assertions about the database change was correctly  placed
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response object
  expect(response.body).toMatchObject({
    user: {
      name: 'SUshant BAsak',
      email: 'sushant@gmail.com',
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('2i1pp1L@ddd');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      email: userOne.email,
    },
    token: user.tokens[1].token,
  });
});

test('Login must not happen', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.name,
    })
    .expect(400);
});

test('Should get profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not  get profile for unauthenticated User', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('Should delete account of Authenticated user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);

  expect(user).toBeNull();
});

test('Should not delete account of Authenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401);
});

test('Should be able to upload new avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await User.findById(userOneId);

  // .toEqual property used as toBe uses === while later uses an algorithm to check the same
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should be able to update user', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Zlee Shang',
    })
    .expect(201);

  const user = await User.findById(userOneId);
  expect(user.name).toBe('Zlee Shang');
});

test('Should not be able to update user', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Zlee Shang',
    })
    .expect(400);
});
