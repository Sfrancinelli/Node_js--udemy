const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Sol 1
  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) return console.log(err);
  //     res.end(data);
  //   });
  // Sol 2: Streams. The problem with this solution is that it generates back pressure. The file is readed faster than the writting can happen
  /*
  const readable = fs.createReadStream("test-file.txt");
  readable.on("data", (chunk) => {
    res.write(chunk);
  });
  readable.on("end", () => {
    res.end();
  });
  readable.on("error", (err) => {
    console.error(err);
    res.statusCode = 500;
    res.end("File not found!");
  });
  */

  // Solution 3
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  // ReadableSource.pipe(writeableDestination). The pipe method is there to solve the problem of the back pressure.
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
