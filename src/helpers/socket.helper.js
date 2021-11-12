const socketIo = require("socket.io");

let io = null;

module.exports.initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    // console.log("\nCLIENT ĐÃ KẾT NỐI \n");

    socket.on("disconnect", () => {
      // console.log("\nCLIENT DISCONNECTED\n");

    });
    socket.on("future", (data) => {
      // console.log(data);

    });
  });
};

module.exports.boardCast = (message) => {
  if (!io) {
    console.log("\nSOCKET IO NOT INIT YET!\n");
    return false;
  }

  io.emit("broadcast-channel", message);
  // console.log("\nĐÃ GỬ SOCKET MSG, product_id:", message);

  return true;
};
