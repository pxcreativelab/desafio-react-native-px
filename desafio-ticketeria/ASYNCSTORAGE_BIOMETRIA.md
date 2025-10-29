# 💾 AsyncStorage e Biometria - Guia de Implementação

Este documento explica como implementar o cache local com AsyncStorage e login por biometria no sistema de Ticketeria.

## 📦 AsyncStorage - Cache Local

### 1. Criar Helper de Storage

Crie o arquivo `src/helpers/ticketStorage.ts`:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "./config";
import { Ticket, ListTicketsResponse } from "../services/TicketApi";

const STORAGE_KEYS = {
  TICKETS_LIST: `${Config.PREFIX_KEY_STORAGE}tickets-list`,
  TICKET_DETAILS: (id: string | number) => `${Config.PREFIX_KEY_STORAGE}ticket-${id}`,
  TICKETS_CACHE_TIMESTAMP: `${Config.PREFIX_KEY_STORAGE}tickets-cache-timestamp`,
  USER_PREFERENCES: `${Config.PREFIX_KEY_STORAGE}tickets-preferences`,
};

const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutos

// Salvar lista de tickets
export const saveTicketsToStorage = async (tickets: ListTicketsResponse): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TICKETS_LIST, JSON.stringify(tickets));
    await AsyncStorage.setItem(
      STORAGE_KEYS.TICKETS_CACHE_TIMESTAMP,
      Date.now().toString()
    );
    return true;
  } catch (error) {
    console.log("ERROR saveTicketsToStorage -> ", error);
    return false;
  }
};

// Carregar lista de tickets do cache
export const getTicketsFromStorage = async (): Promise<ListTicketsResponse | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS_LIST);
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS_CACHE_TIMESTAMP);
    
    if (!cachedData || !timestamp) {
      return null;
    }

    const cacheAge = Date.now() - parseInt(timestamp);
    
    // Se o cache expirou, retornar null para forçar nova busca
    if (cacheAge > CACHE_EXPIRATION_TIME) {
      return null;
    }

    return JSON.parse(cachedData);
  } catch (error) {
    console.log("ERROR getTicketsFromStorage -> ", error);
    return null;
  }
};

// Salvar detalhes de um ticket
export const saveTicketDetailsToStorage = async (
  ticketId: string | number,
  ticket: Ticket
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.TICKET_DETAILS(ticketId),
      JSON.stringify({ ...ticket, cachedAt: Date.now() })
    );
    return true;
  } catch (error) {
    console.log("ERROR saveTicketDetailsToStorage -> ", error);
    return false;
  }
};

// Carregar detalhes de um ticket do cache
export const getTicketDetailsFromStorage = async (
  ticketId: string | number
): Promise<Ticket | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.TICKET_DETAILS(ticketId));
    
    if (!cachedData) {
      return null;
    }

    const ticket = JSON.parse(cachedData);
    const cacheAge = Date.now() - (ticket.cachedAt || 0);
    
    // Cache de detalhes pode durar mais tempo (30 minutos)
    if (cacheAge > 30 * 60 * 1000) {
      return null;
    }

    return ticket;
  } catch (error) {
    console.log("ERROR getTicketDetailsFromStorage -> ", error);
    return null;
  }
};

// Salvar preferências do usuário
export interface UserPreferences {
  lastStatusFilter?: string;
  lastSort?: string;
  biometricLoginEnabled?: boolean;
}

export const saveUserPreferences = async (prefs: UserPreferences): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.log("ERROR saveUserPreferences -> ", error);
    return false;
  }
};

// Carregar preferências do usuário
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  try {
    const prefs = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return prefs ? JSON.parse(prefs) : null;
  } catch (error) {
    console.log("ERROR getUserPreferences -> ", error);
    return null;
  }
};

// Limpar cache de tickets
export const clearTicketCache = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TICKETS_LIST);
    await AsyncStorage.removeItem(STORAGE_KEYS.TICKETS_CACHE_TIMESTAMP);
    // Limpar detalhes individuais também
    const keys = await AsyncStorage.getAllKeys();
    const ticketDetailKeys = keys.filter(key => 
      key.includes(`${Config.PREFIX_KEY_STORAGE}ticket-`)
    );
    await AsyncStorage.multiRemove(ticketDetailKeys);
    return true;
  } catch (error) {
    console.log("ERROR clearTicketCache -> ", error);
    return false;
  }
};

// Verificar se cache está válido
export const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS_CACHE_TIMESTAMP);
    if (!timestamp) return false;
    
    const cacheAge = Date.now() - parseInt(timestamp);
    return cacheAge < CACHE_EXPIRATION_TIME;
  } catch (error) {
    return false;
  }
};
```

### 2. Usar o Cache na Lista de Tickets

Exemplo de uso em `src/pages/Ticketeria/index.tsx`:

```typescript
import { 
  getTicketsFromStorage, 
  saveTicketsToStorage,
  getUserPreferences,
  saveUserPreferences 
} from "../../helpers/ticketStorage";

