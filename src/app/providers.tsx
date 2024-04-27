'use client';

import { NextUIProvider } from '@nextui-org/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { useState } from 'react';

// 이건 next ui 용 provider
export function NextUIProviders({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}

// 리액트 쿼리를 넥스트에서 쓰려면 해야된다던데 클라이언트 쪽에서만 쓰면 지워도 되는듯?
// 나도 정확히 알고 쓴건 아니어서 지워도 실행 되는지 테스트해보고 잘 되면 지우기
export function ReactQueryProviders({ children }: React.PropsWithChildren) {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
