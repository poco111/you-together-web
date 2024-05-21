import { z } from 'zod';
const nicknameRegex = /^[a-zA-Z가-힣0-9]+$/;

export const nicknameChangeSchema = (currentNickname: string) =>
  z.object({
    newNickname: z
      .string()
      .trim()
      .min(1, '닉네임은 최소 1자 이상이어야 합니다.')
      .max(20, '닉네임은 최대 20자 이하이어야 합니다.')
      .regex(nicknameRegex, '닉네임은 영어, 한글, 숫자만 사용할 수 있습니다.')
      .superRefine((val, ctx) => {
        if (val === currentNickname) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '현재와 동일한 닉네임입니다',
          });
        }
      }),
  });

export type TNicknameChangePayload = z.infer<
  ReturnType<typeof nicknameChangeSchema>
>;
