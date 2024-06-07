export const hasVideoEditPermission = (userInfo: TUserInfo) => {
  return (
    userInfo?.role === 'HOST' ||
    userInfo?.role === 'MANAGER' ||
    userInfo?.role === 'EDITOR'
  );
};

export const hasChatPermission = (userInfo: TUserInfo) => {
  return (
    userInfo.role === 'HOST' ||
    userInfo.role === 'MANAGER' ||
    userInfo.role === 'EDITOR' ||
    userInfo.role === 'GUEST'
  );
};

export const hasRoomTitleEditPermission = (userInfo: TUserInfo) => {
  return userInfo.role === 'HOST';
};
