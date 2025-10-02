# SymbiosoAi ThinkTank Export Package vC

**Generated**: 2025-10-02T06:30:43.501Z
**Commit**: 1fae797d7113ed7832efc6a09f62c16922575257
**Description**: October 2, 2025 - Updated USER_MANUAL.md with evidence generation and export package documentation

## Package Contents

This export package contains:
- Complete source code (client, server, shared)
- Database schema and migrations
- Configuration files
- Build artifacts
- API documentation (Postman)
- Test infrastructure

## Reconstruction

```bash
# Extract package
tar -xzf SymbiosoAi_ThinkTank_vC_Export.tar.gz
cd exports/

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npm run db:push

# Start development
npm run dev
```

## Version Information

- **Version**: vC
- **Commit Hash**: 1fae797d7113ed7832efc6a09f62c16922575257
- **Export Date**: 10/2/2025
