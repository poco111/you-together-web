import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const errorHandler = (message: string) => {
  const id = 'react-query-toast';

  if (!toast.isActive(id)) {
    toast.error(message, {
      toastId: id,
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof Error) {
          errorHandler(error.message || '알 수 없는 오류가 발생했습니다.');
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error instanceof Error) {
          errorHandler(error.message || '알 수 없는 오류가 발생했습니다.');
        }
      },
    }),
  });
};

export default createQueryClient;
