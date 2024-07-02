import { ZodTypeAny, z } from 'zod';

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

export const roomCreationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '방 제목을 입력해주세요')
    .max(20, '방 제목은 최대 20자 입니다.'),
  capacity: zodInputStringPipe(
    z
      .number({ required_error: 'test' })
      .min(2, '정원은 최소 2명 이상이어야 합니다.')
      .max(10, '정원은 최대 10명 이하여야 합니다.')
  ),
  password: z.string().max(20, '비밀번호는 최대 20자 입니다.').optional(),
});

export const roomTitleChangeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '방 제목을 입력해주세요')
    .max(20, '방 제목은 최대 20자 입니다.'),
});

export const roomSearchSchema = z.object({
  searchKeyword: z
    .string()
    .regex(/^[ㄱ-ㅎ가-힣a-zA-Z0-9\s]*$/, '특수문자는 사용할 수 없습니다.')
    .optional(),
});

export type TRoomCreationPayload = z.infer<typeof roomCreationSchema>;

export type TRoomTitleChangePayload = z.infer<typeof roomTitleChangeSchema>;

export type TRoomSearchPayload = z.infer<typeof roomSearchSchema>;
