# GIGA PRD: Australia Terror Threat Level Insights Platform

## Project Vision

**Project Name:** Terror Watch Australia (TWA)
**Goal:** Provide Australians with factual, contextual information about the national terrorism threat level, enabling informed understanding rather than fear-based reactions.

**Atlas Goal Statement:**
```
Build a public information website that displays Australia's current terror threat level from nationalsecurity.gov.au, aggregates relevant news with AI-powered context and insights, and provides actionable safety guidance. Deploy to Railway with automated updates.
```

## Background & Motivation

Following the tragic Bondi incident (December 2024), there's a need for:
- **Factual information** over sensationalized news
- **Context** around what threat levels mean
- **AI-powered insights** that help people understand patterns
- **Actionable guidance** on staying safe and reporting concerns

## Data Sources

### Primary: nationalsecurity.gov.au
- **Current threat level**: PROBABLE (Level 3/5)
- **Levels**: NOT EXPECTED → POSSIBLE → PROBABLE → EXPECTED → CERTAIN
- **JSON available**: `{"ThreatLevelNo":"3","ThreatLevelName":"Probable",...}`
- **URL**: https://www.nationalsecurity.gov.au/national-threat-level/current-national-terrorism-threat-level

### Secondary: News Aggregation
- ABC News Australia (RSS)
- SBS News
- The Guardian Australia
- Sydney Morning Herald
- News.com.au
- Police media releases (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)

### Tertiary: Government Sources
- ASIO annual reports
- Home Affairs announcements
- State police updates

---

## Technical Architecture

### Stack Decision
- **Frontend**: SvelteKit (fast, SEO-friendly, works well on Railway)
- **Backend**: SvelteKit API routes + scheduled functions
- **Database**: PostgreSQL (Railway native) for caching news/history
- **AI Integration**: DeepSeek R1 via local Ollama OR Claude API for insights
- **Deployment**: Railway with auto-deploy from git

### Key Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Terror Watch Australia                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ THREAT      │  │ NEWS        │  │ AI INSIGHTS         │ │
│  │ LEVEL       │  │ AGGREGATOR  │  │ ENGINE              │ │
│  │ Display     │  │ + Timeline  │  │ (context generator) │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│  ┌──────┴────────────────┴─────────────────────┴──────────┐ │
│  │                    API Layer                           │ │
│  │  /api/threat-level  /api/news  /api/insights          │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                 │
│  ┌────────────────────────┴────────────────────────────┐   │
│  │              PostgreSQL (Railway)                    │   │
│  │  - threat_level_history                             │   │
│  │  - news_articles                                    │   │
│  │  - ai_insights                                      │   │
│  │  - user_reports (anonymous tips tracking)           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Requirements

### P0 - Must Have (MVP)

#### 1. Threat Level Display
- [ ] Scrape/fetch current threat level from nationalsecurity.gov.au
- [ ] Visual indicator (color-coded, accessible)
- [ ] Plain-language explanation of what the level means
- [ ] Last updated timestamp
- [ ] Historical chart (when level changed)

#### 2. News Aggregation
- [ ] Fetch terrorism-related news from Australian sources
- [ ] Filter by relevance (not just keyword matching)
- [ ] Chronological timeline view
- [ ] Source attribution and links to originals
- [ ] Basic categorization (incident, policy, arrest, community)

#### 3. Safety Information
- [ ] What to do in an attack (Run, Hide, Tell)
- [ ] How to report suspicious activity
- [ ] National Security Hotline: 1800 123 400
- [ ] Emergency: 000
- [ ] Mental health resources

#### 4. Basic AI Insights
- [ ] Summarize recent news into key points
- [ ] Explain context around the current threat level
- [ ] Provide factual "did you know" snippets

### P1 - Should Have

#### 5. Timeline & History
- [ ] Interactive timeline of significant events
- [ ] Threat level change history with reasons
- [ ] Pattern visualization (monthly/yearly trends)

#### 6. State-Specific Information
- [ ] Filter news by state/territory
- [ ] State-specific safety contacts
- [ ] Local community resources

#### 7. Advanced AI Analysis
- [ ] Multi-source synthesis (combine 3+ articles into one summary)
- [ ] Sentiment analysis (factual vs. sensationalized)
- [ ] Trend detection ("increased reporting on X")
- [ ] Misinformation flagging

### P2 - Nice to Have

#### 8. Community Features
- [ ] Anonymous "I saw something suspicious" logging (not sent anywhere, just personal record)
- [ ] Community preparedness checklist
- [ ] Share factual information buttons

#### 9. Notifications
- [ ] Email alerts for threat level changes
- [ ] RSS feed for updates
- [ ] Push notifications (PWA)

