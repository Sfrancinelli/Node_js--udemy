const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();

// amout of threadpool
process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Inmediate 1 finished"));

fs.readFile("text-file.txt", () => {
  console.log("i/o finished");
  console.log(".-.-.-.-.-.-.-.-.-.-.-.");

  setTimeout(() => console.log("timer 2"), 0);
  setTimeout(() => console.log("timer 3"), 3000);
  setImmediate(() => console.log("Inmediate 2 finished"));

  process.nextTick(() => console.log("process.nextTick"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start, "Enctrypted password")
  );
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start, "Enctrypted password")
  );
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start, "Enctrypted password")
  );
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () =>
    console.log(Date.now() - start, "Enctrypted password")
  );
});

console.log("top level code");
