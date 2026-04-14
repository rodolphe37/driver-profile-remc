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

// Specific contexts and feedbacks for each sub-competency
const subCompetencyDetails = {
  // C1 - Maniement du véhicule
  c1a: {
    title: "Vérifications intérieures et extérieures",
    contexts: ["Parking auto-école", "Devant l'auto-école", "Parking couvert"],
    situations: ["Vérification des niveaux", "Contrôle des feux", "Réglage des rétroviseurs", "Tour du véhicule"],
    feedbacks: [
      "J'ai bien compris l'ordre des vérifications",
      "Je dois encore mémoriser toutes les commandes",
      "Le tour du véhicule devient automatique",
      "Je confonds encore certains voyants"
    ]
  },
  c1b: {
    title: "Installation au poste de conduite",
    contexts: ["Parking auto-école", "Devant l'auto-école"],
    situations: ["Réglage du siège", "Réglage des rétroviseurs", "Position de conduite", "Mise de la ceinture"],
    feedbacks: [
      "Je m'installe plus rapidement maintenant",
      "J'oublie encore parfois de régler les rétros",
      "La position de conduite devient confortable",
      "Je dois penser à tout vérifier avant de démarrer"
    ]
  },
  c1c: {
    title: "Tenue du volant et trajectoire",
    contexts: ["Parking vide", "Piste privée", "Quartier calme", "Zone résidentielle"],
    situations: ["Slalom entre plots", "Ligne droite", "Virage à droite", "Virage à gauche", "Courbes enchaînées"],
    feedbacks: [
      "Je tiens mieux le volant maintenant",
      "Ma trajectoire est encore en zigzag",
      "Je croise mieux les mains dans les virages",
      "Je dois regarder plus loin pour anticiper"
    ]
  },
  c1d: {
    title: "Démarrage et arrêt",
    contexts: ["Parking plat", "Légère montée", "Légère descente", "Parking en pente"],
    situations: ["Démarrage à plat", "Démarrage en côte", "Arrêt progressif", "Arrêt d'urgence simulé"],
    feedbacks: [
      "Je cale moins qu'avant",
      "Le démarrage en côte reste difficile",
      "J'arrive à doser le point de patinage",
      "Je freine encore trop brusquement"
    ]
  },
  c1e: {
    title: "Dosage accélération et freinage",
    contexts: ["Route calme", "Zone 30", "Parking", "Piste privée"],
    situations: ["Accélération progressive", "Freinage doux", "Maintien de l'allure", "Ralentissement anticipé"],
    feedbacks: [
      "Je dose mieux l'accélérateur",
      "Mes freinages sont plus souples",
      "J'accélère encore trop fort",
      "Je dois anticiper les ralentissements"
    ]
  },
  c1f: {
    title: "Utilisation de la boîte de vitesse",
    contexts: ["Route calme", "Zone résidentielle", "Route départementale peu fréquentée"],
    situations: ["Passage 1ère-2ème", "Passage 2ème-3ème", "Rétrogradage", "Passage de toutes les vitesses"],
    feedbacks: [
      "Je trouve mieux les vitesses",
      "Je dois encore regarder le levier",
      "Le rétrogradage devient plus fluide",
      "Je passe les vitesses au bon régime"
    ]
  },
  c1g: {
    title: "Direction en ligne droite et courbe",
    contexts: ["Route de campagne", "Zone résidentielle", "Quartier calme"],
    situations: ["Ligne droite prolongée", "Virage serré", "Enchaînement de courbes", "Adaptation de trajectoire"],
    feedbacks: [
      "Je maintiens mieux ma trajectoire",
      "Je m'améliore dans les virages",
      "Je dois mieux adapter ma vitesse en courbe",
      "L'enchaînement des virages est plus fluide"
    ]
  },
  c1h: {
    title: "Observation et avertissement",
    contexts: ["Quartier résidentiel", "Zone avec piétons", "Parking animé"],
    situations: ["Contrôle rétroviseurs", "Vérification angles morts", "Utilisation clignotants", "Avertisseur sonore"],
    feedbacks: [
      "Je regarde plus souvent mes rétros",
      "J'oublie encore les angles morts",
      "J'utilise mieux les clignotants",
      "Je dois mieux anticiper les dangers"
    ]
  },
  c1i: {
    title: "Marche arrière et demi-tour",
    contexts: ["Parking vide", "Impasse calme", "Parking supermarché"],
    situations: ["Marche arrière en ligne droite", "Demi-tour en 3 temps", "Marche arrière en courbe", "Demi-tour dans une rue"],
    feedbacks: [
      "La marche arrière devient plus naturelle",
      "Le demi-tour me stresse encore",
      "Je gère mieux le volant en marche arrière",
      "Je dois mieux regarder autour en manœuvrant"
    ]
  },
  
  // C2 - Appréhender la route
  c2a: {
    title: "Signalisation et indices",
    contexts: ["Centre-ville", "Route départementale", "Zone commerciale", "Entrée d'agglomération"],
    situations: ["Lecture des panneaux", "Marquage au sol", "Signaux lumineux", "Panneaux de direction"],
    feedbacks: [
      "Je repère mieux les panneaux",
      "Je dois mieux anticiper la signalisation",
      "Les marquages au sol sont plus clairs",
      "Je dois regarder plus loin pour anticiper"
    ]
  },
  c2b: {
    title: "Positionnement sur la chaussée",
    contexts: ["Route à plusieurs voies", "Avenue large", "Route départementale", "Boulevard"],
    situations: ["Placement sur voie de droite", "Changement de voie", "Voie de présélection", "Positionnement avant intersection"],
    feedbacks: [
      "Je me positionne mieux sur la voie",
      "Les changements de voie sont moins stressants",
      "Je dois mieux anticiper les voies de présélection",
      "Mon positionnement avant les intersections s'améliore"
    ]
  },
  c2c: {
    title: "Adaptation de l'allure",
    contexts: ["Zone 30", "Zone 50", "Route à 70 km/h", "Entrée de village"],
    situations: ["Respect des limitations", "Adaptation à la circulation", "Ralentissement zone école", "Changement de limitation"],
    feedbacks: [
      "Je respecte mieux les limitations",
      "J'adapte mieux ma vitesse au trafic",
      "Je dois ralentir plus tôt près des écoles",
      "Je gère mieux les changements de vitesse"
    ]
  },
  c2d: {
    title: "Intersections et priorités",
    contexts: ["Carrefour avec stop", "Carrefour avec cédez-le-passage", "Priorité à droite", "Intersection avec feux"],
    situations: ["Arrêt au stop", "Cédez-le-passage", "Priorité à droite", "Passage au feu vert", "Feu orange"],
    feedbacks: [
      "Je marque mieux l'arrêt au stop",
      "Le cédez-le-passage est plus clair",
      "Les priorités à droite me stressent moins",
      "Je gère mieux les feux tricolores"
    ]
  },
  c2e: {
    title: "Tourner en agglomération",
    contexts: ["Centre-ville", "Quartier résidentiel", "Zone commerciale", "Intersection simple"],
    situations: ["Tourne-à-droite simple", "Tourne-à-gauche", "Tourne-à-droite avec passage piéton", "Tourne-à-gauche avec trafic"],
    feedbacks: [
      "Je tourne mieux à droite",
      "Le tourne-à-gauche est moins stressant",
      "Je fais attention aux piétons en tournant",
      "J'anticipe mieux le trafic pour tourner"
    ]
  },
  c2f: {
    title: "Ronds-points et giratoires",
    contexts: ["Rond-point simple", "Giratoire à 2 voies", "Mini-giratoire", "Grand rond-point"],
    situations: ["Entrée de rond-point", "Sortie de rond-point", "Changement de voie dans giratoire", "Rond-point à plusieurs sorties"],
    feedbacks: [
      "J'entre plus facilement dans les ronds-points",
      "La sortie est plus fluide",
      "Les giratoires à 2 voies restent difficiles",
      "Je clignotante mieux en sortant"
    ]
  },
  c2g: {
    title: "Stationnement",
    contexts: ["Parking supermarché", "Rue en ville", "Parking en épi", "Parking en bataille"],
    situations: ["Créneau côté droit", "Créneau côté gauche", "Bataille avant", "Épi avant", "Épi arrière"],
    feedbacks: [
      "Le créneau s'améliore",
      "Je réussis mieux les batailles",
      "L'épi devient automatique",
      "Je dois encore travailler le créneau à gauche"
    ]
  },
  
  // C3 - Conditions difficiles
  c3a: {
    title: "Distances de sécurité",
    contexts: ["Route nationale", "Voie rapide", "Autoroute", "Route mouillée"],
    situations: ["Maintien des 2 secondes", "Adaptation en cas de pluie", "Distance sur autoroute", "Suivi à distance sécuritaire"],
    feedbacks: [
      "Je maintiens mieux la distance de sécurité",
      "J'augmente la distance quand il pleut",
      "Sur autoroute, je garde mes distances",
      "Je dois moins coller le véhicule devant"
    ]
  },
  c3b: {
    title: "Croisements et dépassements",
    contexts: ["Route départementale", "Route de campagne", "Route étroite", "Route avec circulation"],
    situations: ["Croisement simple", "Croisement étroit", "Dépassement véhicule lent", "Être dépassé"],
    feedbacks: [
      "Je croise mieux sur route étroite",
      "Le dépassement me stresse moins",
      "Je laisse bien passer ceux qui dépassent",
      "J'évalue mieux les distances pour dépasser"
    ]
  },
  c3c: {
    title: "Virages et déclivité",
    contexts: ["Route de montagne", "Col", "Route vallonnée", "Descente prolongée"],
    situations: ["Virage en montée", "Virage en descente", "Enchaînement de virages", "Freinage moteur"],
    feedbacks: [
      "Je gère mieux les virages en montagne",
      "Le frein moteur devient naturel",
      "J'adapte mieux ma vitesse en descente",
      "Les épingles sont moins stressantes"
    ]
  },
  c3d: {
    title: "Partage de la route",
    contexts: ["Centre-ville", "Piste cyclable", "Zone piétonne", "Quartier avec écoles"],
    situations: ["Passage piéton", "Dépassement cycliste", "Croisement deux-roues", "Zone scolaire"],
    feedbacks: [
      "Je fais plus attention aux piétons",
      "Je laisse de l'espace aux cyclistes",
      "Je surveille mieux les deux-roues",
      "Je ralentis bien près des écoles"
    ]
  },
  c3e: {
    title: "Voies rapides",
    contexts: ["Entrée de périphérique", "Voie d'insertion autoroute", "Sortie de voie rapide", "Autoroute"],
    situations: ["Insertion sur voie rapide", "Sortie de voie rapide", "Changement de voie sur autoroute", "Circulation sur file de droite"],
    feedbacks: [
      "L'insertion est moins stressante",
      "Je prends mieux les sorties",
      "Les changements de voie s'améliorent",
      "Je gère mieux la vitesse sur autoroute"
    ]
  },
  c3f: {
    title: "Circulation dense",
    contexts: ["Heure de pointe", "Centre-ville saturé", "Bouchon", "Périphérique chargé"],
    situations: ["Conduite dans les bouchons", "Circulation au pas", "Insertion dans le trafic", "File lente"],
    feedbacks: [
      "Je gère mieux les bouchons",
      "Je reste calme dans les embouteillages",
      "Je m'insère mieux dans le trafic dense",
      "La circulation dense me stresse moins"
    ]
  },
  c3g: {
    title: "Circulation inter-files motos",
    contexts: ["Périphérique", "Boulevard urbain", "Route à 2x2 voies"],
    situations: ["Contrôle inter-files", "Anticipation remontée de file", "Changement de voie avec motos"],
    feedbacks: [
      "Je vérifie mieux l'inter-files",
      "J'anticipe les motos qui remontent",
      "Je regarde bien avant de changer de voie",
      "Je laisse de l'espace pour les motos"
    ]
  },
  c3h: {
    title: "Adhérence et visibilité réduites",
    contexts: ["Route mouillée", "Brouillard léger", "Pluie", "Crépuscule"],
    situations: ["Conduite sous la pluie", "Brouillard", "Route glissante", "Visibilité réduite"],
    feedbacks: [
      "J'adapte ma conduite à la pluie",
      "Je ralentis bien par temps de brouillard",
      "J'augmente mes distances de sécurité",
      "J'utilise bien les feux adaptés"
    ]
  },
  c3i: {
    title: "Ouvrages routiers",
    contexts: ["Tunnel", "Pont étroit", "Passage à niveau", "Péage"],
    situations: ["Entrée de tunnel", "Traversée de pont", "Passage à niveau automatique", "Passage au péage"],
    feedbacks: [
      "Le tunnel me stresse moins",
      "Je gère mieux les ponts étroits",
      "Je respecte bien les passages à niveau",
      "Le péage devient routinier"
    ]
  },
  
  // C4 - Conduite autonome
  c4a: {
    title: "Itinéraire autonome",
    contexts: ["Trajet inconnu", "Navigation GPS", "Ville inconnue", "Campagne"],
    situations: ["Suivi GPS", "Lecture panneaux direction", "Choix d'itinéraire", "Orientation sans GPS"],
    feedbacks: [
      "Je suis mieux les indications GPS",
      "Je lis mieux les panneaux de direction",
      "Je fais mes propres choix d'itinéraire",
      "Je me repère mieux sans aide"
    ]
  },
  c4b: {
    title: "Voyage longue distance",
    contexts: ["Autoroute", "Trajet de 2h+", "Aires de repos", "Trajet varié"],
    situations: ["Préparation du trajet", "Gestion des pauses", "Fatigue au volant", "Ravitaillement"],
    feedbacks: [
      "J'ai bien préparé mon itinéraire",
      "Je gère mieux mes pauses",
      "Je reconnais les signes de fatigue",
      "Le long trajet s'est bien passé"
    ]
  },
  c4c: {
    title: "Facteurs de risque",
    contexts: ["Discussion théorique", "Mise en situation", "Analyse de risques"],
    situations: ["Identification des risques", "Fatigue/alcool/téléphone", "Comportements à risque", "Anticipation dangers"],
    feedbacks: [
      "Je comprends mieux les risques",
      "Je suis vigilant sur la fatigue",
      "Je range mon téléphone en conduisant",
      "J'anticipe mieux les dangers"
    ]
  },
  c4d: {
    title: "Comportement en cas d'accident",
    contexts: ["Formation théorique", "Simulation", "Exercice PAS"],
    situations: ["Protéger-Alerter-Secourir", "Balisage", "Appel urgences", "Premiers gestes"],
    feedbacks: [
      "Je connais la procédure PAS",
      "Je sais comment baliser un accident",
      "J'ai retenu le numéro d'urgence",
      "Je me sens capable d'agir en cas d'accident"
    ]
  },
  c4e: {
    title: "Aides à la conduite",
    contexts: ["Véhicule équipé", "Test régulateur", "Test limiteur", "Navigation intégrée"],
    situations: ["Utilisation régulateur", "Utilisation limiteur", "Aide au stationnement", "Navigation"],
    feedbacks: [
      "Je maîtrise le régulateur de vitesse",
      "Le limiteur est pratique en ville",
      "L'aide au stationnement m'aide bien",
      "Je sais utiliser la navigation"
    ]
  },
  c4f: {
    title: "Entretien et dépannage",
    contexts: ["Formation théorique", "Exercice pratique", "Simulation panne"],
    situations: ["Vérification niveaux", "Changement roue", "Panne sur route", "Triangle et gilet"],
    feedbacks: [
      "Je sais vérifier les niveaux",
      "J'ai compris le changement de roue",
      "Je sais quoi faire en cas de panne",
      "J'ai mon gilet et triangle accessibles"
    ]
  },
  c4g: {
    title: "Éco-conduite",
    contexts: ["Trajet urbain", "Route nationale", "Trajet mixte"],
    situations: ["Anticipation", "Régime moteur optimal", "Utilisation du frein moteur", "Conduite souple"],
    feedbacks: [
      "Je conduis de manière plus souple",
      "J'anticipe mieux pour économiser",
      "J'utilise bien le frein moteur",
      "Ma consommation s'améliore"
    ]
  }
};

