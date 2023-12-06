const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const ee = new Sales();

ee.on("newSale", () => {
  console.log("new Sale");
});

ee.on("newSale", () => {
  console.log("constumer name: SF");
});

ee.on("newSale", (stock) => {
  console.log(`There are now ${stock} products in stock`);
});

ee.emit("newSale", 9);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////7
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  console.log(req.url);
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request");
});

server.on("close", () => {
  console.log("server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("waiting for request");
});
