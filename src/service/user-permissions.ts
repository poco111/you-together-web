export const hasVideoEditPermission = (userInfo: TUserInfo) => {
  return userInfo?.role === 'HOST' ||
    userInfo?.role === 'MANAGER' ||
    userInfo?.role === 'EDITOR'
    ? true
    : false;
};
