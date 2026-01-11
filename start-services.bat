@echo off
REM Script to start all microservices in order
REM Each service will run in its own command window

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Starting Secure E-Commerce Platform
echo ========================================
echo.

cd /d "c:\Users\ASUS\Desktop\AzureBackup\Projet-securite-systeme-distribue"

REM Kill any existing Java processes on the microservice ports
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak

echo [1/6] Starting discovery-service (port 8761)...
start "Discovery Service" cmd /k "cd discovery-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo [2/6] Starting config-service (port 9999)...
start "Config Service" cmd /k "cd config-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo [3/6] Starting product-service (port 8084)...
start "Product Service" cmd /k "cd product-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo [4/6] Starting order-service (port 8085)...
start "Order Service" cmd /k "cd order-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo [5/6] Starting customer-service (port 8081)...
start "Customer Service" cmd /k "cd customer-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo [6/6] Starting gateway-service (port 8989)...
start "Gateway Service" cmd /k "cd gatewey-service && mvn spring-boot:run"
timeout /t 10 /nobreak

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Service URLs:
echo  - Discovery: http://localhost:8761
echo  - Config:    http://localhost:9999
echo  - Product:   http://localhost:8084/api/products
echo  - Order:     http://localhost:8085/api/orders
echo  - Customer:  http://localhost:8081/api/customers
echo  - Gateway:   http://localhost:8989
echo.
echo Via Gateway (use this for frontend):
echo  - Product:   http://localhost:8989/product-service/api/products
echo  - Order:     http://localhost:8989/order-service/api/orders
echo  - Customer:  http://localhost:8989/customer-service/api/customers
echo.
