type TChangeNicknameResponse = ApiResponse<TUserInfo>;

type TCheckDuplicateNicknameData = {
  type: string;
  message: string;
}[];

type TCheckDuplicateNicknameResponse = ApiResponse<TCheckDuplicateNicknameData>;
