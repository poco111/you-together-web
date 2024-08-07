type TDropdownContents = {
  contentsType: 'NICK_NAME' | 'CHANGE_ROLE' | 'NONE';
  dropdownContents: string[];
};

export const getDropdownContents = (
  userInfo: TUserInfo,
  targetUserInfo: TUserInfo
): TDropdownContents => {
  const { userId: curUserId, role: curUserRole } = userInfo;
  const { userId: targetUserId, role: targetUserRole } = targetUserInfo;

  if (curUserId === targetUserId) {
    return { contentsType: 'NICK_NAME', dropdownContents: [] };
  }

  const userRoles = ['HOST', 'MANAGER', 'EDITOR', 'GUEST', 'VIEWER'];
  const userRatings = new Map();
  userRoles.forEach((role, index) => {
    userRatings.set(role, index);
  });

  if (
    curUserRole === 'EDITOR' ||
    curUserRole === 'GUEST' ||
    curUserRole === 'VIEWER' ||
    userRatings.get(curUserRole) >= userRatings.get(targetUserRole)
  ) {
    return { contentsType: 'NONE', dropdownContents: [] };
  }

  const dropdownContents: string[] = [];
  const userRating = userRatings.get(userInfo?.role);
  const targetUserRating = userRatings.get(targetUserInfo?.role);
  userRatings.forEach((rating, role) => {
    if (userRating <= rating && targetUserRating !== rating) {
      dropdownContents.push(role);
    }
  });

  return { contentsType: 'CHANGE_ROLE', dropdownContents: dropdownContents };
};

export const getNicknameFromUserId = (
  userId: number,
  participantsList: TUserInfo[]
) => {
  return participantsList?.find((participant) => participant.userId === userId)
    ?.nickname;
};

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
