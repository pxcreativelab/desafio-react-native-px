import { useToastStore } from '../stores/useToastStore';

/**
 * Hook para facilitar o uso do Toast
 *
 * @example
 * const toast = useToast();
 * toast.success('Operação realizada com sucesso!');
 * toast.error('Erro ao processar requisição');
 */
export const useToast = () => {
  const { showToast } = useToastStore();

  return {
    success: (message: string, duration?: number) => {
      showToast(message, 'success', duration);
    },
    error: (message: string, duration?: number) => {
      showToast(message, 'error', duration);
    },
    warning: (message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    },
    info: (message: string, duration?: number) => {
      showToast(message, 'info', duration);
    },
  };
};
