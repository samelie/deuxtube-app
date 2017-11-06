import IO from 'socket.io-client';
const SOCKET = (() => {
  const localSocket = IO(LOCAL_SERVER)
  localSocket.on('handshake', (data) => {
    console.log(`Local Socket Handshake ${JSON.stringify(data)}`)
  });
  const remoteSocket = IO(REMOTE_SERVER)
  remoteSocket.on('handshake', (data) => {
    console.log(`Romote Socket Handshake ${JSON.stringify(data)}`)
  });
  return {
    localSocket: localSocket,
    remoteSocket: remoteSocket
  }
})()


export default SOCKET;