const TicketeriaList = ({ navigation }: NativeStackScreenProps<any>) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    loadTickets();
    loadUserPreferences();
  }, []);

  // Carregar preferências salvas
  const loadUserPreferences = async () => {
    const prefs = await getUserPreferences();
    if (prefs?.lastStatusFilter) {
      setSelectedStatus(prefs.lastStatusFilter);
    }
  };

  const loadTickets = async (forceRefresh: boolean = false) => {
    // Primeiro, tentar carregar do cache
    if (!forceRefresh) {
      const cachedTickets = await getTicketsFromStorage();
      if (cachedTickets) {
        setTickets(cachedTickets.data);
        setIsOffline(false);
        setLoading(false);
      }
    }

    // Depois, buscar da API
    try {
      setLoading(true);
      const response = await fetchTickets(params);
      
      setTickets(response.data);
      await saveTicketsToStorage(response); // Salvar no cache
      setIsOffline(false);
      
      // Salvar preferências
      await saveUserPreferences({
        lastStatusFilter: selectedStatus,
        lastSort: currentSort,
      });
    } catch (error) {
      // Se falhar, usar cache se disponível
      const cachedTickets = await getTicketsFromStorage();
      if (cachedTickets) {
        setTickets(cachedTickets.data);
        setIsOffline(true); // Mostrar indicador offline
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resto do código...
};
```

### 3. Indicador Visual de Dados Offline

Adicione um badge ou aviso quando estiver usando dados do cache:

```typescript
import { View } from "react-native";
import Text from "../../components/_core/Text";
import Icon from "../../components/_core/Icon";

{isOffline && (
  <View style={{
    backgroundColor: "#FFCC00",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  }}>
    <Icon name="cloud-offline-outline" size={16} color="#000" />
    <Text size="small">Usando dados salvos offline</Text>
  </View>
)}
```

---

## 🔐 Login com Biometria

### 1. Criar Hook de Biometria

Crie o arquivo `src/hooks/useBiometric.ts`:

```typescript
import { useState, useEffect } from "react";
import ReactNativeBiometrics from "react-native-biometrics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../helpers/config";
import { encrypt, decrypt } from "../helpers/cryptoData";

const rnBiometrics = new ReactNativeBiometrics();

export interface BiometricInfo {
  available: boolean;
  biometryType: string | null;
  error?: string;
}

export interface UseBiometricReturn {
  biometricInfo: BiometricInfo;
  isAvailable: boolean;
  authenticate: () => Promise<boolean>;
  saveCredentials: (email: string, password: string) => Promise<boolean>;
  getSavedCredentials: () => Promise<{ email: string; password: string } | null>;
  clearSavedCredentials: () => Promise<boolean>;
}

export const useBiometric = (): UseBiometricReturn => {
  const [biometricInfo, setBiometricInfo] = useState<BiometricInfo>({
    available: false,
    biometryType: null,
  });

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const result = await rnBiometrics.isSensorAvailable();
      setBiometricInfo({
        available: result.available,
        biometryType: result.biometryType || null,
      });
    } catch (error) {
      setBiometricInfo({
        available: false,
        biometryType: null,
        error: "Erro ao verificar biometria",
      });
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      const promptMessage = 
        biometricInfo.biometryType === "FaceID" 
          ? "Confirme sua identidade" 
          : "Confirme sua digital";

      const result = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: "Cancelar",
      });

      return result.success;
    } catch (error) {
      console.log("ERROR authenticate biometric -> ", error);
      return false;
    }
  };

  const saveCredentials = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const encryptedEmail = encrypt(email, Config.BIOMETRIC_KEY);
      const encryptedPassword = encrypt(password, Config.BIOMETRIC_KEY);

      const credentials = {
        email: encryptedEmail,
        password: encryptedPassword,
        savedAt: Date.now(),
      };

      await AsyncStorage.setItem(
        Config.BIOMETRIC_STORAGE_NAME,
        JSON.stringify(credentials)
      );
      return true;
    } catch (error) {
      console.log("ERROR saveCredentials -> ", error);
      return false;
    }
  };

  const getSavedCredentials = async (): Promise<{ email: string; password: string } | null> => {
    try {
      const stored = await AsyncStorage.getItem(Config.BIOMETRIC_STORAGE_NAME);
      
      if (!stored) {
        return null;
      }

      const credentials = JSON.parse(stored);
      
      const email = decrypt(credentials.email, Config.BIOMETRIC_KEY);
      const password = decrypt(credentials.password, Config.BIOMETRIC_KEY);

      return { email, password };
    } catch (error) {
      console.log("ERROR getSavedCredentials -> ", error);
      return null;
    }
  };

  const clearSavedCredentials = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(Config.BIOMETRIC_STORAGE_NAME);
      return true;
    } catch (error) {
      console.log("ERROR clearSavedCredentials -> ", error);
      return false;
    }
  };

  return {
    biometricInfo,
    isAvailable: biometricInfo.available,
    authenticate,
    saveCredentials,
    getSavedCredentials,
    clearSavedCredentials,
  };
};
```

### 2. Usar Biometria na Tela de Login/Auth

Exemplo de uso em uma tela de autenticação:

```typescript
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useBiometric } from "../../hooks/useBiometric";
import { useAuth } from "../../contexts/auth";
import Button from "../../components/_core/Button";
import Switch from "react-native-paper";

