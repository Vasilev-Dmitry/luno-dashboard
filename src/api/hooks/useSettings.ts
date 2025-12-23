import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {getProfile} from '@/api/settings';
import {Rename} from "@/api/settings";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });
};

export const useRenameProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Rename,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error("Ошибка при смене имени:", error.response?.data?.detail || error.message);
    }
    });
};