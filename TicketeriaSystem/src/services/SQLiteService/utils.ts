/**
 * Gera um ID local único para entidades offline
 */
export const generateLocalId = (): string => {
  return `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
