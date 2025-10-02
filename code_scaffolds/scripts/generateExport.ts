/**
 * Export Package Generator
 * Creates comprehensive TAR archives of the complete workspace
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const EXPORTS_DIR = join(ROOT_DIR, 'exports');

function logStep(message: string) {
  console.log(`\n✓ ${message}`);
}

function runCommand(command: string, description: string): string {
  logStep(description);
  try {
    return execSync(command, { 
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
  } catch (error: any) {
    console.error(`Error during: ${description}`);
    console.error(error.message);
    throw error;
  }
}

async function generateExport(version: string, description: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generating Export Package: v${version}`);
  console.log(`Description: ${description}`);
  console.log(`${'='.repeat(60)}`);

  // Get current commit hash
  const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  logStep(`Current commit: ${commitHash}`);

  // Create exports directory if it doesn't exist
  if (!existsSync(EXPORTS_DIR)) {
    mkdirSync(EXPORTS_DIR, { recursive: true });
    logStep('Created exports directory');
  }

  // Get database schema
  logStep('Exporting database schema...');
  try {
    const schemaExport = execSync(
      `psql "${process.env.DATABASE_URL}" -c "\\dt" -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';" --csv`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    writeFileSync(join(EXPORTS_DIR, 'schema.sql'), schemaExport);
  } catch (error) {
    console.log('Note: Database schema export skipped (optional)');
  }

  // Copy key files to exports directory
  const filesToCopy = [
    'package.json',
    'package-lock.json',
    'components.json',
    'drizzle.config.ts',
    'jest.config.ts',
    'playwright.config.ts',
    'postcss.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    '.replit',
    '.env.example'
  ];

  logStep('Copying configuration files...');
  for (const file of filesToCopy) {
    try {
      execSync(`cp ${file} ${EXPORTS_DIR}/ 2>/dev/null || true`, { cwd: ROOT_DIR });
    } catch (error) {
      // File might not exist, continue
    }
  }

  // Copy critical directories
  const directoriesToCopy = [
    'client',
    'server', 
    'shared',
    'db',
    'postman',
    'build',
    'coverage'
  ];

  logStep('Copying source code and assets...');
  for (const dir of directoriesToCopy) {
    try {
      execSync(`cp -r ${dir} ${EXPORTS_DIR}/ 2>/dev/null || true`, { cwd: ROOT_DIR });
    } catch (error) {
      // Directory might not exist, continue
    }
  }

  // Create export summary
  const exportSummary = `# SymbiosoAi ThinkTank Export Package v${version}

**Generated**: ${new Date().toISOString()}
**Commit**: ${commitHash}
**Description**: ${description}

## Package Contents

This export package contains:
- Complete source code (client, server, shared)
- Database schema and migrations
- Configuration files
- Build artifacts
- API documentation (Postman)
- Test infrastructure

## Reconstruction

\`\`\`bash
# Extract package
tar -xzf SymbiosoAi_ThinkTank_v${version}_Export.tar.gz
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
\`\`\`

## Version Information

- **Version**: v${version}
- **Commit Hash**: ${commitHash}
- **Export Date**: ${new Date().toLocaleDateString()}
`;

  writeFileSync(join(EXPORTS_DIR, 'EXPORT_SUMMARY.md'), exportSummary);
  logStep('Created export summary');

  // Create TAR archive
  const archiveName = `SymbiosoAi_ThinkTank_v${version}_Export.tar.gz`;
  logStep(`Creating archive: ${archiveName}`);
  
  runCommand(
    `tar -czf ${archiveName} exports/`,
    'Compressing export package'
  );

  // Get archive size
  const size = execSync(`ls -lh ${archiveName} | awk '{print $5}'`, { 
    encoding: 'utf-8' 
  }).trim();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Export Complete!`);
  console.log(`Package: ${archiveName}`);
  console.log(`Size: ${size}`);
  console.log(`Location: ${ROOT_DIR}/${archiveName}`);
  console.log(`${'='.repeat(60)}\n`);

  return {
    archiveName,
    size,
    commitHash
  };
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const version = args[0] || 'C';
  const description = args[1] || 'Updated export with latest changes';

  try {
    await generateExport(version, description);
  } catch (error: any) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

main();
