import IO from 'socket.io-client';
const SOCKET = (() => {
  const socket = IO(SOCKET_SERVER)
  socket.on('handshake', (data) => {
    console.log(`Socket Handshake ${JSON.stringify(data)}`)
  });
  return {
    socket: socket
  }
})()


export default SOCKET;
