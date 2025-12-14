# Atlas Goal: Terror Watch Australia

## One-Line Goal
```
Build Terror Watch Australia: a SvelteKit website displaying Australia's current terror threat level, aggregating relevant news with AI insights, and providing safety guidance. Deploy to Railway.
```

## Why This Matters

You mentioned wanting to help people form their own opinions with factual information after the Bondi tragedy. This project:

1. **Provides Facts**: Pulls the actual threat level from the official government source
2. **Aggregates Context**: Gathers news from multiple Australian sources
3. **Adds AI Insights**: Helps interpret what's happening without sensationalism
4. **Empowers Action**: Shows people what they can do (report, stay safe, stay informed)

## Key Discovery

The government site includes a **JSON data block** with the threat level:
```json
{"ThreatLevelNo":"3","ThreatLevelName":"Probable","ThreatLevelDesc":"..."}
```

Current level: **PROBABLE** (Level 3/5) - "greater than fifty per cent chance of an onshore attack or attack planning in the next twelve months"

## Architecture Summary

- **Frontend**: SvelteKit (fast, SEO-friendly)
- **Database**: PostgreSQL on Railway (free tier works)
- **AI**: DeepSeek R1 via Ollama or Claude API
- **Deployment**: Railway with auto-deploy

## Task Count

15 tasks across 4 waves:
- Wave 1 (Infrastructure): 4 tasks
- Wave 2 (Frontend MVP): 4 tasks
- Wave 3 (AI Integration): 3 tasks
- Wave 4 (Polish): 4 tasks

## To Start Atlas

Run this command:
```bash
/atlas "Build Terror Watch Australia: a SvelteKit website displaying Australia's current terror threat level, aggregating relevant news with AI insights, and providing safety guidance. Deploy to Railway." --prd ./GIGA_PRD.md
```

Or manually:
1. `git checkout -b feature/terror-watch-mvp`
2. `/worktree-orchestrate` with the prompts
3. Let agents execute

## Files Created

- `GIGA_PRD.md` - Full project requirements document
- `ATLAS_GOAL.md` - This file

## Disclaimers for the Website

The site should clearly state:
- "This is NOT an official government website"
- "Information is aggregated from public sources"
- "For emergencies call 000"
- "AI-generated summaries may contain errors"

---

Ready to proceed with `/atlas` when you are.
