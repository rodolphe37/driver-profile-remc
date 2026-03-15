// Profile Generation Logic
import { remcData, profileData, objectifsTemplates } from '../remcData';

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Determine current competency level based on hours
const getCurrentCompetencyLevel = (hours) => {
  if (hours <= 11) return 1; // C1: 0-11h
  if (hours <= 15) return 2; // C2: 12-15h
  if (hours <= 20) return 3; // C3: 16-20h
  return 4; // C4: 20h+
};

// Get appropriate driving contexts based on competency level
const getContextsForLevel = (level) => {
  const contexts = {
    1: [ // C1 contexts - parking, quiet areas
      "Parking auto-école",
      "Quartier calme",
      "Zone résidentielle calme",
      "Parking de supermarché (vide)",
      "Route de campagne peu fréquentée"
    ],
    2: [ // C2 contexts - normal city driving
      "Centre-ville",
      "Zone commerciale",
      "Quartier résidentiel",
      "Rond-point simple",
      "Route départementale",
      "Zone 30"
    ],
    3: [ // C3 contexts - difficult conditions
      "Périphérique",
      "Voie rapide",
      "Circulation dense",
      "Route de montagne",
      "Nuit en agglomération",
      "Pluie légère",
      "Rond-point complexe",
      "Zone industrielle"
    ],
    4: [ // C4 contexts - autonomous driving
      "Itinéraire inconnu",
      "Trajet longue distance",
      "Autoroute",
      "Conditions variées",
      "Navigation autonome",
      "Éco-conduite en ville",
      "Pluie forte",
      "Nuit sur route"
    ]
  };
  return contexts[level] || contexts[1];
};

// Get appropriate student feedback based on level
const getFeedbackForLevel = (level) => {
  const feedback = {
    1: [
      "Je me suis senti(e) à l'aise pour démarrer aujourd'hui",
      "J'ai encore du mal avec l'embrayage",
      "Les manœuvres de volant s'améliorent",
      "Je dois travailler mes rétros",
      "Je progresse sur les démarrages",
      "La coordination pédale/volant est difficile",
      "Je commence à bien gérer les vitesses",
      "La marche arrière me stresse encore"
    ],
    2: [
      "J'ai mieux géré ma vitesse en ville",
      "Les ronds-points me stressent encore",
      "J'ai bien anticipé les priorités",
      "Je dois améliorer mon positionnement",
      "Je suis plus confiant(e) en ville",
      "Les créneaux restent difficiles",
      "J'ai bien réagi aux feux tricolores",
      "Je me suis trompé(e) de voie"
    ],
    3: [
      "J'ai eu peur lors d'un dépassement",
      "La circulation dense me stresse",
      "J'ai bien géré l'insertion sur le périphérique",
      "Les distances de sécurité sont plus claires",
      "La conduite de nuit m'inquiète",
      "Je gère mieux les virages serrés",
      "Le croisement avec les camions est stressant",
      "J'ai bien anticipé les deux-roues"
    ],
    4: [
      "J'ai réussi à suivre l'itinéraire seul(e)",
      "Le GPS m'a bien aidé(e)",
      "Je me sens prêt(e) pour l'examen",
      "L'éco-conduite devient naturelle",
      "J'ai bien géré un imprévu sur la route",
      "La conduite autonome me plaît",
      "J'ai fait une belle séance aujourd'hui",
      "Le moniteur était content de moi"
    ]
  };
  return feedback[level] || feedback[1];
};

