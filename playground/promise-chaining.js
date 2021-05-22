require('../src/db/mongoose');

const User = require('../src/models/user');

// User.findByIdAndUpdate('60a752985fe98c35162546d1', { name: 'Sushant Basak' })
//   .then((user) => {
//     console.log(user);

//     return User.countDocuments({ age: 21 });
//   })
//   .then((counter) => console.log('Number of users of age 21 ', counter))
//   .catch((e) => console.log(e));

const updateAgecount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });

  const count = await User.countDocuments({ age });

  return count;
};

updateAgecount('60a752985fe98c35162546d1', 11)
  .then((count) => console.log(count))
  .catch((e) => console.log(e));
