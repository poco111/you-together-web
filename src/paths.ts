const paths = {
  home() {
    return '/';
  },
  room(roomCode: string, passwordExist: boolean) {
    return `/${roomCode}?passwordExist=${passwordExist}`;
  },
};

export default paths;
