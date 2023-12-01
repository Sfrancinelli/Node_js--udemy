const fs = require("fs");

const text = fs.readFileSync("./txt/input.txt", "utf-8");

const textOut = `This is what we know about the avocado: ${text}.\nCreated on ${Date.now()}`;
console.log(textOut);

fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
