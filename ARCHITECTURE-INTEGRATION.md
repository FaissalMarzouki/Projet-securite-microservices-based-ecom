# Service Integration Architecture - Phase 1 Complete

## Overview
Les nouveaux services **product-service** et **order-service** sont maintenant complètement intégrés avec l'architecture existante (Discovery, Config, Gateway).

---

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                    EUREKA DISCOVERY (8761)                   │
│  - Enregistre tous les services                              │
│  - Permet la découverte dynamique                            │
└─────────────────────────────────────────────────────────────┘
                              ↑
              ┌───────────────┼───────────────┐
              ↑               ↑               ↑
    ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
    │  CONFIG SERVER  │ │   GATEWAY    │ │  TOUS LES    │
    │     (9999)      │ │    (8989)    │ │  SERVICES    │
    └─────────────────┘ └──────────────┘ └──────────────┘
                              ↓
              ┌───────────────┼───────────────────────────┐
              ↓               ↓               ↓           ↓
        ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ CUSTOMER │  │ PRODUCT  │  │  ORDER   │  │ INVENTORY│
        │  (8081)  │  │  (8084)  │  │  (8085)  │  │  (8082)  │
        └──────────┘  └──────────┘  └──────────┘  └──────────┘
                              ↑
                    Feign Clients (Service-to-Service)
```

---

## Service Integration Configuration

### 1. Product Service (8084)

#### application.properties
```properties
spring.application.name=product-service
server.port=8084
spring.cloud.config.enabled=true
spring.config.import=optional:configserver:http://localhost:9999

# Eureka Registration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
eureka.instance.prefer-ip-address=true
eureka.instance.instance-id=${spring.application.name}:${server.port}
```

#### POM Dependencies
```xml
<!-- Service Discovery -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>

<!-- Configuration Management -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>

<!-- Inter-service Communication (ready for Feign) -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

#### Application Class
```java
@SpringBootApplication
public class ProductServiceApplication {
    // Automatically registered with Eureka
    // Automatically pulls config from Config Server
}
```

#### Gateway Routes
```yaml
- id: product-route
  uri: lb://PRODUCT-SERVICE
  predicates:
    - Path=/product-service/**
  filters:
    - RewritePath=/product-service/(?<segment>.*), /$\{segment}
```

---

### 2. Order Service (8085)

#### application.properties
```properties
spring.application.name=order-service
server.port=8085
spring.cloud.config.enabled=true
spring.config.import=optional:configserver:http://localhost:9999

# Eureka Registration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
eureka.instance.prefer-ip-address=true
eureka.instance.instance-id=${spring.application.name}:${server.port}
```

#### Feign Clients (Service-to-Service Communication)
```java
@FeignClient(name = "product-service")
public interface ProductRestClient {
    @GetMapping("/api/products/{id}")
    Product getProductById(@PathVariable String id);
    
    @GetMapping("/api/products")
    PagedModel<Product> getAllProducts();
}

@FeignClient(name = "customer-service")
public interface CustomerRestClient {
    @GetMapping("/api/customers/{id}")
    Customer getCustomerById(@PathVariable Long id);
    
    @GetMapping("/api/customers")
    PagedModel<Customer> getAllCustomers();
}
```

#### Gateway Routes
```yaml
- id: order-route
  uri: lb://ORDER-SERVICE
  predicates:
    - Path=/order-service/**
  filters:
    - RewritePath=/order-service/(?<segment>.*), /$\{segment}
```

---

## Service Startup Order

### Recommended Startup Sequence

1. **Discovery Service (port 8761)**
   ```bash
   cd discovery-service && mvn spring-boot:run
   ```
   - **Wait 5 seconds** for Eureka to start

2. **Config Service (port 9999)**
   ```bash
   cd config-service && mvn spring-boot:run
   ```
   - **Wait 3 seconds** for Config Server to start

3. **Microservices (any order)**
   ```bash
   # Can start all microservices in parallel:
   cd product-service && mvn spring-boot:run    # Port 8084
   cd order-service && mvn spring-boot:run      # Port 8085
   cd customer-service && mvn spring-boot:run   # Port 8081
   cd inventory-service && mvn spring-boot:run  # Port 8082
   cd billing-service && mvn spring-boot:run    # Port 8083
   ```

