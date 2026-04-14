// Profile Generation Logic
import { remcData, profileData, objectifsTemplates } from '../remcData';

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomElements = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Trap/Error definitions for role-play exercises
const trapDefinitions = {
  coordination: {
    id: 'coordination',
    label: 'Coordination',
    description: 'Difficulté à coordonner les pieds (embrayage/accélérateur) et les mains (volant/levier de vitesse)',
    symptoms: [
      'Cale fréquemment au démarrage',
      'Accélérations saccadées',
      'Difficulté à passer les vitesses en douceur',
      'Mouvements désynchronisés'
    ],
    affectedCompetencies: ['c1d', 'c1e', 'c1f'],
    levels: [1, 2]
  },
  commandes: {
    id: 'commandes',
    label: 'Commandes',
    description: 'Confusion entre les différentes commandes du véhicule',
    symptoms: [
      'Confond les pédales (frein/accélérateur)',
      'Cherche les commandes (clignotants, essuie-glaces)',
      'Oublie de desserrer le frein à main',
      'Erreur de manipulation des feux'
    ],
    affectedCompetencies: ['c1a', 'c1b', 'c1h'],
    levels: [1]
  },
  volant: {
    id: 'volant',
    label: 'Volant',
    description: 'Problèmes de tenue et de maniement du volant',
    symptoms: [
      'Trajectoire en zigzag',
      'Sur-braquage dans les virages',
      'Sous-braquage en courbe',
      'Mauvais placement des mains',
      'Croisement des mains inadapté'
    ],
    affectedCompetencies: ['c1c', 'c1g', 'c1i'],
    levels: [1, 2]
  },
  observation: {
    id: 'observation',
    label: 'Observation',
    description: 'Défaut de contrôle visuel et de prise d\'information',
    symptoms: [
      'Oublie de regarder les rétroviseurs',
      'Ne contrôle pas les angles morts',
      'Regard fixé sur le capot',
      'Ne détecte pas la signalisation'
    ],
    affectedCompetencies: ['c1h', 'c2a', 'c3a'],
    levels: [1, 2, 3]
  },
  vitesse: {
    id: 'vitesse',
    label: 'Vitesse',
    description: 'Difficulté à adapter et doser la vitesse',
    symptoms: [
      'Roule trop vite pour la situation',
      'Roule trop lentement (gêne la circulation)',
      'Freinages brusques et tardifs',
      'Accélérations inadaptées'
    ],
    affectedCompetencies: ['c1e', 'c2c', 'c3a'],
    levels: [2, 3]
  },
  stress: {
    id: 'stress',
    label: 'Stress',
    description: 'Blocage lié au stress et à l\'anxiété',
    symptoms: [
      'Se fige dans les situations complexes',
      'Panique aux intersections',
      'Perd ses moyens en présence d\'autres véhicules',
      'Respiration saccadée, mains crispées'
    ],
    affectedCompetencies: ['c2d', 'c3b', 'c3f'],
    levels: [2, 3, 4]
  }
};

// Get a trap based on selection, current level, and covered competencies
const getTrap = (trapSelection, currentLevel, evaluation) => {
  if (trapSelection === 'none') return null;
  
  // Get list of covered sub-competencies
  const coveredSubComps = new Set();
  Object.values(evaluation).forEach(comp => {
    comp.subCompetencies.forEach(sub => {
      if (sub.covered) {
        coveredSubComps.add(sub.id);
      }
    });
  });
  
  // Filter traps to only those whose affected competencies are covered
  const filterTrapByCoverage = (trap) => {
    // Check if at least one affected competency is covered
    return trap.affectedCompetencies.some(compId => coveredSubComps.has(compId));
  };
  
  if (trapSelection === 'random') {
    // Filter traps that are valid for the current level AND have covered competencies
    const validTraps = Object.values(trapDefinitions).filter(trap => 
      trap.levels.includes(currentLevel) && filterTrapByCoverage(trap)
    );
    if (validTraps.length === 0) return null;
    
    const selectedTrap = validTraps[Math.floor(Math.random() * validTraps.length)];
    // Filter affected competencies to only show covered ones
    return {
      ...selectedTrap,
      affectedCompetencies: selectedTrap.affectedCompetencies.filter(compId => coveredSubComps.has(compId))
    };
  }
  
  const trap = trapDefinitions[trapSelection];
  // Return trap only if it's valid for the current level AND has covered competencies
  if (trap && trap.levels.includes(currentLevel) && filterTrapByCoverage(trap)) {
    // Filter affected competencies to only show covered ones
    return {
      ...trap,
      affectedCompetencies: trap.affectedCompetencies.filter(compId => coveredSubComps.has(compId))
    };
  }
  return null;
};

// Determine current competency level based on hours
const getCurrentCompetencyLevel = (hours) => {
  if (hours <= 11) return 1; // C1: 0-11h
  if (hours <= 15) return 2; // C2: 12-15h
  if (hours <= 20) return 3; // C3: 16-20h
  return 4; // C4: 20h+
};

// Get hours range for a specific level and advancement
const getHoursForLevelAndAdvancement = (level, advancement) => {
  const ranges = {
    1: { // C1: 0-11h
      debut: { min: 3, max: 5 },
      milieu: { min: 6, max: 8 },
      fin: { min: 9, max: 11 },
      random: { min: 3, max: 11 }
    },
    2: { // C2: 12-15h
      debut: { min: 12, max: 12 },
      milieu: { min: 13, max: 14 },
      fin: { min: 15, max: 15 },
      random: { min: 12, max: 15 }
    },
    3: { // C3: 16-20h
      debut: { min: 16, max: 17 },
      milieu: { min: 18, max: 19 },
      fin: { min: 20, max: 20 },
      random: { min: 16, max: 20 }
    },
    4: { // C4: 21h+
      debut: { min: 21, max: 24 },
      milieu: { min: 25, max: 30 },
      fin: { min: 31, max: 40 },
      random: { min: 21, max: 40 }
    }
  };
  
  const levelRange = ranges[level] || ranges[1];
  const advRange = levelRange[advancement] || levelRange.random;
  return randomInt(advRange.min, advRange.max);
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
export const generateProfile = (options = {}) => {
  const { level = null, advancement = 'random', gender = 'random', trap = 'none' } = options;
  
  // Determine gender
  let isFemale;
  if (gender === 'femme') {
    isFemale = true;
  } else if (gender === 'homme') {
    isFemale = false;
  } else {
    isFemale = Math.random() > 0.5;
  }
  
  const genderKey = isFemale ? 'feminin' : 'masculin';
  const prenom = randomElement(profileData.prenoms[genderKey]);
  const nom = randomElement(profileData.noms);
  const age = randomInt(16, 25);
  
  // Determine hours based on selected level and advancement, or random
  let baseHours;
  if (level !== null) {
    // User selected a specific level
    baseHours = getHoursForLevelAndAdvancement(level, advancement);
  } else {
    // Random level selection
    const levelRoll = Math.random();
    if (levelRoll < 0.25) {
      baseHours = randomInt(5, 11); // C1
    } else if (levelRoll < 0.50) {
      baseHours = randomInt(12, 15); // C2
    } else if (levelRoll < 0.75) {
      baseHours = randomInt(16, 20); // C3
    } else {
      baseHours = randomInt(21, 35); // C4
    }
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
  
  // Get trap/error for role-play (filtered by current level AND covered competencies)
  const selectedTrap = getTrap(trap, currentLevel, evaluation);
  
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
    trap: selectedTrap,
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
