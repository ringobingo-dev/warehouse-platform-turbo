import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';

interface UseFetchOptions {
  revalidateOnFocus?: boolean;
  dedupingInterval?: number;
  refreshInterval?: number;
}

const useFetch = <T = any>(url: string, options?: UseFetchOptions) => {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: options?.revalidateOnFocus ?? true,
    dedupingInterval: options?.dedupingInterval ?? 10000, // 10 seconds
    refreshInterval: options?.refreshInterval,
  });

  return { 
    data, 
    error, 
    isLoading, 
    mutate,
    isError: !!error 
  };
};

export default useFetch; 