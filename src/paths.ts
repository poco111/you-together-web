const paths = {
  home() {
    return '/';
  },
  rooms() {
    return '/rooms';
  },
  room(roomslug: string) {
    return `/rooms/${roomslug}`;
  },
};

export default paths;
