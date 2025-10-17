# syntax=docker/dockerfile:1.4
# ------------------------------
# ETAPA 1 - BUILD DA APLICAÇÃO
# ------------------------------
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copia o arquivo pom.xml e baixa as dependências para aproveitar o cache
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline

# Copia o código fonte e realiza o build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests

# ------------------------------
# ETAPA 2 - IMAGEM FINAL
# ------------------------------
FROM eclipse-temurin:21-jre-slim

# Cria um usuário não-root para segurança
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring

WORKDIR /app

# Copia apenas o artefato gerado
COPY --from=builder /app/target/*.jar app.jar

# Define variáveis opcionais para configuração de memória ou logs
ENV JAVA_OPTS=""

EXPOSE 8080

# Comando de execução (permite passar JAVA_OPTS se quiser)
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
