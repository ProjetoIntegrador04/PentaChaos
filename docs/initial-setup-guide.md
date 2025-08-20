# 🚀 Guia de Configuração do Ambiente de Desenvolvimento - SGE

Este documento serve como um guia abrangente para configurar o ambiente de desenvolvimento local para o projeto SGE (Sistema de Gestão Digital de Estágios). Siga os passos abaixo para garantir que seu ambiente esteja pronto para o desenvolvimento do Backend (Spring Boot/Java), Frontend Web (Next.js/TypeScript) e Aplicativo Mobile (Expo/React Native).

## 🎯 Objetivo

O objetivo é estabelecer um ambiente de desenvolvimento padronizado e funcional para todos os colaboradores, minimizando problemas de compatibilidade e otimizando o onboarding de novos membros da equipe.

## 🛠️ Ferramentas Essenciais Comuns (Para Todos os Desenvolvedores)

Instale e configure as seguintes ferramentas que são cruciais para qualquer função no projeto:

### 1. Sistema Operacional
*   **Windows:** Windows 10 (versão 2004 ou superior) ou Windows 11.
*   **macOS:** macOS Big Sur (11) ou superior.
*   **Linux:** Ubuntu 20.04 LTS ou distribuição similar.

### 2. Git (Controle de Versão)
Essencial para clonar repositórios e gerenciar o código-fonte.
*   **Instalação:**
    *   **Windows:** Baixe e execute o instalador em [git-scm.com](https://git-scm.com/download/win).
    *   **macOS:** `brew install git` (com Homebrew) ou instale o Xcode Command Line Tools (`xcode-select --install`).
    *   **Linux:** `sudo apt-get install git` (Debian/Ubuntu) ou `sudo yum install git` (Fedora/CentOS).
*   **Configuração Inicial:**
    ```bash
    git config --global user.name "Seu Nome Completo"
    git config --global user.email "seu.email@exemplo.com"
    ```
*   **Verificação:** `git --version`

### 3. Node.js e Gerenciadores de Pacotes (npm/yarn)
Necessário para o desenvolvimento Frontend (Web e Mobile) e para ferramentas de build.
*   **Recomendado (NVM ou Volta):** Utilize um gerenciador de versões para Node.js para facilitar a troca entre versões se necessário.
    *   **NVM (Node Version Manager):** [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) ou [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows).
    *   **Volta:** [volta.sh](https://volta.sh/) (Multi-plataforma).
*   **Instalação da Versão LTS (via NVM/Volta):**
    ```bash
    nvm install --lts # Ou volta install node@lts
    nvm use --lts     # Ou volta use node@lts
    ```
*   **Verificação:** `node -v` e `npm -v`
*   **Instalar Yarn (Opcional, mas recomendado para consistência):** `npm install -g yarn`
*   **Verificação:** `yarn -v`

### 4. Docker Desktop
Indispensável para rodar bancos de dados e outros serviços conteinerizados localmente.
*   **Instalação:** Baixe e instale de [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
*   **Verificação:** Abra o Docker Desktop e certifique-se de que ele esteja executando. Execute `docker run hello-world` no terminal para um teste rápido.

### 5. Visual Studio Code (VS Code)
A IDE principal para o desenvolvimento do projeto.
*   **Instalação:** Baixe e instale de [code.visualstudio.com](https://code.visualstudio.com/).
*   **Extensões Recomendadas (Instale-as no VS Code):**
    *   **Java Extension Pack:** Para desenvolvimento Backend com Spring Boot.
    *   **ESLint:** Para padronização de código JavaScript/TypeScript.
    *   **Prettier:** Para formatação automática de código.
    *   **React Native Tools:** Para depuração e assistência no desenvolvimento mobile.
    *   **Docker:** Para gerenciar contêineres e imagens Docker diretamente da IDE.
    *   **GitLens:** Melhora a experiência com Git dentro do VS Code.
    *   **Path Intellisense:** Ajuda com o auto-complete de caminhos de arquivo.
*   **`Settings Sync` (Recomendado):** Ative a sincronização de configurações do VS Code. Isso garante que suas configurações (extensões, temas, atalhos) sejam salvas na nuvem e possam ser restauradas em qualquer máquina.
    *   Vá em `Settings` (Ctrl+, ou Cmd+,) e procure por `Settings Sync`. Faça login com sua conta GitHub ou Microsoft.

### 6. Configurações de Padronização (ESLint, Prettier, EditorConfig)
O projeto já virá com arquivos de configuração (`.eslintrc.js`, `.prettierrc.js`, `.editorconfig`). Certifique-se de que suas extensões do VS Code estejam configuradas para utilizá-los automaticamente.

## 💻 Configuração do Ambiente Backend (Java/Spring Boot)

### 1. Java Development Kit (JDK)
O JDK é necessário para compilar e executar aplicações Java.
*   **Instalação:**
    *   Recomendado: Baixe e instale o **OpenJDK 17 LTS** de uma fonte confiável como [Adoptium Temurin](https://adoptium.net/temurin/releases/).
*   **Configuração da Variável de Ambiente `JAVA_HOME`:**
    *   **Windows:** Adicione uma variável de sistema `JAVA_HOME` apontando para o diretório de instalação do JDK (ex: `C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-HotSpot`). Adicione `%JAVA_HOME%\bin` ao `Path`.
    *   **macOS/Linux:** Adicione ao seu `~/.bashrc`, `~/.zshrc` ou similar:
        ```bash
        export JAVA_HOME="/path/to/your/jdk-17" # Substitua pelo seu caminho real
        export PATH=$PATH:$JAVA_HOME/bin
        ```
        Lembre-se de rodar `source ~/.bashrc` ou similar.
*   **Verificação:** `java -version` e `javac -version`

### 2. Maven
Gerenciador de dependências e ferramenta de build para projetos Java.
*   **Instalação:**
    *   **Windows:** Baixe de [maven.apache.org/download.cgi](https://maven.apache.org/download.cgi), extraia e adicione a pasta `bin` ao seu `Path`.
    *   **macOS:** `brew install maven` (com Homebrew).
    *   **Linux:** `sudo apt-get install maven` (Debian/Ubuntu).
*   **Verificação:** `mvn -v`

### 3. Bancos de Dados Locais (Via Docker)
Usaremos Docker para rodar instâncias de PostgreSQL e MongoDB para desenvolvimento.
*   **Crie uma rede Docker (se não existir):**
    ```bash
    docker network create sge_network || true
    ```
*   **PostgreSQL:**
    ```bash
    docker run --name sge-postgres -e POSTGRES_DB=sge_db -e POSTGRES_USER=sge_user -e POSTGRES_PASSWORD=sge_password -p 5432:5432 --network sge_network -d postgres:14
    ```
*   **MongoDB (Opcional, se o projeto usar MongoDB para alguma parte):**
    ```bash
    docker run --name sge-mongodb -e MONGO_INITDB_ROOT_USERNAME=sge_user -e MONGO_INITDB_ROOT_PASSWORD=sge_password -p 27017:27017 --network sge_network -d mongo:latest
    ```
*   **Verificação:** `docker ps` deve mostrar os contêineres `sge-postgres` e `sge-mongodb` rodando.

### 4. Clonar e Rodar o Projeto Backend
*   **Clonar o Repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO_BACKEND]
    cd [pasta_do_backend]
    ```
*   **Abrir no VS Code:** `code .`
*   **Executar o Backend:**
    *   Via VS Code: Use a opção "Run" (geralmente um ícone de play no painel esquerdo ou na barra superior).
    *   Via Linha de Comando: `mvn spring-boot:run`
*   **Teste Básico:**
    *   Acesse `http://localhost:8080/actuator/health` (se Spring Boot Actuator estiver configurado) no seu navegador ou via Postman/Insomnia. Você deve receber um status `UP`.

## 🌐 Configuração do Ambiente Frontend Web (Next.js/TypeScript)

### 1. Clonar e Rodar o Projeto Frontend Web
*   **Clonar o Repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO_FRONTEND_WEB]
    cd [pasta_do_frontend_web]
    ```
*   **Abrir no VS Code:** `code .`
*   **Instalar Dependências:**
    ```bash
    npm install # ou yarn install
    ```
*   **Executar a Aplicação:**
    ```bash
    npm run dev # ou yarn dev
    ```
*   **Teste Básico:**
    *   Acesse `http://localhost:3000` (ou a porta indicada no terminal) no seu navegador. A página inicial do aplicativo deve carregar.

## 📱 Configuração do Ambiente Mobile (Expo/React Native)

### 1. Expo CLI
Ferramenta de linha de comando para desenvolver e gerenciar projetos Expo.
*   **Instalação Global:**
    ```bash
    npm install -g expo-cli
    ```
*   **Verificação:** `expo --version`

### 2. Emulador Android (Via Android Studio)
*   **Instalação do Android Studio:** Baixe e instale de [developer.android.com/studio](https://developer.android.com/studio).
*   **Configuração do SDK e AVD:**
    *   No Android Studio, vá em `Tools > SDK Manager` e certifique-se de que a versão mais recente do "Android SDK Platform" e "Android SDK Build-Tools" estejam instaladas.
    *   Vá em `Tools > AVD Manager` e crie um novo "Virtual Device" (Emulador). Recomendamos um Pixel 6 com Android 13 ou superior.

### 3. Simulador iOS (Via Xcode - Apenas macOS)
*   **Instalação do Xcode:** Instale o Xcode pela App Store (ou baixe de [developer.apple.com/download/applications/](https://developer.apple.com/download/applications/)). O Xcode já inclui o simulador iOS.
*   **Instalar Command Line Tools:** Após instalar o Xcode, abra-o uma vez e, em seguida, execute no terminal:
    ```bash
    xcode-select --install
    ```

### 4. Clonar e Rodar o Projeto Mobile
*   **Clonar o Repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO_MOBILE]
    cd [pasta_do_mobile]
    ```
*   **Abrir no VS Code:** `code .`
*   **Instalar Dependências:**
    ```bash
    npm install # ou yarn install
    ```
*   **Executar a Aplicação:**
    ```bash
    expo start
    ```
    *   Isso abrirá uma janela no navegador com o Metro Bundler.
    *   **Para Android:** Clique em "Run on Android device/emulator" ou digite `a` no terminal.
    *   **Para iOS:** Clique em "Run on iOS simulator" (se estiver no macOS) ou digite `i` no terminal.
    *   **Para Testar no Celular Físico:** Baixe o aplicativo "Expo Go" na App Store (iOS) ou Google Play (Android) e escaneie o QR Code exibido no terminal ou no Metro Bundler.
*   **Teste Básico:** A tela inicial do aplicativo deve carregar no emulador/simulador ou no seu celular.

## ✅ Verificação Final

Após configurar todos os ambientes relevantes para sua função (ou todos, se você for um desenvolvedor full-stack), siga estes passos para uma verificação completa:

1.  **Backend Operacional:** Certifique-se de que o servidor backend esteja rodando sem erros.
2.  **Frontend Web Conectado:** Inicie a aplicação web e verifique se ela consegue se comunicar com o backend (ex: se houver uma tela de login, tente logar com credenciais de teste).
3.  **Aplicativo Mobile Conectado:** Inicie o aplicativo mobile no emulador/simulador/dispositivo físico e verifique se ele também consegue se comunicar com o backend.
4.  **Testes de Integração Simples:** Tente executar um fluxo de ponta a ponta que envolva todas as camadas (ex: cadastrar um usuário via web, e depois logar com ele no mobile, ou registrar um ponto no mobile e visualizar o histórico na web).

Se todos os passos acima foram concluídos com sucesso, seu ambiente de desenvolvimento está pronto!

---

**Dica:** Em caso de dúvidas ou problemas durante a configuração, consulte a documentação oficial das ferramentas ou procure a equipe de DevOps/Líder Técnico.

### [**> Retornar à Página Inicial.**](/README.md)