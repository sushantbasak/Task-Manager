require('../src/db/mongoose');

const Task = require('../src/models/task');

// Task.findByIdAndRemove('60a7544bc086cf35f7277129')
//   .then((task) => {
//     console.log(task);

//     return Task.countDocuments({ completed: false });
//   })
//   .then((count) => console.log('Completed Tasks are - ', count))
//   .catch((e) => console.log(e));

// 60a7af5a7faae0547ac20aa1

const deleteTaskAndCount = async (id, flag) => {
  const task = await Task.findByIdAndRemove(id);

  const count = await Task.countDocuments({ completed: flag });

  return count;
};

deleteTaskAndCount('60a7af5a7faae0547ac20aa1', false)
  .then((count) => console.log(count))
  .catch((e) => console.log(e));