// Generate a weighted status based on hours and competency level
const generateStatus = (hours, competencyIndex, subCompIndex, currentLevel) => {
  // If this competency level is higher than current level, not covered at all
  if (competencyIndex + 1 > currentLevel) {
    return { status: null, covered: false };
  }
  
  // Calculate how much of this competency should be covered
  const compLevel = competencyIndex + 1;
  const subCount = remcData[`c${compLevel}`].subCompetencies.length;
  
  // For current level, partially covered based on progress within that level
  if (compLevel === currentLevel) {
    // Calculate progress within current level
    let progressInLevel;
    if (currentLevel === 1) {
      progressInLevel = hours / 11;
    } else if (currentLevel === 2) {
      progressInLevel = (hours - 11) / 4; // 12-15h = 4h range
    } else if (currentLevel === 3) {
      progressInLevel = (hours - 15) / 5; // 16-20h = 5h range
    } else {
      progressInLevel = Math.min(1, (hours - 20) / 10); // 21-30h
    }
    
    // Determine if this sub-competency is covered
    const coveredThreshold = (subCompIndex + 1) / subCount;
    const covered = progressInLevel >= coveredThreshold * 0.8;
    
    if (!covered) {
      return { status: null, covered: false };
    }
    
    // For covered sub-competencies in current level, mostly medium or weak
    const rand = Math.random();
    if (rand < 0.2) return { status: 'fort', covered: true };
    if (rand < 0.6) return { status: 'moyen', covered: true };
    return { status: 'faible', covered: true };
  }
  
  // For previous levels (compLevel < currentLevel), should be mostly mastered
  const levelDifference = currentLevel - compLevel;
  
  // The older the competency, the more likely it's strong
  const strongProb = Math.min(0.8, 0.4 + (levelDifference * 0.2));
  const mediumProb = 0.4 - (levelDifference * 0.1);
  
  const rand = Math.random();
  if (rand < strongProb) return { status: 'fort', covered: true };
  if (rand < strongProb + mediumProb) return { status: 'moyen', covered: true };
  return { status: 'faible', covered: true };
};

// Generate evaluation for all competencies
const generateEvaluation = (hours) => {
  const evaluation = {};
  const competencies = ['c1', 'c2', 'c3', 'c4'];
  const currentLevel = getCurrentCompetencyLevel(hours);
  
  competencies.forEach((compId, compIndex) => {
    const comp = remcData[compId];
    evaluation[compId] = {
      id: compId,
      name: comp.name,
      title: comp.title,
      subCompetencies: comp.subCompetencies.map((sub, subIndex) => {
        const result = generateStatus(hours, compIndex, subIndex, currentLevel);
        return {
          ...sub,
          status: result.status,
          covered: result.covered
        };
      })
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
const generateCourseHistory = (hours, enrollmentDate, currentLevel) => {
  const hasSimulator = Math.random() > 0.4;
  const simulatorHours = hasSimulator ? randomInt(2, Math.min(10, Math.floor(hours * 0.3))) : 0;
  const realHours = hours - simulatorHours;
  
  // Calculate last lesson date (recent)
  const now = new Date();
  const daysSinceLastLesson = randomInt(1, 14);
  const lastLessonDate = new Date(now.getTime() - daysSinceLastLesson * 24 * 60 * 60 * 1000);
  
  // Get context appropriate for current level
  const contexts = getContextsForLevel(currentLevel);
  const feedbacks = getFeedbackForLevel(currentLevel);
  
  // Get current competency info
  const currentCompId = `c${currentLevel}`;
  const currentComp = remcData[currentCompId];
  
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
    lastContext: randomElement(contexts),
    studentFeedback: randomElement(feedbacks),
    currentCompetency: {
      id: currentCompId,
      name: currentComp.name,
      title: currentComp.title
    },
    currentLevel: currentLevel
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
  // Generate hours across a wider range to test all competency levels
  let baseHours;
  const levelRoll = Math.random();
  if (levelRoll < 0.25) {
    // C1 level: 5-11 hours
    baseHours = randomInt(5, 11);
  } else if (levelRoll < 0.50) {
    // C2 level: 12-15 hours
    baseHours = randomInt(12, 15);
  } else if (levelRoll < 0.75) {
    // C3 level: 16-20 hours
    baseHours = randomInt(16, 20);
  } else {
    // C4 level: 21-35 hours
    baseHours = randomInt(21, 35);
  }
  
  // Get current competency level
  const currentLevel = getCurrentCompetencyLevel(baseHours);
  
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
  
  // Generate course history with current level context
  const courseHistory = generateCourseHistory(baseHours, enrollmentDate.toISOString().split('T')[0], currentLevel);
  
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
      percentage: Math.round((coveredCount / totalCount) * 100),
      currentLevel: currentLevel
    },
    generatedAt: new Date().toISOString()
  };
};

export default generateProfile;
