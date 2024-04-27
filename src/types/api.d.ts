type ApiResponse<T> = {
  code: number;
  status: string;
  result: string;
  data: T;
};

// api가 실제 가져오는 data 말고 뭐 상태 코드나 이런거 같이 와서 이런 타입 재정의 하는거 귀찮으니깐 한번 래핑하는 타입
