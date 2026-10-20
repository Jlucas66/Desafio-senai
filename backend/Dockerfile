# Etapa 1: compila a API com Maven (os testes rodam fora do Docker, com mvn test)
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

# Etapa 2: imagem final só com o Java e o jar
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/passe-api-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
