function run() {
  console.log(60 * 60 * 24 * 1000);
  console.log(
    new Date().getTime() - new Date("2021-07-19T04:11:02.997+00:00").getTime()
  );
}

run();
