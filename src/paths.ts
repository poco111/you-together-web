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

// 상수 대신에 slug 때문에 함수로 씀
