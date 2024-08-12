const { kafka } = require("./client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log("Connecting Producer");
  await producer.connect();
  console.log("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [taskName, taskStatus] = line.split(" ");
    await producer.send({
      topic: "Bot2Do-task",
      messages: [
        {
          partition: taskStatus.toLowerCase() === "incomplete" ? 0 : 1,
          key: "task-update",
          value: JSON.stringify({ name: taskName, taskStatus }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();
