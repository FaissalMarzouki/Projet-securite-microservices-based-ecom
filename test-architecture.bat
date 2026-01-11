@echo off
REM Test script to verify the complete microservices architecture
REM Tests discovery, configuration, gateway routing, and inter-service communication

setlocal enabledelayedexpansion

echo.
echo ========================================
echo MICROSERVICES ARCHITECTURE TEST SUITE
echo ========================================
echo.
echo This script will test:
echo  1. Eureka Discovery Service
echo  2. Config Server
echo  3. Service Registration
echo  4. Gateway Routing
echo  5. Inter-Service Communication
echo.
echo PREREQUISITES: All services must be running before starting tests
echo.
pause

set "EUREKA_URL=http://localhost:8761"
set "CONFIG_URL=http://localhost:9999"
set "PRODUCT_URL=http://localhost:8084"
set "ORDER_URL=http://localhost:8085"
set "CUSTOMER_URL=http://localhost:8081"
set "GATEWAY_URL=http://localhost:8989"

echo.
echo ====== TEST 1: EUREKA DISCOVERY SERVICE ======
echo [TEST 1.1] Check Eureka server status...
curl -s -o nul -w "Status: %%{http_code}\n" "%EUREKA_URL%/"
if !errorlevel! equ 0 (
    echo ✓ Eureka is running
) else (
    echo ✗ Eureka is NOT running
    echo ERROR: Start discovery-service first!
    pause
    exit /b 1
)

echo.
echo [TEST 1.2] List all registered services in Eureka...
echo Fetching services from Eureka...
curl -s "%EUREKA_URL%/eureka/apps" | findstr /R "name" | findstr /R "<name>" 
echo.

echo.
echo ====== TEST 2: CONFIG SERVER ======
echo [TEST 2.1] Check Config Server status...
curl -s -o nul -w "Status: %%{http_code}\n" "%CONFIG_URL%/"
if !errorlevel! equ 0 (
    echo ✓ Config Server is running
) else (
    echo ✗ Config Server is NOT running
    echo ERROR: Start config-service first!
    pause
    exit /b 1
)

echo.
echo [TEST 2.2] Fetch product-service configuration...
echo URL: %CONFIG_URL%/product-service/default
curl -s "%CONFIG_URL%/product-service/default" | findstr /R "\"name\"" | findstr /R "product-service"
echo.

echo.
echo ====== TEST 3: SERVICE REGISTRATION ======
echo [TEST 3.1] Check PRODUCT-SERVICE registration...
echo URL: %EUREKA_URL%/eureka/apps/PRODUCT-SERVICE
for /f "delims=" %%i in ('curl -s "%EUREKA_URL%/eureka/apps/PRODUCT-SERVICE" ^| findstr /R "status"') do (
    if "%%i"=="UP" (
        echo ✓ PRODUCT-SERVICE is UP
    ) else (
        echo Status: %%i
    )
)
echo.

echo [TEST 3.2] Check ORDER-SERVICE registration...
echo URL: %EUREKA_URL%/eureka/apps/ORDER-SERVICE
for /f "delims=" %%i in ('curl -s "%EUREKA_URL%/eureka/apps/ORDER-SERVICE" ^| findstr /R "status"') do (
    if "%%i"=="UP" (
        echo ✓ ORDER-SERVICE is UP
    ) else (
        echo Status: %%i
    )
)
echo.

echo [TEST 3.3] Check CUSTOMER-SERVICE registration...
echo URL: %EUREKA_URL%/eureka/apps/CUSTOMER-SERVICE
for /f "delims=" %%i in ('curl -s "%EUREKA_URL%/eureka/apps/CUSTOMER-SERVICE" ^| findstr /R "status"') do (
    if "%%i"=="UP" (
        echo ✓ CUSTOMER-SERVICE is UP
    ) else (
        echo Status: %%i
    )
)
echo.

echo.
echo ====== TEST 4: DIRECT SERVICE ACCESS ======
echo [TEST 4.1] Test PRODUCT SERVICE directly (port 8084)...
echo URL: %PRODUCT_URL%/api/products
curl -s -o nul -w "Status: %%{http_code}\n" "%PRODUCT_URL%/api/products"
echo.

echo [TEST 4.2] Test ORDER SERVICE directly (port 8085)...
echo URL: %ORDER_URL%/api/orders
curl -s -o nul -w "Status: %%{http_code}\n" "%ORDER_URL%/api/orders"
echo.

echo [TEST 4.3] Test CUSTOMER SERVICE directly (port 8081)...
echo URL: %CUSTOMER_URL%/api/customers
curl -s -o nul -w "Status: %%{http_code}\n" "%CUSTOMER_URL%/api/customers"
echo.

echo.
echo ====== TEST 5: GATEWAY ROUTING ======
echo [TEST 5.1] Gateway access to Product Service...
echo URL: %GATEWAY_URL%/product-service/api/products
curl -s -o nul -w "Status: %%{http_code}\n" "%GATEWAY_URL%/product-service/api/products"
echo.

echo [TEST 5.2] Gateway access to Order Service...
echo URL: %GATEWAY_URL%/order-service/api/orders
curl -s -o nul -w "Status: %%{http_code}\n" "%GATEWAY_URL%/order-service/api/orders"
echo.

echo [TEST 5.3] Gateway access to Customer Service...
echo URL: %GATEWAY_URL%/customer-service/api/customers
curl -s -o nul -w "Status: %%{http_code}\n" "%GATEWAY_URL%/customer-service/api/customers"
echo.

echo.
echo ====== TEST 6: INTER-SERVICE COMMUNICATION ======
echo [TEST 6.1] Order Service calls Product Service (Feign)...
echo URL: %ORDER_URL%/api/orders
echo Creating an order (should fetch product data via Feign)...
curl -s -X POST "%ORDER_URL%/api/orders" ^
  -H "Content-Type: application/json" ^
  -d "{\"clientId\":\"C001\",\"status\":\"PENDING\"}" ^
  -w "\nStatus: %%{http_code}\n"
echo.

echo.
echo ====== TEST 7: HEALTH CHECKS ======
echo [TEST 7.1] Product Service health...
curl -s "%PRODUCT_URL%/actuator/health" | findstr /R "status"
echo.

echo [TEST 7.2] Order Service health...
curl -s "%ORDER_URL%/actuator/health" | findstr /R "status"
echo.

echo.
echo ========================================
echo TEST RESULTS SUMMARY
echo ========================================
echo.
echo If all tests passed:
echo  ✓ Discovery Service is working (Eureka)
echo  ✓ Config Server is running
echo  ✓ All services are registered with Eureka
echo  ✓ Services can be accessed directly
echo  ✓ Gateway routes services correctly
echo  ✓ Inter-service communication works (Feign)
echo.
echo If any test failed:
echo  1. Check service logs in their command windows
echo  2. Verify ports are not already in use
echo  3. Check that all services have sufficient startup time
echo.
echo NEXT STEPS:
echo  1. Use Gateway URL for frontend: http://localhost:8989
echo  2. Monitor Eureka dashboard: http://localhost:8761
echo  3. Check logs in service windows for errors
echo.
pause
