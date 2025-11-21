# Cursor Commands for digitaldias.com

This directory contains custom commands that can be used in Cursor Chat by typing `/` followed by the command name.

## Available Commands

### `/new-blog-post`
Complete blog post creation workflow with image planning, technical specs, front matter template, and pre-publish checklist.

**Usage**: Type `/new-blog-post` in Cursor Chat when you want to create a new blog post.

### `/optimize-image`
Image optimization guide with dimensions, formats, compression settings, brand colors for diagrams, and AI-assisted selection.

**Usage**: Type `/optimize-image` in Cursor Chat when you need help optimizing images for blog posts.

### `/deploy-checklist`
Pre-deployment validation, build verification, deployment workflow, post-deployment checks, and rollback procedures.

**Usage**: Type `/deploy-checklist` in Cursor Chat before deploying to production.

### `/common-tasks`
Quick reference for updating stats, adding social links, changing navigation, managing content sections, and routine maintenance.

**Usage**: Type `/common-tasks` in Cursor Chat for quick reference on common site maintenance tasks.

## How Cursor Commands Work

Cursor automatically detects `.md` files in the `.cursor/commands/` directory and makes them available as slash commands. When you type `/` in Cursor Chat, these commands will appear in the autocomplete list.

## File Naming Convention

- Commands are named using kebab-case (e.g., `new-blog-post.md`)
- The filename (without `.md`) becomes the command name
- Use descriptive names that match the command's purpose

## Adding New Commands

1. Create a new `.md` file in `.cursor/commands/`
2. Use kebab-case for the filename
3. Start with a clear title (H1)
4. Include step-by-step instructions
5. Use code blocks for commands and examples
6. Add checklists where appropriate

## Reference Files

The original prompt files are maintained in `.github/prompts/` for GitHub Copilot compatibility. The Cursor commands in this directory are the primary source and may include updates not yet reflected in the prompts directory.

