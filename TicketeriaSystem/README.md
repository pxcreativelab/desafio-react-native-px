yarn install
yarn start --reset-cache
npx react-native run-android
yarn start --reset-cache
npx react-native run-ios
yarn start --reset-cache
yarn test
# TicketeriaSystem — Guia rápido de configuração


Versão enxuta para iniciar o projeto rapidamente.

1) Pré-requisitos
- Node.js 22 (LTS/Recommended)
- Yarn or npm
- Android Studio (Android) / Xcode (iOS)

2) Instalar dependências

Com Yarn:

```pwsh
yarn install
```

Com npm:

```pwsh
npm install
```

3) Link nativo / iOS pods (se usar iOS)

```pwsh
cd ios
pod install
cd ..
```

4) Rodar o app

Android (yarn):

```pwsh
yarn start --reset-cache
npx react-native run-android
```

Android (npm):

```pwsh
npx react-native start --reset-cache
npx react-native run-android
```

iOS (macOS, yarn):

```bash
yarn start --reset-cache
npx react-native run-ios
```

iOS (macOS, npm):

```bash
npx react-native start --reset-cache
npx react-native run-ios
```

5) Exportar lista de tickets (rápido)
- Na tela de Tickets há dois botões: `Exportar PDF` e `Exportar CSV`.
- `Exportar CSV` cria um arquivo `.csv` no dispositivo e abre o menu de compartilhamento.

6) Observações rápidas
- Se usar Expo (managed), as bibliotecas nativas exigem workflow bare ou EAS.
- Android pode precisar de permissão de escrita para salvar no `Downloads`.

7) Configurar a API (rápido)
- A URL base da API fica em `src/services/Api.ts` (variável `API_BASE_URL`). Por padrão o projeto já usa um switch `__DEV__` para apontar para uma URL local em desenvolvimento.
- Exemplos comuns:
	- iOS Simulator: `http://localhost:3000`
	- Android Emulator (AVD): `http://10.0.2.2:3000`
	- Android Genymotion: `http://10.0.3.2:3000`
	- Dispositivo físico: `http://<SEU_IP_LOCAL>:3000` (use o IP da sua máquina na mesma rede)
- Para mudar a URL, edite `API_BASE_URL` em `src/services/Api.ts` ou integre uma solução de variáveis de ambiente (ex.: `react-native-config`).
- Autenticação: existe um interceptor em `Api.ts` onde você pode descomentar/adicionar o token retornado do storage (ex.: `AsyncStorage`) e inserir no header `Authorization: Bearer <token>`.

Problemas? Cole aqui o log do Metro ou do build e eu te ajudo.

---

Se quiser que eu adicione um pedido automático de permissão no Android antes da exportação, eu faço isso rápido.