#### 10. Accessibility & Multi-Language
- [ ] WCAG 2.1 AA compliance
- [ ] Multiple languages (top 10 Australian languages)
- [ ] Screen reader optimized

---

## Implementation Phases

### Phase 1: Core Data Layer (Tasks 1-4)
1. Set up SvelteKit project with Railway deployment
2. Implement threat level scraper with caching
3. Create PostgreSQL schema and migrations
4. Build news RSS aggregator service

### Phase 2: Frontend MVP (Tasks 5-8)
5. Design and build threat level display component
6. Create news feed timeline component
7. Build safety information pages
8. Implement responsive mobile-first layout

### Phase 3: AI Integration (Tasks 9-11)
9. Set up AI service (DeepSeek/Claude integration)
10. Build news summarization pipeline
11. Create contextual insight generator

### Phase 4: Polish & Deploy (Tasks 12-15)
12. Add historical data visualization
13. Implement state filtering
14. Performance optimization and caching
15. Final Railway deployment and monitoring

---

## Task Breakdown for Atlas

### Task 1: Project Setup & Railway Configuration
**Priority**: P0
**Complexity**: 3/10
**Description**: Initialize SvelteKit project, configure Railway, set up CI/CD
**Acceptance Criteria**:
- [ ] `npm create svelte@latest` with TypeScript
- [ ] Railway project created with PostgreSQL addon
- [ ] Environment variables configured
- [ ] Auto-deploy on push to main branch
- [ ] Health check endpoint working

### Task 2: Database Schema & Migrations
**Priority**: P0
**Complexity**: 4/10
**Description**: Design and implement PostgreSQL schema
**Acceptance Criteria**:
- [ ] Schema includes: threat_levels, news_articles, ai_insights, sources
- [ ] Migrations work with Railway PostgreSQL
- [ ] Seed data for threat level history
- [ ] Indexes on common queries

### Task 3: Threat Level Scraper Service
**Priority**: P0
**Complexity**: 5/10
**Description**: Fetch and parse threat level from government site
**Acceptance Criteria**:
- [ ] Scrapes https://www.nationalsecurity.gov.au/national-threat-level/current-national-terrorism-threat-level
- [ ] Extracts JSON `{"ThreatLevelNo":"3","ThreatLevelName":"Probable",...}`
- [ ] Caches result (1 hour TTL)
- [ ] Stores history when level changes
- [ ] Error handling for site downtime

### Task 4: News Aggregator Service
**Priority**: P0
**Complexity**: 6/10
**Description**: Aggregate news from multiple Australian sources
**Acceptance Criteria**:
- [ ] RSS feeds from ABC, SBS, Guardian AU, SMH
- [ ] Keyword filtering: terrorism, terror, security threat, ASIO, etc.
- [ ] Deduplication by headline similarity
- [ ] Categorization: incident, arrest, policy, community
- [ ] Scheduled refresh (every 30 minutes)

### Task 5: Threat Level Display Component
**Priority**: P0
**Complexity**: 4/10
**Description**: Visual component showing current threat level
**Acceptance Criteria**:
- [ ] Color-coded indicator (green→yellow→orange→red→purple)
- [ ] Accessible (colorblind-friendly with patterns/icons)
- [ ] Plain-language description
- [ ] "Last checked" timestamp
- [ ] Links to official source

### Task 6: News Timeline Component
**Priority**: P0
**Complexity**: 5/10
**Description**: Chronological display of terrorism-related news
**Acceptance Criteria**:
- [ ] Timeline view with date grouping
- [ ] Article cards with title, source, date, category
- [ ] Click to read full article (external link)
- [ ] Infinite scroll or pagination
- [ ] Filters by category and date range

### Task 7: Safety Information Pages
**Priority**: P0
**Complexity**: 3/10
**Description**: Static pages with safety guidance
**Acceptance Criteria**:
- [ ] "What to do in an attack" (Run, Hide, Tell)
- [ ] "Report suspicious activity" with hotline
- [ ] "Understanding threat levels" explainer
- [ ] "Mental health resources" after incidents
- [ ] Emergency contacts prominently displayed

### Task 8: Responsive Layout & Design System
**Priority**: P0
**Complexity**: 5/10
**Description**: Mobile-first responsive design
**Acceptance Criteria**:
- [ ] Mobile, tablet, desktop breakpoints
- [ ] Consistent color scheme (calming, not alarmist)
- [ ] Typography hierarchy
- [ ] Component library (buttons, cards, badges)
- [ ] Dark mode support

### Task 9: AI Service Integration
**Priority**: P1
**Complexity**: 7/10
**Description**: Connect to AI for news analysis
**Acceptance Criteria**:
- [ ] DeepSeek R1 via Ollama OR Claude API
- [ ] Rate limiting and cost management
- [ ] Response caching (24 hour for insights)
- [ ] Fallback to cached insights if AI unavailable
- [ ] Structured output parsing

