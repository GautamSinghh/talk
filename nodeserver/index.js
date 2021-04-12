const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:5500",
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', socket => {
  //IF ANY NEW USER JOINS , LET OTHER USERS CONNECTED TO THE SERVER KNON//
  socket.on('new-user-joined', name => {
    // console.log("new-user", name);   
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
  //IS SOMEONE ONE A MESSAGE, BRODCAST IT TO OTHER PEOPLE//
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
  })
 //IF SOME ONE LEVES THE CHAT, LET OTHER KNOWW//
  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id])
    delete users[socket.id]
  });

});

