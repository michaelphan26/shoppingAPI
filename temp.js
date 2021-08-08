// function run() {
//   const list = [
//     {
//       name: 'name',
//       quantity: 2,
//     },
//     {
//       name: 'Hello',
//       quantity: 1,
//     },
//     {
//       name: 'name',
//       quantity: 5,
//     },
//   ];

//   const temp = [];
//   for (const index in list) {
//     const itemOfList = list[index];
//     const itemTemp = temp.find((item) => item.name === itemOfList.name);
//     if (!itemTemp) temp.push(itemOfList);
//     else {
//       const indTemp = temp.indexOf(itemTemp);
//       temp[indTemp].quantity =
//         parseInt(temp[indTemp].quantity) + itemOfList.quantity;
//     }
//   }

//   console.log(temp);
// }

// function run() {
//   try {
//     console.log('Hello');
//     try {
//       throw new Error('hello');
//     } catch (err) {
//       console.log(err);
//     }
//     console.log('Bump');
//   } catch (err) {
//     console.log('error 2');
//     console.log(err);
//   }
// }

function test() {
  return false;
}

function run() {
  const a = test();
  if (a) {
    console.log('True');
  }
  console.log('False');
}

run();

//DB_URL=mongodb://localhost/?replicaSet=rsName
//TEMP=mongodb://localhost:27017/?replicaSet=rsName
