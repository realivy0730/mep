# MEPS Project

## Git Flow Workflow

This project uses Git Flow for branch management. Here's how to work with it:

### Main Branches
- `master`: Production-ready code
- `develop`: Latest development changes for the next release

### Supporting Branches
- `feature/*`: New features development
- `release/*`: Preparation for a new production release
- `hotfix/*`: Urgent fixes for production issues
- `support/*`: Maintenance for older versions

### Common Workflows

#### Starting a new feature
```bash
git flow feature start feature_name
# Work on your feature...
git flow feature finish feature_name
```

#### Creating a release
```bash
git flow release start 1.0.0
# Make release-specific changes if needed...
git flow release finish 1.0.0
```

#### Fixing a production issue
```bash
git flow hotfix start hotfix_name
# Fix the issue...
git flow hotfix finish hotfix_name
```

## Getting Started

[Add project-specific instructions here]
