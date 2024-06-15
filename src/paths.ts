const paths = {
  home() {
    return '/';
  },
  room(roomCode: string) {
    return `/${roomCode}`;
  },
};

export default paths;
