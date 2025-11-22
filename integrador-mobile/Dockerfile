# Dockerfile para React Native (Expo)
FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache bash git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install

# Copiar todo o código da aplicação
COPY . .

# Expor portas do Expo
EXPOSE 8081 19000 19001

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npx", "expo", "start", "--web"]
