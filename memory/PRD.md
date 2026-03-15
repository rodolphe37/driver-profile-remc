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

## What's Been Implemented (January 2026)

### Features Completed:
- **Profile Generation**: Randomized but weighted student profiles with personal info (age 16-25, occupation, hobbies, siblings, mobility, parents' professions, special needs, motivation, residence)
- **Course History**: Total driving hours, simulator hours, enrollment/last lesson dates, vehicle used, context, student feedback
- **Competency Evaluation Grid**: All 4 competencies (C1-C4) with 32 sub-competencies, color-coded (Blue/Emerald/Amber/Purple), expandable cards
- **Status System**: Fort/Moyen/Faible/Non abordé status badges with visual indicators
- **Pedagogical Objectives**: Auto-generated objectives based on weak competencies
- **Toast Notifications**: Success feedback on profile generation
- **Responsive Design**: Works on desktop and mobile

### Files Created:
- `/app/frontend/src/remcData.js` - REMC data structure with all competencies
- `/app/frontend/src/utils/profileGenerator.js` - Profile generation logic
- `/app/frontend/src/components/ProfileGenerator.js`
- `/app/frontend/src/components/ProfileDisplay.js`
- `/app/frontend/src/components/CourseHistory.js`
- `/app/frontend/src/components/CompetencyGrid.js`
- `/app/frontend/src/components/PedagogicalObjective.js`

## Prioritized Backlog

### P0 (Critical) - None remaining

### P1 (Important)
- Export profiles as PDF for printing
- Save/load profiles to localStorage
- Profile comparison feature (compare 2 students)

### P2 (Nice to Have)
- Dark mode toggle
- Multiple language support (English)
- Print-optimized view
- Animation preferences (reduce motion option)

## Next Tasks
1. Add profile export feature (PDF/JSON)
2. Implement localStorage persistence for generated profiles
3. Add profile history/comparison feature