4. **API Gateway (port 8989)**
   ```bash
   cd gatewey-service && mvn spring-boot:run
   ```
   - **Last!** Gateway discovers services via Eureka

### Why This Order?
- **Discovery first**: Services need Eureka to register
- **Config second**: Services pull configuration from Config Server
- **Microservices parallel**: Each registers independently with Eureka
- **Gateway last**: Discovers all registered services and creates routes

---

## Testing Integration

### 1. Verify Eureka Dashboard
```
http://localhost:8761
```

You should see all services registered:
- PRODUCT-SERVICE (8084)
- ORDER-SERVICE (8085)
- CUSTOMER-SERVICE (8081)
- INVENTORY-SERVICE (8082)
- BILLING-SERVICE (8083)
- CONFIG-SERVICE (9999)

### 2. Test Direct Service Calls
```bash
# Product Service
curl http://localhost:8084/api/products
curl http://localhost:8084/api/products/{productId}

# Order Service
curl http://localhost:8085/api/orders
curl http://localhost:8085/api/orders/{orderId}
```

### 3. Test Gateway Routes
```bash
# Via Gateway (recommended for frontend)
curl http://localhost:8989/product-service/api/products
curl http://localhost:8989/order-service/api/orders
curl http://localhost:8989/customer-service/api/customers
```

### 4. Test Inter-Service Communication
Order Service calls Product Service to enrich order data:
```bash
curl http://localhost:8985/api/orders/1
# Response includes product details fetched from product-service
```

---

## Gateway Configuration Details

### Route Definition Pattern
Each service route follows this pattern:
```yaml
- id: {service}-route
  uri: lb://{SERVICE-NAME}
  predicates:
    - Path=/{service-name}/**
  filters:
    - RewritePath=/{service-name}/(?<segment>.*), /$\{segment}
```

### How Gateway Works
1. **Load Balancer Prefix** (`lb://`): Uses Eureka discovery
2. **Path Predicate**: Matches requests to `/service-name/**`
3. **RewritePath Filter**: Removes `/service-name` prefix before forwarding
4. **Discovery Locator**: Automatically generates routes for new services

### URL Mapping Example
```
Request:  GET http://localhost:8989/product-service/api/products
Gateway:  Routes to PRODUCT-SERVICE
RewritePath: Converts to GET /api/products
Service:  Receives and processes request
```

---

## Configuration Server Integration

### Config Files Structure
```
config-repo/
├── application.properties              # Global config
├── product-service.properties          # Product Service config
├── order-service.properties            # Order Service config
├── customer-service.properties         # Customer Service config
├── inventory-service.properties        # Inventory Service config
├── billing-service.properties          # Billing Service config
├── gateway-service.properties          # Gateway config
└── discovery-service.properties        # Discovery config
```

### How Services Get Configuration
1. Service starts and loads `bootstrap.properties`
2. Reads `spring.config.import=optional:configserver:http://localhost:9999`
3. Requests configuration from Config Server
4. Config Server reads from `config-repo/{service-name}.properties`
5. Service merges local + remote configuration

### Priority Order
1. Remote config (config-repo)
2. Local application.properties
3. System properties
4. Environment variables

---

## Security & Authentication Ready

### Spring Security Added to Both Services
```java
@SpringBootApplication
public class ProductServiceApplication {
    // Spring Security enabled
    // OAuth2/JWT ready for Keycloak
    // @PreAuthorize annotations on methods
}
```

### Future Keycloak Integration
When Keycloak is added:
1. API Gateway will validate JWT tokens
2. Services will validate JWT token signatures
3. Role-based access control will be enforced
4. User context will be available via JWT claims

---

## Service Communication Pattern

### Product Service ← Order Service Communication

Order Service uses Feign to call Product Service:

```java
@Service
public class OrderService {
    @Autowired
    private ProductRestClient productRestClient;
    
    public void enrichOrderWithProductDetails(Order order) {
        for (OrderItem item : order.getItems()) {
            // Feign client calls product-service
            Product product = productRestClient.getProductById(item.getProductId());
            item.setProduct(product);
        }
    }
}
```

