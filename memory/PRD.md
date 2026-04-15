# PRD: Student Profile Generator for TPECSR Training

## Original Problem Statement
Create a React + TypeScript application that generates realistic fictitious student profiles based on the REMC program (C1‑C4 and their sub-competencies) for driving school training.

## User Personas
- **Primary**: Driving school instructors and trainers using the TPECSR system in France
- **Secondary**: Auto-école administrators preparing training materials

## Core Requirements (Static)
1. French language UI matching REMC documentation
2. Light mode with modern gradient style
3. No database - frontend-only application
4. All 32 sub-competencies across C1-C4 competencies from REMC
5. Weighted/realistic profile generation based on driving hours
6. Coherent progression: competencies unlocked based on hours

## What's Been Implemented (January-February 2026)

### Features Completed:
- **Profile Generation**: Randomized but weighted student profiles
- **Level Selector**: Choose specific competency level (C1, C2, C3, C4 or Aléatoire)
- **Advancement Selector**: Choose progression stage (Début, Milieu, Fin de compétence)
- **Course History**: Total driving hours, simulator hours, enrollment/last lesson dates
- **Competency Evaluation Grid**: All 4 competencies with 32 sub-competencies, color-coded
- **Coherent Progression**: 
  - C1: 0-11h (parking, quiet areas)
  - C2: 12-15h (city, normal traffic)
  - C3: 16-20h (difficult conditions, highway)
  - C4: 21h+ (autonomous driving)
- **Pedagogical Objectives**: Auto-generated objectives based on weak competencies
- **Occupations cohérentes avec l'âge**: Lycée (15-18), Licence (18-21), Master (21-23), Doctorat/Métier (24+)
- **AAC (Conduite Accompagnée)**: Badge conditionnel pour élèves de 15-17 ans uniquement
- **Besoin spécifique**: Apparaît rarement (~10% des profils) pour plus de réalisme

### Hour Ranges by Level & Advancement:
| Level | Début | Milieu | Fin |
|-------|-------|--------|-----|
| C1    | 3-5h  | 6-8h   | 9-11h |
| C2    | 12h   | 13-14h | 15h |
| C3    | 16-17h| 18-19h | 20h |
| C4    | 21-24h| 25-30h | 31-40h |

### Files:
- `/app/frontend/src/remcData.js` - REMC data structure
- `/app/frontend/src/utils/profileGenerator.js` - Profile generation with level/advancement logic
- `/app/frontend/src/components/ProfileGenerator.js` - Level & Advancement selectors
- `/app/frontend/src/components/ProfileDisplay.js`
- `/app/frontend/src/components/CourseHistory.js`
- `/app/frontend/src/components/CompetencyGrid.js`
- `/app/frontend/src/components/PedagogicalObjective.js`

## Prioritized Backlog

### P0 (Critical) - None remaining

### P1 (Important)
- Export profiles as PDF for printing
- Save/load profiles to localStorage
- Profile comparison feature

### P2 (Nice to Have)
- Dark mode toggle
- Multiple language support
- Print-optimized view

## Next Tasks
1. Add profile export feature (PDF/JSON)
2. Implement localStorage persistence
3. Add profile history/comparison feature
