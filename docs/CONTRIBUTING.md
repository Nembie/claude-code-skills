# Contributing to claude-code-skills

Thank you for contributing! This guide explains how to create skills that follow our standards.

## Skill Structure

Each skill is a folder containing:

```
skills/my-skill/
├── SKILL.md              # Required: Main skill definition
├── references/           # Optional: Detailed reference docs
│   └── patterns.md
├── assets/               # Optional: Templates and boilerplate
│   └── template/
│       └── file.ts
└── scripts/              # Optional: Helper scripts
    └── analyze.sh
```

## SKILL.md Format

Every skill must have a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-skill-name
description: Clear description of what this skill does and WHEN to use it. This is the trigger text.
---

# Skill Title

[Body content - instructions for Claude]
```

### Frontmatter Rules

- **name**: Lowercase, hyphenated (e.g., `prisma-query-optimizer`)
- **description**: 1-2 sentences explaining:
  - WHAT the skill does
  - WHEN to use it (trigger conditions)
  - This is the PRIMARY way skills are discovered and triggered

### Body Rules

- Written in imperative form ("Analyze the code" not "This skill analyzes")
- Keep under 500 lines
- Don't duplicate the description's "when to use" info
- Focus on HOW to execute the skill
- Include code examples for patterns to detect or generate
- Define clear output formats

## References Directory

Use `references/` for detailed information that:
- Isn't always needed but is valuable when relevant
- Would make the main SKILL.md too long
- Contains catalogs, checklists, or pattern libraries

Reference files should be markdown and focused on a single topic.

## Assets Directory

Use `assets/` for:
- Code templates and boilerplate
- Configuration file examples
- Starter files that can be copied

Assets should be complete, working files (no TODOs).

## Creating an Agent

Agents orchestrate multiple skills. Their `SKILL.md` should:

1. List the skills they depend on
2. Define execution steps (which skill to run and when)
3. Explain how to combine outputs
4. Handle deduplication of findings

Example agent structure:
```markdown
---
name: my-agent
description: Orchestrates skill-a and skill-b to accomplish X. Use when...
---

# My Agent

## Skill Dependencies
- skills/skill-a
- skills/skill-b

## Execution Steps

### Step 1: Run skill-a
[Instructions]

### Step 2: Run skill-b
[Instructions]

### Step 3: Combine Results
[Instructions for merging outputs]
```

## Writing Guidelines

### Do
- Be concise - Claude is smart, only include what it doesn't know
- Use code examples to illustrate patterns
- Define clear input/output formats
- Test your skill with real scenarios

### Don't
- Include installation or setup instructions (users know how to install)
- Add "When to Use" sections in the body (that's what the description is for)
- Create superfluous files (CHANGELOG, QUICK_REFERENCE, etc.)
- Use passive voice in instructions

## Pull Request Checklist

Before submitting:

- [ ] Skill has valid YAML frontmatter with `name` and `description`
- [ ] Description clearly explains WHAT and WHEN
- [ ] Body is under 500 lines
- [ ] Body uses imperative form
- [ ] Code examples are correct and tested
- [ ] No placeholder or TODO content in assets
- [ ] Skill works independently (unless it's an agent)
- [ ] Agent lists all skill dependencies
- [ ] README.md updated with new skill/agent

## Testing Your Skill

1. Install the skill locally:
   ```bash
   cp -r skills/my-skill ~/.claude/skills/
   ```

2. Test with various prompts that should trigger it

3. Verify the output format matches the specification

4. Test edge cases (empty input, large files, etc.)

## Questions?

Open an issue for:
- Clarification on standards
- Suggestions for new skill categories
- Feedback on existing skills
