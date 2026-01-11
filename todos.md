Backend Services:
☐ product-service (renommé, API complète)
☐ order-service (refactorisé, API complète)
☐ API Gateway (JWT validation, token propagation)
☐ Discovery Service (Eureka operational)
☐ Config Service (configurations centralisées)

Sécurité:
☐ Keycloak déployé et configuré
☐ Realm "ecommerce" créé
☐ Clients créés (frontend, gateway)
☐ Rôles ADMIN et CLIENT créés
☐ Users de test créés
☐ JWT tokens validés sur Gateway
☐ @PreAuthorize annotations en place
☐ Inter-service token propagation

Frontend:
☐ React app créée
☐ Keycloak JS integration
☐ Login/Logout flows
☐ Product list page
☐ Order creation flow
☐ ADMIN dashboard
☐ Error handling (401, 403)

Conteneurisation:
☐ Dockerfile pour chaque service
☐ docker-compose.yml complet
☐ Keycloak + PostgreSQL (3x)
☐ Volumes & networks configurés
☐ docker-compose up fonctionne

DevSecOps:
☐ SonarQube scan (pas de vulnérabilités critiques)
☐ OWASP Dependency-Check (dépendances sûres)
☐ Trivy scan (images sécurisées)
☐ GitHub Actions workflow
☐ Tests coverage >60%

Logging & Monitoring:
☐ ELK ou Loki setup
☐ Logs centralisés
☐ Prometheus + Grafana
☐ Dashboards créés
☐ Alerts configurées

Documentation:
☐ README.md
☐ ARCHITECTURE.md
☐ Diagrammes (ASCII + images)
☐ Guides déploiement
☐ Guides développeur
☐ Security documentation
☐ Captures d'écran
☐ (Optionnel) Vidéo démo