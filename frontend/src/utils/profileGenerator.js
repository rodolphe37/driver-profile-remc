// Profile Generation Logic
import { remcData, profileData, objectifsTemplates } from '../remcData';

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a weighted status based on hours and competency level
const generateStatus = (hours, competencyLevel, subCompIndex, totalSubs) => {
  // Base probabilities adjusted by hours and position in curriculum
  const progressFactor = hours / 30; // Normalized progress (0 to ~1.5 for 40h+)
  const curriculumPosition = subCompIndex / totalSubs;
  
  // Earlier competencies in lower levels should be stronger
  let strongProb, mediumProb;
  
  if (competencyLevel === 1) { // C1
    strongProb = Math.min(0.8, progressFactor * 0.9 - curriculumPosition * 0.2);
    mediumProb = 0.6;
  } else if (competencyLevel === 2) { // C2
    strongProb = Math.min(0.7, (progressFactor - 0.3) * 0.8 - curriculumPosition * 0.15);
    mediumProb = 0.5;
  } else if (competencyLevel === 3) { // C3
    strongProb = Math.min(0.5, (progressFactor - 0.5) * 0.7 - curriculumPosition * 0.1);
    mediumProb = 0.4;
  } else { // C4
    strongProb = Math.min(0.4, (progressFactor - 0.7) * 0.6);
    mediumProb = 0.35;
  }
  
  const rand = Math.random();
  if (rand < strongProb) return 'fort';
  if (rand < strongProb + mediumProb) return 'moyen';
  return 'faible';
};

// Generate evaluation for all competencies
const generateEvaluation = (hours) => {
  const evaluation = {};
  const competencies = ['c1', 'c2', 'c3', 'c4'];
  
  competencies.forEach((compId, compIndex) => {
    const comp = remcData[compId];
    evaluation[compId] = {
      id: compId,
      name: comp.name,
      title: comp.title,
      subCompetencies: comp.subCompetencies.map((sub, subIndex) => ({
        ...sub,
        status: generateStatus(hours, compIndex + 1, subIndex, comp.subCompetencies.length),
        covered: hours > (compIndex * 8 + subIndex * 1.5) // Progressive unlocking
      }))
    };
  });
  
  return evaluation;
};

// Find weak competencies for pedagogical objectives
const findWeakCompetencies = (evaluation) => {
  const weak = [];
  Object.values(evaluation).forEach(comp => {
    comp.subCompetencies.forEach(sub => {
      if (sub.covered && (sub.status === 'faible' || sub.status === 'moyen')) {
        weak.push({
          competencyId: comp.id,
          competencyName: comp.name,
          subCompetency: sub,
          priority: sub.status === 'faible' ? 1 : 2
        });
      }
    });
  });
  return weak.sort((a, b) => a.priority - b.priority);
};

// Generate pedagogical objectives
const generateObjectives = (evaluation) => {
  const weakComps = findWeakCompetencies(evaluation);
  const objectives = [];
  
  // Take top 3 weak competencies
  const topWeak = weakComps.slice(0, 3);
  
  topWeak.forEach(item => {
    const template = objectifsTemplates[item.competencyId]?.[item.subCompetency.code];
    if (template) {
      objectives.push({
        competency: item.competencyName,
        subCompetency: item.subCompetency.code.toUpperCase(),
        title: item.subCompetency.title,
        objective: template,
        priority: item.priority === 1 ? 'Prioritaire' : 'À consolider'
      });
    }
  });
  
  return objectives;
};

// Generate course history
const generateCourseHistory = (hours, enrollmentDate) => {
  const hasSimulator = Math.random() > 0.4;
  const simulatorHours = hasSimulator ? randomInt(2, Math.min(10, Math.floor(hours * 0.3))) : 0;
  const realHours = hours - simulatorHours;
  
  // Calculate last lesson date (recent)
  const now = new Date();
  const daysSinceLastLesson = randomInt(1, 14);
  const lastLessonDate = new Date(now.getTime() - daysSinceLastLesson * 24 * 60 * 60 * 1000);
  
  return {
    totalHours: hours,
    realDrivingHours: realHours,
    simulatorHours: simulatorHours,
    hasSimulator: hasSimulator,
    enrollmentDate: enrollmentDate,
    lastLessonDate: lastLessonDate.toISOString().split('T')[0],
    vehicule: randomElement(profileData.vehicules),
    hasAAC: Math.random() > 0.85, // 15% chance of AAC
    hasLicense: false, // Learning, so no license yet
    lastContext: randomElement(profileData.contextes_conduite),
    studentFeedback: randomElement(profileData.retours_eleve)
  };
};

// Main profile generation function
export const generateProfile = () => {
  // Basic info
  const isFemale = Math.random() > 0.5;
  const gender = isFemale ? 'feminin' : 'masculin';
  const prenom = randomElement(profileData.prenoms[gender]);
  const nom = randomElement(profileData.noms);
  const age = randomInt(16, 25);
  
  // Determine hours based on age and some randomness
  // Younger students typically have fewer hours
  let baseHours;
  if (age <= 17) {
    baseHours = randomInt(5, 25);
  } else if (age <= 20) {
    baseHours = randomInt(10, 35);
  } else {
    baseHours = randomInt(8, 45);
  }
  
  // Enrollment date calculation
  const weeksOfTraining = Math.ceil(baseHours / 2);
  const enrollmentDate = new Date();
  enrollmentDate.setDate(enrollmentDate.getDate() - weeksOfTraining * 7 - randomInt(0, 30));
  
  // Siblings
  const siblings = randomInt(0, 4);
  const siblingsText = siblings === 0 ? "Enfant unique" : 
                       siblings === 1 ? "1 frère/sœur" : 
                       `${siblings} frères/sœurs`;
  
  // Driver's license status
  const hasDriverLicense = false; // Still learning
  
  // Hobbies (2-3 random)
  const hobbies = randomElements(profileData.hobbies, randomInt(2, 3));
  
  // Special needs (80% chance of none)
  const besoinSpecial = Math.random() > 0.8 ? 
    randomElement(profileData.besoins_speciaux.filter(b => b !== null)) : null;
  
  // Generate evaluation based on hours
  const evaluation = generateEvaluation(baseHours);
  
  // Generate pedagogical objectives
  const objectifs = generateObjectives(evaluation);
  
  // Generate course history
  const courseHistory = generateCourseHistory(baseHours, enrollmentDate.toISOString().split('T')[0]);
  
  // Calculate covered competencies count
  let coveredCount = 0;
  let totalCount = 0;
  Object.values(evaluation).forEach(comp => {
    comp.subCompetencies.forEach(sub => {
      totalCount++;
      if (sub.covered) coveredCount++;
    });
  });
  
  return {
    id: `STU-${Date.now()}`,
    prenom,
    nom,
    nomComplet: `${prenom} ${nom}`,
    age,
    genre: isFemale ? 'Femme' : 'Homme',
    occupation: randomElement(profileData.occupations),
    hobbies,
    siblings: siblingsText,
    hasDriverLicense,
    mobilite: randomElement(profileData.mobilite),
    professionMere: randomElement(profileData.professions_parents),
    professionPere: randomElement(profileData.professions_parents),
    besoinSpecial,
    motivation: randomElement(profileData.motivations),
    lieuResidence: randomElement(profileData.lieux_residence),
    courseHistory,
    evaluation,
    objectifs,
    progression: {
      covered: coveredCount,
      total: totalCount,
      percentage: Math.round((coveredCount / totalCount) * 100)
    },
    generatedAt: new Date().toISOString()
  };
};

export default generateProfile;