### Task 10: News Summarization Pipeline
**Priority**: P1
**Complexity**: 6/10
**Description**: AI-powered news summarization
**Acceptance Criteria**:
- [ ] Batch process new articles
- [ ] Generate 2-3 sentence summaries
- [ ] Extract key facts and entities
- [ ] Flag potential misinformation/sensationalism
- [ ] Store summaries in database

### Task 11: Contextual Insight Generator
**Priority**: P1
**Complexity**: 7/10
**Description**: Generate contextual insights about threat level
**Acceptance Criteria**:
- [ ] Daily insight refresh
- [ ] Combines threat level + recent news + historical context
- [ ] Provides "what this means for you" explanations
- [ ] Avoids alarmist language
- [ ] Sources all claims

### Task 12: Historical Data Visualization
**Priority**: P1
**Complexity**: 5/10
**Description**: Charts showing threat level and incident history
**Acceptance Criteria**:
- [ ] Line chart of threat level over time
- [ ] Event markers for significant incidents
- [ ] Trend indicators
- [ ] Accessible alternatives (data tables)
- [ ] Interactive tooltips

### Task 13: State/Territory Filtering
**Priority**: P2
**Complexity**: 4/10
**Description**: Filter content by Australian state
**Acceptance Criteria**:
- [ ] State selector in header/sidebar
- [ ] News filtered by location keywords
- [ ] State-specific contacts and resources
- [ ] Remembers preference (localStorage)

### Task 14: Performance Optimization
**Priority**: P0
**Complexity**: 5/10
**Description**: Optimize for fast load times
**Acceptance Criteria**:
- [ ] Lighthouse score 90+ on all metrics
- [ ] Edge caching with Railway
- [ ] Image optimization
- [ ] Bundle size analysis and tree-shaking
- [ ] Service worker for offline access

### Task 15: Monitoring & Alerting
**Priority**: P1
**Complexity**: 4/10
**Description**: Set up production monitoring
**Acceptance Criteria**:
- [ ] Health check endpoint
- [ ] Error tracking (Sentry or similar)
- [ ] Uptime monitoring
- [ ] Alert for threat level changes
- [ ] Basic analytics (privacy-respecting)

---

## Non-Functional Requirements

### Performance
- Initial load < 3 seconds
- Time to interactive < 2 seconds
- API responses < 500ms

### Security
- HTTPS everywhere
- No user PII collected
- Content Security Policy headers
- Rate limiting on API endpoints

### Availability
- 99.9% uptime target
- Graceful degradation if AI unavailable
- Cached fallbacks for all data

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader compatible
- Sufficient color contrast

---

## Success Metrics

1. **Information Quality**: User feedback on helpfulness
2. **Accuracy**: Zero false information; all claims sourced
3. **Performance**: Sub-3-second load times
4. **Usage**: Track pageviews (privacy-respecting)
5. **Community Impact**: Social shares of factual content

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Government site structure changes | Monitor for changes; fallback to manual updates |
| AI generates inaccurate content | Human review pipeline; clear "AI-generated" labels |
| Site seen as official government site | Clear disclaimer; different branding |
| Overwhelming traffic during incident | Railway auto-scaling; aggressive caching |
| Legal concerns | Attribute all sources; no original reporting |

---

## Timeline

- **Week 1**: Tasks 1-4 (Core infrastructure)
- **Week 2**: Tasks 5-8 (Frontend MVP)
- **Week 3**: Tasks 9-11 (AI integration)
- **Week 4**: Tasks 12-15 (Polish and deploy)

**Atlas Execution Mode**: Parallel worktree agents, 3-5 concurrent tasks per wave.

---

## Appendix: Threat Level Reference

| Level | Name | Meaning |
|-------|------|---------|
| 1 | NOT EXPECTED | No current threat |
| 2 | POSSIBLE | Attack possible but not expected |
| 3 | **PROBABLE** ← Current | Attack likely (>50% chance in 12 months) |
| 4 | EXPECTED | Attack likely in near term |
| 5 | CERTAIN | Attack imminent |

---

## Ready for Atlas

**Atlas Goal**:
```
Build Terror Watch Australia: a SvelteKit website displaying Australia's current terror threat level, aggregating relevant news with AI insights, and providing safety guidance. Deploy to Railway with automated updates and monitoring.
```

**First Wave Tasks**: 1, 2, 3, 4 (infrastructure)
**Second Wave Tasks**: 5, 6, 7, 8 (frontend)
**Third Wave Tasks**: 9, 10, 11 (AI)
**Final Wave Tasks**: 12, 13, 14, 15 (polish)
