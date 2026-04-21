// src/components/IntelligentForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Описываем схему валидации с помощью Zod
const formSchema = z.object({
  username: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Слишком длинное имя'),
  guestCount: z.number({ message: 'Ожидается число' })
    .min(1, 'Должен быть хотя бы 1 гость')
    .max(10, 'Максимум 10 гостей'),
  arrivalTime: z.string()
    .min(1, 'Пожалуйста, выберите дату и время'),
});

// Выводим типы из схемы
type FormData = z.infer<typeof formSchema>;

export const IntelligentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Данные формы успешно прошли валидацию:', data);
    alert('Форма успешно отправлена! Проверь консоль.');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // Используем палитру: сливочно-желтый фон и шоколадный текст
      className="w-full max-w-md rounded-2xl bg-[#FFFDD0] text-[#000000] p-8 shadow-2xl"
    >
      <h2 
        className="mb-6 text-2xl font-bold border-b-2 pb-4"
        style={{ color: '#4A2511', borderColor: 'rgba(74, 37, 17, 0.2)' }}
      >
        Регистрация на ивент
      </h2>

      {/* Поле 1: Текстовое */}
      <div className="mb-5">
        <label htmlFor="username" className="mb-2 block font-medium">
          Имя организатора:
        </label>
        <input
          id="username"
          type="text"
          {...register('username')}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
          className={`w-full rounded-lg border-2 bg-white/70 p-3 font-sans outline-none transition-colors 
            ${errors.username ? 'border-red-500 focus:border-red-600' : 'border-[#4A2511]/30 focus:border-[#4A2511]'}`}
        />
        {errors.username && (
          <span id="username-error" role="alert" className="mt-1 block text-sm font-semibold text-red-600">
            {errors.username.message}
          </span>
        )}
      </div>

      {/* Поле 2: Числовое */}
      <div className="mb-5">
        <label htmlFor="guestCount" className="mb-2 block font-medium">
          Количество гостей:
        </label>
        <input
          id="guestCount"
          type="number"
          {...register('guestCount', { valueAsNumber: true })}
          aria-invalid={!!errors.guestCount}
          aria-describedby={errors.guestCount ? "guestCount-error" : undefined}
          className={`w-full rounded-lg border-2 bg-white/70 p-3 font-sans outline-none transition-colors 
            ${errors.guestCount ? 'border-red-500 focus:border-red-600' : 'border-[#4A2511]/30 focus:border-[#4A2511]'}`}
        />
        {errors.guestCount && (
          <span id="guestCount-error" role="alert" className="mt-1 block text-sm font-semibold text-red-600">
            {errors.guestCount.message}
          </span>
        )}
      </div>

      {/* Поле 3: Datetime picker */}
      <div className="mb-8">
        <label htmlFor="arrivalTime" className="mb-2 block font-medium">
          Время прибытия:
        </label>
        <input
          id="arrivalTime"
          type="datetime-local"
          {...register('arrivalTime')}
          aria-invalid={!!errors.arrivalTime}
          aria-describedby={errors.arrivalTime ? "arrivalTime-error" : undefined}
          className={`w-full rounded-lg border-2 bg-white/70 p-3 font-sans outline-none transition-colors 
            ${errors.arrivalTime ? 'border-red-500 focus:border-red-600' : 'border-[#4A2511]/30 focus:border-[#4A2511]'}`}
        />
        {errors.arrivalTime && (
          <span id="arrivalTime-error" role="alert" className="mt-1 block text-sm font-semibold text-red-600">
            {errors.arrivalTime.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#4A2511] px-6 py-3 font-bold text-[#FFFDD0] transition-transform hover:scale-[1.02] active:scale-95"
      >
        Подтвердить
      </button>
    </form>
  );
};