# Task 3: Threat Level Scraper Service

## Context
- Project: Terror Watch Australia
- Location: /home/anombyte/Projects/in-progress/terror
- Reference: GIGA_PRD.md
- Key URL: https://www.nationalsecurity.gov.au/national-threat-level/current-national-terrorism-threat-level

## Goal
Create a service that scrapes the current terrorism threat level from the official government website.

## Key Discovery
The government page contains embedded JSON data:
```json
{"ThreatLevelNo":"3","ThreatLevelName":"Probable","ThreatLevelDesc":"Australia's general terrorism threat level is PROBABLE — there is a greater than fifty per cent chance of an onshore attack or attack planning in the next twelve months","ThreatLevelLink":"/national-threat-level/current-national-terrorism-threat-level"}
```

## Requirements
1. Create service at `src/lib/server/services/threat-scraper.ts`:
   - Function `fetchThreatLevel()` that:
     - Fetches the HTML from the government URL
     - Extracts the JSON data using regex or cheerio
     - Parses and validates with Zod
     - Returns typed threat level object
   - Function `getThreatLevel()` that:
     - Checks cache (in-memory or database)
     - If cache expired (>1 hour), fetches fresh
     - Stores new level in database if changed
     - Returns cached or fresh data

2. Create Zod schema for threat level:
```typescript
const ThreatLevelSchema = z.object({
  ThreatLevelNo: z.string().transform(Number),
  ThreatLevelName: z.string(),
  ThreatLevelDesc: z.string(),
  ThreatLevelLink: z.string()
});
```

3. Create API endpoint `src/routes/api/threat-level/+server.ts`:
   - GET returns current threat level
   - Includes cache headers
   - Returns error gracefully if scrape fails

4. Add error handling:
   - Retry logic (3 attempts with backoff)
   - Fallback to last known level
   - Logging for failures

5. Add types in `src/lib/types/threat.ts`

## Test Data (Current as of Dec 2024)
```json
{
  "level": 3,
  "name": "PROBABLE",
  "description": "greater than fifty per cent chance of an onshore attack or attack planning in the next twelve months"
}
```

## Acceptance Criteria
- [ ] `GET /api/threat-level` returns valid JSON
- [ ] Response cached for 1 hour
- [ ] Handles government site downtime gracefully
- [ ] Logs when threat level changes
- [ ] TypeScript types exported

## On Completion
1. Test with `curl http://localhost:5173/api/threat-level`
2. Verify response matches expected schema
3. Commit: "Task 3: Threat level scraper service"
4. Create `.sprint-complete.json`
