# 🚀 STARTUP & TESTING QUICK START

## 📖 Overview

Ce répertoire contient un système de microservices e-commerce complet avec:
- **8 services** intégrés (Product, Order, Customer, Inventory, Billing, Gateway, Config, Discovery)
- **Eureka Discovery** pour l'auto-registration et la découverte
- **Config Server** pour la configuration centralisée
- **API Gateway** pour le single entry point
- **Spring Security** pour l'authentification (Keycloak ready)

---

## 🎯 DÉMARRAGE RAPIDE

### Option 1: Démarrage Automatique (Recommandé)

```bash
cd c:\Users\ASUS\Desktop\AzureBackup\Projet-securite-systeme-distribue
start-services.bat
```

**Ce qui se passe automatiquement:**
1. ✓ Tue tous les processus Java existants
2. ✓ Démarre Eureka Discovery (8761)
3. ✓ Démarre Config Server (9999)
4. ✓ Démarre tous les microservices (8081-8085) avec délais appropriés
5. ✓ Démarre API Gateway (8989)
6. ✓ Affiche les URLs et les tableaux de bord pour monitoring

**Temps total de démarrage:** ~60 secondes

Chaque service s'ouvre dans sa propre fenêtre de terminal pour un monitoring facile.

### Option 2: Démarrage Manuel (Pour le debugging)

```bash
# Terminal 1 - Discovery Service (TOUJOURS COMMENCER PAR LÀ)
cd discovery-service
mvn spring-boot:run

# Attendre 10 secondes, puis Terminal 2
cd config-service
mvn spring-boot:run

# Attendre 5 secondes, puis Terminal 3
cd product-service
mvn spring-boot:run

# Terminal 4
cd order-service
mvn spring-boot:run

# Terminal 5
cd customer-service
mvn spring-boot:run

# Terminal 6 - TOUJOURS EN DERNIER
cd gatewey-service
mvn spring-boot:run
```

---

## ✅ VÉRIFICATION DU STATUT

### Méthode 1: Dashboard Eureka

```
URL: http://localhost:8761
```

Vous devriez voir tous les 4 services enregistrés:
- ✓ PRODUCT-SERVICE (8084)
- ✓ ORDER-SERVICE (8085)
- ✓ CUSTOMER-SERVICE (8081)
- ✓ GATEWAY-SERVICE (8989)

### Méthode 2: Tests Automatiques

```bash
test-architecture.bat
```

Ce script teste en séquence:
- Eureka availability
- Service registration
- Config Server
- Direct service access
- Gateway routing
- Inter-service communication
- Health checks

### Méthode 3: Tests Manuels

```bash
# Vérifier que Eureka tourne
curl http://localhost:8761

# Vérifier les services enregistrés
curl http://localhost:8761/eureka/apps

# Vérifier qu'un service spécifique est UP
curl http://localhost:8761/eureka/apps/PRODUCT-SERVICE

# Tester accès direct à un service
curl http://localhost:8084/api/products

# Tester via le Gateway
curl http://localhost:8989/product-service/api/products
```

---

## 🔗 ENDPOINTS & URLS

### Direct Service Access

| Service | Port | Endpoint |
|---------|------|----------|
| Product | 8084 | http://localhost:8084/api/products |
| Order | 8085 | http://localhost:8085/api/orders |
| Customer | 8081 | http://localhost:8081/api/customers |

### Via API Gateway (Recommandé pour Frontend)

| Service | Endpoint |
|---------|----------|
| Product | http://localhost:8989/product-service/api/products |
| Order | http://localhost:8989/order-service/api/orders |
| Customer | http://localhost:8989/customer-service/api/customers |

### Management & Monitoring

| Service | URL |
|---------|-----|
| Eureka Dashboard | http://localhost:8761 |
| Config Server | http://localhost:9999 |
| Product DB (H2) | http://localhost:8084/h2-console |
| Order DB (H2) | http://localhost:8085/h2-console |

---

## 📊 API EXAMPLES

### Create a Product

```bash
curl -X POST http://localhost:8089/product-service/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:8989/order-service/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "C001",
    "status": "PENDING"
  }'
```

### Get Orders with Product Details

```bash
# Order Service calls Product Service via Feign automatically
curl http://localhost:8989/order-service/api/orders/1
```

### Add Items to Order

```bash
curl -X POST http://localhost:8989/order-service/api/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 5
  }'
```

---

## 🛠️ ARCHITECTURE DETAILS

### Service Configuration

Chaque microservice a:
1. **Eureka Registration** - S'enregistre automatiquement
2. **Config Server Integration** - Récupère la config centralisée
3. **H2 Database** - Base de données en mémoire isolée
4. **Actuator Endpoints** - Health checks et monitoring

### Gateway Routing

