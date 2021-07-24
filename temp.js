function run() {
  const list = [
    {
      name: 'name',
      quantity: 2,
    },
    {
      name: 'Hello',
      quantity: 1,
    },
    {
      name: 'name',
      quantity: 5,
    },
  ];

  const temp = [];
  for (const index in list) {
    const itemOfList = list[index];
    const itemTemp = temp.find((item) => item.name === itemOfList.name);
    if (!itemTemp) temp.push(itemOfList);
    else {
      const indTemp = temp.indexOf(itemTemp);
      temp[indTemp].quantity =
        parseInt(temp[indTemp].quantity) + itemOfList.quantity;
    }
  }

  console.log(temp);
}

run();