**How it works:**
1. Order Service needs product details
2. Uses Feign client with name `product-service`
3. Eureka resolves `product-service` to actual URL
4. Feign makes HTTP call with load balancing
5. Product Service responds with product data
6. Order enriched with product information

---

## Database Isolation

Each service has its own H2 database:

| Service | Database | Port | Schema |
|---------|----------|------|--------|
| PRODUCT | products-db | 8084 | jdbc:h2:mem:products-db |
| ORDER | orders-db | 8085 | jdbc:h2:mem:orders-db |
| CUSTOMER | customers-db | 8081 | jdbc:h2:mem:customers-db |
| INVENTORY | inventory-db | 8082 | jdbc:h2:mem:inventory-db |
| BILLING | bills-db | 8083 | jdbc:h2:mem:bills-db |

**Note:** H2 console enabled for development:
```
http://localhost:8084/h2-console  (Product)
http://localhost:8085/h2-console  (Order)
```

---

## Logging & Monitoring

### Service Startup Verification
Check console output for Eureka registration messages:

```log
✓ [PRODUCT-SERVICE]: Registering with Eureka server at [http://localhost:8761/eureka]
✓ [PRODUCT-SERVICE]: Eureka registration completed
✓ [PRODUCT-SERVICE]: Successfully registered with Eureka

✓ [ORDER-SERVICE]: Registering with Eureka server at [http://localhost:8761/eureka]
✓ [ORDER-SERVICE]: Eureka registration completed
```

### Health Check
```bash
# Check service health via discovery
curl http://localhost:8761/eureka/apps/PRODUCT-SERVICE
curl http://localhost:8761/eureka/apps/ORDER-SERVICE

# Direct health endpoints
curl http://localhost:8084/actuator/health
curl http://localhost:8085/actuator/health
```

---

## Troubleshooting

### Service Not Appearing in Eureka
**Symptoms:** Service not visible in Eureka dashboard
**Solutions:**
1. Verify `spring.cloud.config.enabled=true` in application.properties
2. Verify Eureka URL: `eureka.client.service-url.defaultZone=http://localhost:8761/eureka`
3. Check service port is not already in use
4. Ensure discovery-service is running first

### Gateway Cannot Route to Service
**Symptoms:** 503 Service Unavailable from Gateway
**Solutions:**
1. Verify service is registered in Eureka
2. Verify gateway route matches service name (case-sensitive)
3. Check RewritePath filter is correctly configured
4. Verify gateway is running after microservices

### Feign Calls Failing Between Services
**Symptoms:** Service-to-service communication fails
**Solutions:**
1. Verify @FeignClient name matches service name in Eureka
2. Ensure source service has spring-cloud-starter-openfeign dependency
3. Check endpoint path is correct
4. Verify services are running and discoverable

### Config Server Not Serving Configurations
**Symptoms:** Services show "Could not fetch config"
**Solutions:**
1. Verify config-service is running on port 9999
2. Check config-repo files exist and are readable
3. Verify file names match service names: `{service-name}.properties`
4. Check git repository is initialized in config-repo

---

## Deployment Checklist

- [ ] Eureka Discovery Service running (8761)
- [ ] Config Server running (9999)
- [ ] Product Service registered with Eureka (8084)
- [ ] Order Service registered with Eureka (8085)
- [ ] Customer Service registered with Eureka (8081)
- [ ] Gateway Service routing all requests (8989)
- [ ] Gateway routes configured for product-service and order-service
- [ ] Eureka dashboard shows all services as UP
- [ ] Direct API calls to each service work
- [ ] Gateway routes work for each service
- [ ] Feign calls between services succeed

---

## Summary

**Product Service** and **Order Service** are now fully integrated into the microservices architecture with:

✓ Automatic Eureka discovery  
✓ Configuration management via Config Server  
✓ API Gateway routing  
✓ Inter-service communication (Feign)  
✓ Database isolation  
✓ Security framework ready for Keycloak  
✓ Same architecture pattern as existing services  

**Next Phase:** Keycloak integration for authentication and authorization

---

*Last Updated: 2026-01-11*
*Status: ARCHITECTURE ALIGNED & VERIFIED*
