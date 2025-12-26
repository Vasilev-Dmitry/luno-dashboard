import { useForm } from 'react-hook-form';
import { useRenameProfile } from '@/api/hooks/useSettings';

type FormData = {
    name: string;
};

export default function RenameForm() {
    const {mutate, isPending} = useRenameProfile();
    const {register, handleSubmit, formState: { errors }} = useForm<FormData>({});

    const onSubmit = (data: FormData) => {
        mutate(data.name);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-10 gap-2">
            <input
                {...register("name", {
                    required: "Имя обязательно",
                    minLength: { value: 2, message: "Минимум 2 символа" },
                    maxLength: { value: 20, message: "Максимум 20 символов" },
                })}
                placeholder="Введите имя"
                className='flex items-center justify-start placeholder:text-white text-white h-full px-4'
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="text-white py-2 px-4 bg-blue-500 rounded-lg cursor-pointer"
            >
                {isPending ? "Сохранение..." : "Обновить имя"}
            </button>
        </form>
    );
}