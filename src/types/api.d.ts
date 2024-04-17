type ApiResponse<T> = {
  code: number;
  status: string;
  result: string;
  data: T;
};
