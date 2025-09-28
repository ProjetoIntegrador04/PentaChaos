
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copia primeiro o pom.xml para otimizar o cache das dependências do Maven
COPY pom.xml .

# Copia o código-fonte
COPY src ./src

RUN --mount=type=cache,target=/root/.m2 mvn clean package -Dmaven.test.skip=true


FROM eclipse-temurin:21-jre-alpine

# Cria um usuário não-root para rodar a aplicação por segurança
RUN addgroup --system spring && adduser --system --ingroup spring spring
USER spring

WORKDIR /app

# Copia APENAS o arquivo .jar final que foi gerado no estágio 'builder'
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Comando final para executar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]