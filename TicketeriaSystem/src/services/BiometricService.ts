import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export interface BiometricAvailability {
  available: boolean;
  biometryType?: string;
  error?: string;
}

/**
 * Verifica se biometria está disponível no dispositivo
 */
export const isBiometricAvailable = async (): Promise<BiometricAvailability> => {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      return {
        available: false,
        error: 'Biometria não disponível neste dispositivo',
      };
    }

    return {
      available: true,
      biometryType,
    };
  } catch (error) {
    console.error('[BiometricService] Error checking availability:', error);
    return {
      available: false,
      error: 'Erro ao verificar disponibilidade da biometria',
    };
  }
};

/**
 * Autentica usando biometria
 */
export const authenticateWithBiometric = async (
  promptMessage: string = 'Confirme sua identidade'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { available } = await isBiometricAvailable();

    if (!available) {
      return {
        success: false,
        error: 'Biometria não disponível',
      };
    }

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: 'Cancelar',
    });

    return { success };
  } catch (error: any) {
    console.error('[BiometricService] Error authenticating:', error);
    return {
      success: false,
      error: error.message || 'Falha na autenticação biométrica',
    };
  }
};

/**
 * Retorna o tipo de biometria disponível como string legível
 */
export const getBiometryTypeName = (biometryType?: string): string => {
  switch (biometryType) {
    case BiometryTypes.FaceID:
      return 'Face ID';
    case BiometryTypes.TouchID:
      return 'Touch ID';
    case BiometryTypes.Biometrics:
      return 'Biometria';
    default:
      return 'Biometria';
  }
};

export default {
  isBiometricAvailable,
  authenticateWithBiometric,
  getBiometryTypeName,
};