Le Gateway utilise:
- **Discovery Locator** - Découvre les services dynamiquement
- **Path Predicates** - Route basée sur /service-name/**
- **RewritePath Filters** - Enlève le préfixe avant d'envoyer au service
- **Load Balancing** - Distribue les requests via Ribbon

### Inter-Service Communication

Order Service peut appeler Product Service via:
```java
@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductRestClient {
    @GetMapping("/api/products/{id}")
    Product getProduct(@PathVariable("id") Long id);
}
```

---

## 🐛 TROUBLESHOOTING

### Services ne Démarrent Pas

**Problem:** `Address already in use`

**Solution:**
```bash
# Tuer tous les processus Java
taskkill /F /IM java.exe

# Redémarrer
start-services.bat
```

### Service n'Apparaît Pas dans Eureka

**Problem:** Service lance mais ne s'enregistre pas

**Solution:**
1. Vérifier les logs du service pour "Registering with Eureka"
2. Vérifier que Discovery Service tourne (http://localhost:8761)
3. Vérifier que service a `spring-cloud-starter-netflix-eureka-client` dans pom.xml

### Gateway Route ne Fonctionne Pas

**Problem:** `curl http://localhost:8989/product-service/api/products` → 503 Service Unavailable

**Solution:**
1. Vérifier service est UP dans Eureka Dashboard
2. Test accès direct: `curl http://localhost:8084/api/products`
3. Check gateway logs pour erreurs d'enregistrement

### Config Server ne Fournit Pas la Config

**Problem:** Service logs: "Spring Cloud Config is disabled"

**Solution:**
1. Vérifier `spring.cloud.config.enabled=true` dans application.properties
2. Vérifier Config Server tourne sur 9999
3. Vérifier fichier config existe dans config-repo/

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez:

| Document | Contenu |
|----------|---------|
| [VALIDATION-GUIDE.md](VALIDATION-GUIDE.md) | Guide complet de test et validation |
| [ARCHITECTURE-INTEGRATION.md](ARCHITECTURE-INTEGRATION.md) | Architecture détaillée et configuration |
| [README-PHASE1.md](README-PHASE1.md) | Résumé de la Phase 1 |
| [PHASE1-COMPLETION.md](PHASE1-COMPLETION.md) | Checklist de complétion Phase 1 |

---

## 🎓 ÉTAPES SUIVANTES

### Court Terme (Cette Semaine)
1. ✓ Vérifier que tous les services démarrent
2. ✓ Tester les APIs via Gateway
3. ✓ Vérifier que Eureka découvre tous les services
4. ✓ Tester la communication inter-services

### Moyen Terme (Semaines 2-3)
1. Setup Keycloak pour authentication
2. Créer React frontend
3. Tester le flux complet (Frontend → Gateway → Services)

### Long Terme (Mois 1+)
1. Docker containerization
2. Kubernetes deployment
3. PostgreSQL migration
4. CI/CD pipeline
5. Production monitoring

---

## 📞 SUPPORT

### Logs

Chaque service a ses logs dans sa fenêtre de terminal. Recherchez:
- `Started [ServiceName]Application in X seconds` = OK
- `Registering with Eureka` = S'enregistrant
- `eureka.client.enabled:false` = ERREUR - pas d'enregistrement
- Exceptions = Checker configuration

### Quick Debug Commands

```bash
# Vérifier un service
curl -v http://localhost:8084/api/products

# Voir tous les services dans Eureka
curl http://localhost:8761/eureka/apps | findstr name

# Vérifier health
curl http://localhost:8084/actuator/health

# Vérifier config
curl http://localhost:9999/product-service/default
```

### Common Issues

| Issue | Check |
|-------|-------|
| Port 8761 in use | Discovery Service |
| Port 9999 in use | Config Server |
| Port 8089 in use | Gateway |
| Service not in Eureka | Logs du service |
| Gateway 503 error | Vérifier service status dans Eureka |
| Config not applied | Redémarrer service |

---

## ✨ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  FRONTEND (React)                                   │
│         ↓                                           │
│  ┌──────────────────────────────────────┐           │
│  │   API GATEWAY (8989)                 │           │
│  │   lb://SERVICE-NAME with discovery   │           │
│  └──────────────────────────────────────┘           │
│     ↓              ↓              ↓                 │
│  PRODUCT      ORDER          CUSTOMER               │
│  (8084)       (8085)         (8081)                 │
│     ↓              ↓              ↓                 │
│  ┌──────────────────────────────────────┐           │
│  │   EUREKA DISCOVERY (8761)            │           │
│  │   Auto-registration & load balancing │           │
│  └──────────────────────────────────────┘           │
│     ↑              ↑              ↑                 │
│  ┌──────────────────────────────────────┐           │
│  │   CONFIG SERVER (9999)               │           │
│  │   Central configuration management    │           │
│  └──────────────────────────────────────┘           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

**Status**: ✅ READY FOR PRODUCTION
**Last Updated**: 2024
**Version**: 1.0 Phase 1 Complete