const AuthScreen = () => {
  const { 
    isAvailable, 
    authenticate, 
    getSavedCredentials,
    saveCredentials 
  } = useBiometric();
  const { handleSignIn } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkSavedCredentials();
  }, []);

  const checkSavedCredentials = async () => {
    const saved = await getSavedCredentials();
    if (saved) {
      setBiometricEnabled(true);
    }
  };

  const handleBiometricLogin = async () => {
    if (!isAvailable) {
      Alert.alert("Biometria não disponível", "Seu dispositivo não possui sensor biométrico.");
      return;
    }

    const authenticated = await authenticate();
    
    if (!authenticated) {
      Alert.alert("Autenticação cancelada", "Login por biometria foi cancelado.");
      return;
    }

    // Buscar credenciais salvas
    const credentials = await getSavedCredentials();
    
    if (!credentials) {
      Alert.alert("Erro", "Nenhuma credencial salva encontrada.");
      return;
    }

    // Fazer login com credenciais descriptografadas
    try {
      await handleSignIn({
        email: credentials.email,
        password: credentials.password,
        origin: "biometric",
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer login. Tente novamente.");
    }
  };

  const handleNormalLogin = async () => {
    try {
      const result = await handleSignIn({
        email,
        password,
        origin: "email",
      });

      if (result.success && biometricEnabled) {
        // Salvar credenciais criptografadas
        await saveCredentials(email, password);
      }
    } catch (error) {
      Alert.alert("Erro", "Credenciais inválidas.");
    }
  };

  return (
    <View>
      {/* Campos de email e senha */}
      
      {/* Toggle para habilitar biometria */}
      {isAvailable && (
        <View>
          <Text>Login rápido com biometria</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
          />
        </View>
      )}

      {/* Botão de login normal */}
      <Button label="Entrar" onPress={handleNormalLogin} />

      {/* Botão de login por biometria */}
      {isAvailable && biometricEnabled && (
        <Button 
          label="Entrar com Biometria" 
          onPress={handleBiometricLogin}
          outline
        />
      )}
    </View>
  );
};
```

### 3. Integração com Contexto de Auth Existente

Se quiser integrar diretamente com o contexto de auth existente:

```typescript
// Em algum lugar do código, quando o usuário faz login normal:
const onNormalLogin = async (email: string, password: string) => {
  const result = await handleSignIn({ email, password, origin: "email" });
  
  if (result.success && biometricEnabled) {
    // O contexto já salva automaticamente, mas você pode reforçar:
    await saveCredentials(email, password);
  }
};
```

---

## 📝 Notas Importantes

1. **Segurança:**
   - Sempre criptografe credenciais antes de salvar
   - Use a mesma chave de criptografia do projeto (`Config.BIOMETRIC_KEY`)
   - Não salve senhas em texto plano

2. **Performance:**
   - Cache não deve substituir dados frescos, apenas complementar
   - Implemente invalidação de cache apropriada
   - Limite o tamanho do cache (não salvar todos os tickets se houver muitos)

3. **UX:**
   - Sempre mostre quando está usando dados offline
   - Dê feedback visual durante autenticação biométrica
   - Trate erros de biometria graciosamente (usuário cancelou, falha, etc.)

4. **Compatibilidade:**
   - Verifique disponibilidade de biometria antes de usar
   - Alguns dispositivos podem não ter sensor biométrico
   - Teste em diferentes dispositivos

---

## ✅ Checklist de Implementação

- [ ] Helper de storage criado (`ticketStorage.ts`)
- [ ] Cache de lista funcionando
- [ ] Cache de detalhes funcionando
- [ ] Preferências do usuário salvas
- [ ] Hook de biometria criado
- [ ] Login por biometria funcionando
- [ ] Integração com contexto de auth
- [ ] Tratamento de erros implementado
- [ ] Indicadores visuais de offline/online
- [ ] Testado em diferentes cenários

---

## 💾 SQLite para Modo Offline Robusto

Para um modo offline mais robusto, consulte também `SQLITE_OFFLINE.md` que explica como usar SQLite para:
- Armazenamento persistente de tickets
- Fila de ações pendentes
- Sincronização automática quando voltar online

**AsyncStorage** é ideal para cache rápido e preferências.
**SQLite** é ideal para dados estruturados e operações offline complexas.

---

**Boa sorte com a implementação! 🚀**

