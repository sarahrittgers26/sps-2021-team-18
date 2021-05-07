#
# Build stage
#
FROM maven:3.6.0-jdk-11-slim AS build
COPY src ../src
COPY pom.xml ../
RUN mvn -f ../pom.xml clean package

#
# Package stage
#
FROM openjdk:11-jre-slim
COPY --from=build /target/portfolio-1.jar /portfolio-1.jar
EXPOSE 8080 9000
CMD ["java","-jar","/portfolio-1.jar"]
