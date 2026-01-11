@echo off
REM Script to start all microservices in the correct order
REM Each service will run in its own command window
REM IMPORTANT: Services must start in this sequence:
REM   1. Discovery (Eureka) - Other services register here
REM   2. Config Server - Microservices get config from here
REM   3. All Microservices (parallel ok)
REM   4. Gateway - Discovers all running services

setlocal enabledelayedexpansion

echo.
echo ========================================
echo SECURE E-COMMERCE MICROSERVICES PLATFORM
echo ========================================
echo.
echo Starting services in correct order...
echo Startup sequence: Discovery → Config → Services → Gateway
echo.

cd /d "c:\Users\ASUS\Desktop\AzureBackup\Projet-securite-systeme-distribue"

REM Kill any existing Java processes to avoid port conflicts
echo [STEP 0] Cleaning up existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak

echo.
echo [STEP 1/6] Starting EUREKA DISCOVERY SERVICE (port 8761)
echo   - Registry for all microservices
echo   - All other services will register here
echo   - Dashboard: http://localhost:8761
start "Discovery Service - Eureka" cmd /k "title Discovery Service (8761) && cd discovery-service && mvn spring-boot:run"
timeout /t 8 /nobreak

echo.
echo [STEP 2/6] Starting CONFIG SERVER (port 9999)
echo   - Configuration management
echo   - Microservices get config from here
echo   - Config files in: config-repo/
start "Config Server" cmd /k "title Config Server (9999) && cd config-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo [STEP 3/6] Starting PRODUCT SERVICE (port 8084)
echo   - Product catalog and inventory
echo   - Auto-registers with Eureka
echo   - API: http://localhost:8084/api/products
start "Product Service" cmd /k "title Product Service (8084) && cd product-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo [STEP 4/6] Starting ORDER SERVICE (port 8085)
echo   - Order and order item management
echo   - Auto-registers with Eureka
echo   - Calls product-service via Feign
echo   - API: http://localhost:8085/api/orders
start "Order Service" cmd /k "title Order Service (8085) && cd order-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo [STEP 5/6] Starting CUSTOMER SERVICE (port 8081)
echo   - Customer management
echo   - Auto-registers with Eureka
echo   - API: http://localhost:8081/api/customers
start "Customer Service" cmd /k "title Customer Service (8081) && cd customer-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo [STEP 6/6] Starting API GATEWAY (port 8989)
echo   - Single entry point for all services
echo   - Discovers services from Eureka
echo   - Routes requests to appropriate services
echo   - Main endpoint: http://localhost:8989
start "API Gateway" cmd /k "title API Gateway (8989) && cd gatewey-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo.
echo ========================================
echo ALL SERVICES STARTING...
echo ========================================
echo.
echo DIRECT SERVICE ACCESS:
echo   Product Service:    http://localhost:8084/api/products
echo   Order Service:      http://localhost:8085/api/orders
echo   Customer Service:   http://localhost:8081/api/customers
echo.
echo VIA API GATEWAY (RECOMMENDED FOR FRONTEND):
echo   Products:          http://localhost:8989/product-service/api/products
echo   Orders:            http://localhost:8989/order-service/api/orders
echo   Customers:         http://localhost:8989/customer-service/api/customers
echo.
echo MONITORING & MANAGEMENT:
echo   Eureka Dashboard:   http://localhost:8761
echo   Config Server:      http://localhost:9999
echo.
echo DATABASES (H2 Console):
echo   Product DB:        http://localhost:8084/h2-console (jdbc:h2:mem:products-db)
echo   Order DB:          http://localhost:8085/h2-console (jdbc:h2:mem:orders-db)
echo.
echo ARCHITECTURE:
echo   All services auto-register with Eureka (Discovery)
echo   All services pull config from Config Server
echo   Gateway auto-discovers all services and routes requests
echo   Services communicate via Feign clients
echo.
pause

