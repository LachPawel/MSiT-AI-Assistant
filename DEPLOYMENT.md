# Deployment & Operations Plan

## 1. Deployment Environment

The system is designed to be deployed in a **Private Cloud** or **On-Premise** environment within the government infrastructure (e.g., Rządowa Chmura Obliczeniowa) to ensure data sovereignty and security.

### Infrastructure Requirements
- **Container Runtime:** Kubernetes (K8s) or Docker Swarm.
- **Database:** PostgreSQL 15+ (High Availability Cluster).
- **Storage:** S3-compatible object storage (e.g., MinIO) for on-premise document storage.
- **Network:** Internal V-LAN with restricted internet access (allowlist for OpenAI/Exa APIs).

## 2. CI/CD Pipeline

We use a GitOps approach for reliable deployments.

### Stages:
1. **Code Commit:** Developer pushes to `develop` branch.
2. **Automated Testing:**
   - Unit Tests (Jest)
   - Integration Tests
   - Security Scan (SAST - SonarQube)
3. **Build:** Docker images built and pushed to internal registry.
4. **Staging Deploy:** Automatic deployment to test environment.
5. **Approval:** Manual sign-off by QA/Security Officer.
6. **Production Deploy:** Rolling update to production cluster.

## 3. Monitoring & Observability

- **Logs:** Centralized logging (ELK Stack or Graylog). All audit logs are shipped here.
- **Metrics:** Prometheus + Grafana dashboards (CPU, Memory, API Latency, Error Rates).
- **Tracing:** OpenTelemetry for tracking requests across microservices.

## 4. Maintenance

- **Updates:** Monthly maintenance windows for non-critical updates.
- **Backups:**
  - Database: Daily full backup, hourly incremental (WAL). Retention: 5 years.
  - Documents: Real-time replication to secondary site.

## 5. Disaster Recovery

- **RTO (Recovery Time Objective):** 4 hours.
- **RPO (Recovery Point Objective):** 1 hour.
- **Strategy:** Active-Passive failover to a secondary data center.

## 6. AI Model Governance

- **Model Updates:** We stick to specific model versions (e.g., `gpt-4-0125-preview`) to ensure consistency. Updates are tested in Staging before rollout.
- **Fallback:** If external AI API is down, the system degrades gracefully (manual mode remains fully functional).
