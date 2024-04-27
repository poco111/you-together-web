import { ZodTypeAny, z } from 'zod';

// 이건 나도 모름. gpt 코드
// 인풋에 숫자만 강제하게 하려고 이렇게 함
const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: '숫자를 입력해주세요.',
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe);

// 방생성 스키마
// 방생성 validation 로직
export const roomCreationSchema = z.object({
  // string 타입이어야 되고
  // 좌우 빈 문자열 자르고
  // required (필수 입력이어야 되고) minLength가 1이어야 됨. 이상하다고 할 수도 있는데 공식문서에서 이렇게 사용하라 함.
  // 최대 20글자여야 됨.
  // 둘다 뒤에 있는건 에러메세지
  title: z
    .string()
    .trim()
    .min(1, '방 제목을 입력해주세요')
    .max(20, '방 제목은 최대 20자 입니다.'),

  // 숫자여야되는데 나도 pipe 사용법은 모름 gpt랑 스택오버플로
  capacity: zodInputStringPipe(
    z
      // 숫자여야 하고, required error는 테스트 해본거 지워야됐네 ㅈㅅ ㅋㅋ;
      .number({ required_error: 'test' })
      // 최소 2명 이상이어야 함 (숫자 타입이라 length가 아니라 값 그자체가 2이상)
      .min(2, '정원은 최소 2명 이상이어야 합니다.')
      // 최대 10명이어야 함
      .max(10, '정원은 최대 10명 이하여야 합니다.')
  ),
  // string 타입
  // 최대 길이 20자
  // optional이라 입력 안해도 폼 제출시 okok
  password: z.string().max(20, '비밀번호는 최대 20자 입니다.').optional(),
});

// 스키마 토대로 타입 생성
export type TRoomCreationPayload = z.infer<typeof roomCreationSchema>;
