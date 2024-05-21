type TChangeNicknameResponse = ApiResponse<TUserInfo>;

type TCheckDuplicateNicknameData = {
  nicknameIsUnique: boolean;
};

type TCheckDuplicateNicknameResponse = ApiResponse<TCheckDuplicateNicknameData>;
