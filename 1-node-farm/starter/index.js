const fs = require("fs");

/*
// Blocking, synchronous way
const text = fs.readFileSync("./txt/input.txt", "utf-8");

const textOut = `This is what we know about the avocado: ${text}.\nCreated on ${Date.now()}`;
console.log(textOut);

fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
*/

// Non-blocking, asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.error(err);
      });
    });
  });
});
console.log("reading file");