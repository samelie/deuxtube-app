import IO from 'socket.io-client';
const SOCKET = (() => {
  const socket = IO(SSS)
  socket.on('handshake', (data) => {
    console.log(`Socket Handshake ${JSON.stringify(data)}`)
  });
  return {
    socket: socket
  }
})()


export default SOCKET;