// Find the last covered sub-competency for a given evaluation
const findLastCoveredSubCompetency = (evaluation) => {
  const competencyOrder = ['c1', 'c2', 'c3', 'c4'];
  let lastCovered = null;
  
  for (const compId of competencyOrder) {
    const comp = evaluation[compId];
    for (const sub of comp.subCompetencies) {
      if (sub.covered) {
        lastCovered = {
          competencyId: compId,
          competencyName: comp.name,
          competencyTitle: comp.title,
          subCompetency: sub
        };
      }
    }
  }
  
  return lastCovered;
};

// Generate last session details based on the last covered sub-competency
const generateLastSessionDetails = (evaluation) => {
  const lastCovered = findLastCoveredSubCompetency(evaluation);
  
  if (!lastCovered) {
    // Fallback for very early students
    return {
      subCompetencyId: 'c1a',
      subCompetencyCode: 'A',
      subCompetencyTitle: 'Vérifications intérieures et extérieures',
      competencyId: 'c1',
      competencyName: 'C1',
      context: 'Parking auto-école',
      situation: 'Tour du véhicule',
      feedback: "C'était ma première leçon, j'ai découvert le véhicule"
    };
  }
  
  const subCompId = lastCovered.subCompetency.id;
  const details = subCompetencyDetails[subCompId];
  
  if (!details) {
    // Fallback if no specific details
    return {
      subCompetencyId: subCompId,
      subCompetencyCode: lastCovered.subCompetency.code.toUpperCase(),
      subCompetencyTitle: lastCovered.subCompetency.title,
      competencyId: lastCovered.competencyId,
      competencyName: lastCovered.competencyName,
      context: 'Parcours varié',
      situation: 'Exercices pratiques',
      feedback: "La séance s'est bien passée"
    };
  }
  
  return {
    subCompetencyId: subCompId,
    subCompetencyCode: lastCovered.subCompetency.code.toUpperCase(),
    subCompetencyTitle: details.title,
    competencyId: lastCovered.competencyId,
    competencyName: lastCovered.competencyName,
    context: randomElement(details.contexts),
    situation: randomElement(details.situations),
    feedback: randomElement(details.feedbacks)
  };
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
const generateCourseHistory = (hours, enrollmentDate, currentLevel, evaluation) => {
  const hasSimulator = Math.random() > 0.4;
  const simulatorHours = hasSimulator ? randomInt(2, Math.min(10, Math.floor(hours * 0.3))) : 0;
  const realHours = hours - simulatorHours;
  
  // Calculate last lesson date (recent)
  const now = new Date();
  const daysSinceLastLesson = randomInt(1, 14);
  const lastLessonDate = new Date(now.getTime() - daysSinceLastLesson * 24 * 60 * 60 * 1000);
  
  // Get last session details based on evaluation
  const lastSession = generateLastSessionDetails(evaluation);
  
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
    // New: detailed last session info
    lastSession: lastSession,
    // Legacy fields for backward compatibility
    lastContext: lastSession.context,
    studentFeedback: lastSession.feedback,
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
  
  // Generate course history with current level context and evaluation
  const courseHistory = generateCourseHistory(baseHours, enrollmentDate.toISOString().split('T')[0], currentLevel, evaluation);
  
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
