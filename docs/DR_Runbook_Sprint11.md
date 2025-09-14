# SymbiosoAi Disaster Recovery Runbook - Sprint 11
**Version:** 1.0  
**Date:** September 14, 2025  
**Contact:** Platform Engineering Team

## Overview
This runbook outlines disaster recovery procedures for SymbiosoAi's GA production environment, implemented as part of Sprint 11 hardening efforts.

## Emergency Contacts
- **Platform Lead:** [Contact Information]
- **Database Admin:** [Contact Information]  
- **Security Lead:** [Contact Information]
- **On-Call Engineer:** [Contact Information]

## Critical Systems & Dependencies
- **Primary Database:** PostgreSQL (Neon)
- **Cache Layer:** Redis
- **Queue System:** BullMQ/Redis
- **Authentication:** Replit Auth
- **Billing:** Stripe Integration
- **Monitoring:** Application logs + metrics

## Recovery Time Objectives (RTO) & Recovery Point Objectives (RPO)
- **RTO Target:** 4 hours maximum downtime
- **RPO Target:** 15 minutes maximum data loss
- **Availability SLA:** 99.9% uptime

## Disaster Scenarios & Procedures

### Scenario 1: Database Failure
**Symptoms:** Database connection errors, 500 errors on data operations

**Recovery Steps:**
1. **Immediate Response (0-15 minutes)**
   - Check database status via Neon dashboard
   - Verify connection string and credentials
   - Check for network connectivity issues

2. **Assessment (15-30 minutes)**
   - Determine if primary database is recoverable
   - Evaluate data integrity and corruption
   - Check backup availability and freshness

3. **Recovery (30-240 minutes)**
   - If recoverable: Work with Neon support for primary restoration
   - If unrecoverable: Initiate point-in-time recovery from backups
   - Update connection strings if necessary
   - Verify data integrity after restoration

4. **Validation (Post-Recovery)**
   - Run health checks on all application services
   - Verify critical user flows (auth, sessions, billing)
   - Monitor for data inconsistencies

### Scenario 2: Application Server Failure
**Symptoms:** Application unresponsive, timeout errors, workflow failures

**Recovery Steps:**
1. **Immediate Response (0-10 minutes)**
   - Check application logs and metrics
   - Verify server resources (CPU, memory, disk)
   - Check dependency status (database, Redis, external APIs)

2. **Recovery (10-60 minutes)**
   - Restart application services in proper order:
     1. Database connections
     2. Redis/cache layer
     3. Main application server
     4. Background workers (dunning, insights)
     5. Queue processors

3. **Validation**
   - Verify all endpoints respond correctly
   - Check worker processes are running
   - Test critical user journeys

### Scenario 3: Authentication System Failure
**Symptoms:** Login failures, 401 errors, authentication timeouts

**Recovery Steps:**
1. **Immediate Response (0-5 minutes)**
   - Check Replit Auth service status
   - Verify OAuth configuration and secrets
   - Check network connectivity to auth providers

2. **Recovery (5-30 minutes)**
   - Restart authentication services
   - Clear auth-related caches
   - Verify OIDC configuration
   - Test login flow with test accounts

### Scenario 4: Billing System Failure
**Symptoms:** Payment processing errors, subscription issues, invoice generation failures

**Recovery Steps:**
1. **Immediate Response (0-10 minutes)**
   - Check Stripe dashboard and webhook status
   - Verify billing endpoint availability
   - Check dunning worker status

2. **Recovery (10-60 minutes)**
   - Restart billing workers and queue processors
   - Verify webhook endpoints are responsive
   - Re-sync billing data if necessary
   - Test payment flow with test transactions

## Backup & Recovery Procedures

### Database Backups
- **Frequency:** Automated daily backups via Neon
- **Retention:** 30 days point-in-time recovery
- **Testing:** Monthly backup restoration tests
- **Location:** Neon managed backups + manual exports to S3

### Application Backups
- **Code:** Git repository (GitHub)
- **Configuration:** Environment variables documented
- **Assets:** Static files backed up to object storage

### Recovery Validation Checklist
- [ ] Database connectivity and data integrity
- [ ] User authentication and authorization
- [ ] Critical API endpoints responding
- [ ] Background workers processing jobs
- [ ] Billing and payment processing
- [ ] Monitoring and alerting functional
- [ ] SSL certificates valid and loading
- [ ] CDN and asset delivery working

## Communication Plan
1. **Internal Notification:** Slack #incidents channel
2. **Status Page:** Update public status page within 15 minutes
3. **Customer Communication:** Email notifications for extended outages
4. **Stakeholder Updates:** Hourly progress updates during incidents

## Post-Incident Procedures
1. **Immediate (0-24 hours)**
   - Document incident timeline and resolution
   - Assess any data loss or corruption
   - Review customer impact and communications

2. **Short-term (1-7 days)**
   - Conduct post-incident review meeting
   - Identify root cause and contributing factors
   - Update monitoring and alerting based on lessons learned

3. **Long-term (1-4 weeks)**
   - Implement process improvements
   - Update runbooks and procedures
   - Schedule additional training if needed

## Monitoring & Alerting
- **Database:** Connection failures, query performance, storage usage
- **Application:** Response times, error rates, memory usage
- **Workers:** Queue depths, job failures, processing times
- **Security:** Authentication failures, suspicious activity
- **Business:** Payment failures, SLA breaches

## Environment Variables & Configuration
Critical environment variables that must be restored:
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
REPLIT_CLIENT_ID=...
REPLIT_CLIENT_SECRET=...
STRIPE_SECRET_KEY=...
BILLING_PUBLIC_URL=...
SLA_DEBATE_P95_MS=30000
SLA_EXPORT_P95_MS=5000
```

## Testing & Validation
- **Monthly:** Full DR drill with secondary environment
- **Quarterly:** Cross-team incident response simulation
- **Annually:** Complete infrastructure failover test

## Revision History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-09-14 | Initial Sprint 11 DR Runbook | Platform Team |

---
*This runbook should be reviewed and updated quarterly or after any major infrastructure changes.*