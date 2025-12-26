import {useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import {CreatePayment, GetPaymentsData} from "@/api/payment";

export const useCreatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: CreatePayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment'] });
        },
    });
};

export const useGetPaymentsData = (link: string | null) => {
    return useQuery({
        queryKey: ['payment-link', link],
        queryFn: () => {
            if (!link) throw new Error('Link is required');
            return GetPaymentsData(link);
        },
        enabled: !!link,
        staleTime: 15 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}