# Design Token Sync Automation

This directory contains automation scripts for maintaining design consistency across the SymbiosoAi ThinkTank platform.

## Design Token Sync

The `sync-tokens.js` script automatically syncs design tokens from a Git repository into the project.

### Setup Instructions

1. **Environment Variables**: Copy `.env.example` to `.env` and configure:
   ```bash
   # Required for private repositories
   TOKENS_REPO=https://github.com/your-org/symbiosoai-design-tokens.git
   TOKENS_BRANCH=main
   GITHUB_TOKEN=your_github_token_here
   ```

2. **Run Sync**: Execute the sync script:
   ```bash
   node scripts/sync-tokens.js
   ```

### Configuration Options

- **TOKENS_REPO**: URL of the design tokens Git repository
- **TOKENS_BRANCH**: Branch to sync from (defaults to "main")
- **GITHUB_TOKEN** or **PAT**: Personal access token for private repositories
- **Destination**: Tokens are synced to the `tokens/` directory

### Supported Repository Structures

The script automatically detects tokens in these locations:
- `tokens/`
- `design-tokens/`
- `dist/tokens/`

### Integration

The sync process integrates with:
- **CSS Custom Properties**: Tokens are converted for use in stylesheets
- **Tailwind Configuration**: Design system values for consistent theming
- **Component Library**: Shared design tokens across shadcn/ui components

### Automation Benefits

✅ **Centralized Design System**: Single source of truth for all design tokens
✅ **Real-time Sync**: Automatic updates when design tokens change
✅ **Version Control**: Full history and rollback capabilities
✅ **Team Collaboration**: Designers and developers stay in sync
✅ **Enterprise Security**: Private repository support with token authentication

### Troubleshooting

- **Authentication Errors**: Verify GITHUB_TOKEN has repo access permissions
- **Token Not Found**: Check repository structure matches expected paths
- **Permission Denied**: Ensure write access to local `tokens/` directory