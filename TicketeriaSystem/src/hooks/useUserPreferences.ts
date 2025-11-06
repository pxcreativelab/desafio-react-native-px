import AsyncStorageCache, { UserPreferences } from '@/helpers/AsyncStorageCache';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar preferências do usuário (filtros, ordenação, etc)
 * Salva no AsyncStorage
 * 
 * @example
 * const { preferences, updatePreferences } = useUserPreferences();
 * 
 * // Salvar filtro preferido
 * updatePreferences({ defaultFilter: 'open' });
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultFilter: undefined,
    defaultSort: undefined,
    pageSize: 20,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar preferências ao montar
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const saved = await AsyncStorageCache.loadUserPreferences();
        if (saved) {
          setPreferences(saved);
          console.log('[useUserPreferences] Preferences loaded:', saved);
        }
      } catch (error) {
        console.error('[useUserPreferences] Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Atualizar preferências
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      const newPreferences = { ...preferences, ...updates };
      setPreferences(newPreferences);
      await AsyncStorageCache.saveUserPreferences(newPreferences);
      console.log('[useUserPreferences] Preferences updated:', newPreferences);
    } catch (error) {
      console.error('[useUserPreferences] Error updating preferences:', error);
    }
  }, [preferences]);

  return {
    preferences,
    updatePreferences,
    isLoading,
  };
};
