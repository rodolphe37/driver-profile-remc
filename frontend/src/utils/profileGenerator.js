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
// Each sub-competency has coherent pairs of (lieu, exercice)
const subCompetencyDetails = {
  // ===== C1 - Maîtrise du véhicule (trafic faible ou nul) =====
  // Lieux possibles: Parking auto-école, zone industrielle, quartier calme
  
  c1a: {
    title: "Commandes et vérifications",
    // Paires cohérentes (lieu + exercice)
    sessions: [
      { lieu: "Parking auto-école", exercice: "Tour du véhicule" },
      { lieu: "Parking auto-école", exercice: "Check intérieur/extérieur" },
      { lieu: "Parking auto-école", exercice: "Vérification des niveaux" },
      { lieu: "Parking auto-école", exercice: "Contrôle des feux et clignotants" }
    ],
    feedbacks: [
      "J'ai bien compris l'ordre des vérifications",
      "Je dois encore mémoriser toutes les commandes",
      "Le tour du véhicule devient automatique",
      "Je confonds encore certains voyants"
    ]
  },
  c1b: {
    title: "Installation au poste de conduite",
    sessions: [
      { lieu: "Parking auto-école", exercice: "Réglage du siège" },
      { lieu: "Parking auto-école", exercice: "Réglage des rétroviseurs" },
      { lieu: "Parking auto-école", exercice: "Installation complète en autonomie" },
      { lieu: "Parking auto-école", exercice: "Mise de la ceinture et check départ" }
    ],
    feedbacks: [
      "Je m'installe plus rapidement maintenant",
      "J'oublie encore parfois de régler les rétros",
      "La position de conduite devient confortable",
      "Je fais tout dans le bon ordre maintenant"
    ]
  },
  c1c: {
    title: "Tenue du volant et trajectoire",
    sessions: [
      { lieu: "Parking auto-école", exercice: "Slalom entre plots" },
      { lieu: "Parking auto-école", exercice: "Trajectoires précises" },
      { lieu: "Zone industrielle", exercice: "Slalom large" },
      { lieu: "Zone industrielle", exercice: "Maintien de trajectoire" }
    ],
    feedbacks: [
      "Je tiens mieux le volant maintenant",
      "Ma trajectoire est plus précise",
      "Je croise mieux les mains dans les virages",
      "Le slalom devient plus fluide"
    ]
  },
  c1d: {
    title: "Démarrer et s'arrêter",
    sessions: [
      { lieu: "Quartier calme", exercice: "Répétitions démarrage à plat" },
      { lieu: "Quartier calme", exercice: "Arrêts progressifs" },
      { lieu: "Quartier calme", exercice: "Démarrage en légère côte" },
      { lieu: "Quartier calme", exercice: "Enchaînement démarrage-arrêt" }
    ],
    feedbacks: [
      "Je cale moins qu'avant",
      "Le démarrage devient plus fluide",
      "J'arrive à doser le point de patinage",
      "Mes arrêts sont plus doux"
    ]
  },
  c1e: {
    title: "Dosage accélération et freinage",
    sessions: [
      { lieu: "Quartier calme", exercice: "Accélérations progressives" },
      { lieu: "Quartier calme", exercice: "Freinages doux" },
      { lieu: "Zone industrielle", exercice: "Maintien d'allure constante" },
      { lieu: "Zone industrielle", exercice: "Ralentissements anticipés" }
    ],
    feedbacks: [
      "Je dose mieux l'accélérateur",
      "Mes freinages sont plus souples",
      "J'accélère de manière plus progressive",
      "Je freine moins brusquement"
    ]
  },
  c1f: {
    title: "Utilisation de la boîte de vitesse",
    sessions: [
      { lieu: "Quartier calme", exercice: "Passage 1ère-2ème" },
      { lieu: "Quartier calme", exercice: "Montée des rapports jusqu'à la 4ème" },
      { lieu: "Quartier calme", exercice: "Rétrogradage 3ème-2ème" },
      { lieu: "Quartier calme", exercice: "Descente des rapports" }
    ],
    feedbacks: [
      "Je trouve mieux les vitesses",
      "Je ne regarde plus le levier",
      "Le rétrogradage devient plus fluide",
      "Je passe les vitesses au bon régime"
    ]
  },
  c1g: {
    title: "Trajectoire en ligne droite et courbe",
    sessions: [
      { lieu: "Quartier calme", exercice: "Suivi de voie en ligne droite" },
      { lieu: "Quartier calme", exercice: "Virages simples à droite" },
      { lieu: "Quartier calme", exercice: "Virages simples à gauche" },
      { lieu: "Quartier calme", exercice: "Enchaînement de courbes" }
    ],
    feedbacks: [
      "Je maintiens mieux ma trajectoire",
      "Je m'améliore dans les virages",
      "Je regarde plus loin pour anticiper",
      "L'enchaînement des virages est plus fluide"
    ]
  },
  c1h: {
    title: "Regarder et avertir",
    sessions: [
      { lieu: "Parking auto-école", exercice: "Contrôles visuels systématiques" },
      { lieu: "Quartier calme", exercice: "Utilisation des clignotants" },
      { lieu: "Quartier calme", exercice: "Vérification des angles morts" },
      { lieu: "Quartier calme", exercice: "Contrôles rétroviseurs avant manœuvre" }
    ],
    feedbacks: [
      "Je regarde plus souvent mes rétros",
      "Je n'oublie plus les angles morts",
      "J'utilise systématiquement les clignotants",
      "Mes contrôles visuels sont automatiques"
    ]
  },
  c1i: {
    title: "Marche arrière et demi-tour",
    sessions: [
      { lieu: "Parking auto-école", exercice: "Marche arrière en ligne droite" },
      { lieu: "Parking auto-école", exercice: "Demi-tour en 3 temps" },
      { lieu: "Zone industrielle", exercice: "Marche arrière en courbe" },
      { lieu: "Zone industrielle", exercice: "Demi-tour en sécurité" }
    ],
    feedbacks: [
      "La marche arrière devient plus naturelle",
      "Le demi-tour me stresse moins",
      "Je gère mieux le volant en marche arrière",
      "Je contrôle bien autour en manœuvrant"
    ]
  },

  // ===== C2 - Circulation en conditions normales =====
  // Lieux possibles: Centre-ville, zone commerciale, village, rond-point
  
  c2a: {
    title: "Signalisation et indices",
    sessions: [
      { lieu: "Centre-ville", exercice: "Lecture des panneaux" },
      { lieu: "Centre-ville", exercice: "Interprétation du marquage au sol" },
      { lieu: "Zone commerciale", exercice: "Repérage de la signalisation" },
      { lieu: "Zone commerciale", exercice: "Anticipation des panneaux de direction" }
    ],
    feedbacks: [
      "Je repère mieux les panneaux",
      "Je comprends mieux le marquage au sol",
      "J'anticipe la signalisation",
      "Je lis les panneaux plus tôt"
    ]
  },
  c2b: {
    title: "Positionnement sur la chaussée",
    sessions: [
      { lieu: "Centre-ville", exercice: "Maintien dans la voie" },
      { lieu: "Centre-ville", exercice: "Choix de la bonne voie" },
      { lieu: "Route nationale", exercice: "Placement sur voie de droite" },
      { lieu: "Route nationale", exercice: "Changement de voie sécurisé" }
    ],
    feedbacks: [
      "Je me positionne mieux sur la voie",
      "Je choisis la bonne voie plus tôt",
      "Mon placement est plus naturel",
      "Je reste bien à droite sur nationale"
    ]
  },
  c2c: {
    title: "Adaptation de l'allure",
    sessions: [
      { lieu: "Centre-ville", exercice: "Respect de la zone 30" },
      { lieu: "Centre-ville", exercice: "Adaptation en zone 50" },
      { lieu: "Route départementale", exercice: "Passage de 50 à 80 km/h" },
      { lieu: "Village", exercice: "Ralentissement entrée d'agglomération" }
    ],
    feedbacks: [
      "Je respecte mieux les limitations",
      "J'adapte ma vitesse plus naturellement",
      "Je ralentis à temps en entrant au village",
      "Je gère mieux les changements de vitesse"
    ]
  },
  c2d: {
    title: "Intersections et priorités",
    sessions: [
      { lieu: "Centre-ville", exercice: "Arrêt au stop" },
      { lieu: "Centre-ville", exercice: "Cédez-le-passage" },
      { lieu: "Village", exercice: "Priorité à droite" },
      { lieu: "Village", exercice: "Intersection sans signalisation" }
    ],
    feedbacks: [
      "Je marque bien l'arrêt au stop",
      "Le cédez-le-passage est plus clair",
      "Les priorités à droite me stressent moins",
      "J'analyse mieux les intersections"
    ]
  },
  c2e: {
    title: "Tourner à droite et à gauche",
    sessions: [
      { lieu: "Centre-ville", exercice: "Tourne-à-droite simple" },
      { lieu: "Centre-ville", exercice: "Tourne-à-gauche avec trafic" },
      { lieu: "Centre-ville", exercice: "Tourne-à-droite avec passage piéton" },
      { lieu: "Centre-ville", exercice: "Changement de direction en sécurité" }
    ],
    feedbacks: [
      "Je tourne mieux à droite",
      "Le tourne-à-gauche est moins stressant",
      "Je fais attention aux piétons en tournant",
      "J'anticipe mieux le trafic pour tourner"
    ]
  },
  c2f: {
    title: "Ronds-points et giratoires",
    sessions: [
      { lieu: "Rond-point simple", exercice: "Insertion dans le rond-point" },
      { lieu: "Rond-point simple", exercice: "Sortie du rond-point" },
      { lieu: "Rond-point complexe", exercice: "Giratoire à 2 voies" },
      { lieu: "Rond-point complexe", exercice: "Enchaînement entrée-sortie" }
    ],
    feedbacks: [
      "J'entre plus facilement dans les ronds-points",
      "La sortie est plus fluide",
      "Je clignotante bien en sortant",
      "Les giratoires à 2 voies sont plus clairs"
    ]
  },
  c2g: {
    title: "Stationnement",
    sessions: [
      { lieu: "Centre-ville", exercice: "Créneau côté droit" },
      { lieu: "Centre-ville", exercice: "Créneau côté gauche" },
      { lieu: "Zone commerciale", exercice: "Bataille avant" },
      { lieu: "Zone commerciale", exercice: "Épi avant et arrière" }
    ],
    feedbacks: [
      "Le créneau s'améliore",
      "Je réussis mieux les batailles",
      "L'épi devient automatique",
      "Je me gare plus rapidement"
    ]
  },

  // ===== C3 - Conditions difficiles & partage de la route =====
  // Lieux: Route départementale, périphérique, circulation dense, pluie, nuit
  
  c3a: {
    title: "Distances de sécurité",
    sessions: [
      { lieu: "Route départementale", exercice: "Règle des 2 secondes" },
      { lieu: "Route départementale", exercice: "Maintien de distance en file" },
      { lieu: "Voie rapide", exercice: "Distance sur voie rapide" },
      { lieu: "Voie rapide", exercice: "Adaptation distance selon conditions" }
    ],
    feedbacks: [
      "Je maintiens mieux la distance de sécurité",
      "J'applique la règle des 2 secondes",
      "Je garde mes distances sur voie rapide",
      "Je ne colle plus le véhicule devant"
    ]
  },
  c3b: {
    title: "Croiser et dépasser",
    sessions: [
      { lieu: "Route départementale", exercice: "Croisement de véhicules larges" },
      { lieu: "Route départementale", exercice: "Dépassement sécurisé" },
      { lieu: "Route départementale", exercice: "Croisement sur route étroite" },
      { lieu: "Route départementale", exercice: "Être dépassé en sécurité" }
    ],
    feedbacks: [
      "Je croise mieux sur route étroite",
      "Le dépassement me stresse moins",
      "J'évalue mieux les distances pour dépasser",
      "Je laisse bien passer ceux qui dépassent"
    ]
  },
  c3c: {
    title: "Virages et déclivité",
    sessions: [
      { lieu: "Route de montagne", exercice: "Virage en épingle" },
      { lieu: "Route de montagne", exercice: "Conduite en descente" },
      { lieu: "Route départementale", exercice: "Enchaînement de virages" },
      { lieu: "Route départementale", exercice: "Utilisation du frein moteur" }
    ],
    feedbacks: [
      "Je gère mieux les virages en montagne",
      "Le frein moteur devient naturel",
      "J'adapte ma vitesse en descente",
      "Les épingles sont moins stressantes"
    ]
  },
  c3d: {
    title: "Partage de la route",
    sessions: [
      { lieu: "Centre-ville", exercice: "Interaction avec les piétons" },
      { lieu: "Centre-ville", exercice: "Dépassement de cycliste" },
      { lieu: "Village", exercice: "Croisement de deux-roues" },
      { lieu: "Village", exercice: "Zone scolaire" }
    ],
    feedbacks: [
      "Je fais plus attention aux piétons",
      "Je laisse de l'espace aux cyclistes",
      "Je surveille mieux les deux-roues",
      "Je ralentis bien près des écoles"
    ]
  },
  c3e: {
    title: "Voies rapides",
    sessions: [
      { lieu: "Périphérique", exercice: "Insertion sur voie d'accélération" },
      { lieu: "Périphérique", exercice: "Sortie par voie de décélération" },
      { lieu: "Voie rapide", exercice: "Changement de voie sur voie rapide" },
      { lieu: "Voie rapide", exercice: "Circulation sur file de droite" }
    ],
    feedbacks: [
      "L'insertion est moins stressante",
      "Je prends mieux les sorties",
      "Les changements de voie s'améliorent",
      "Je gère mieux la vitesse sur voie rapide"
    ]
  },
  c3f: {
    title: "Circulation dense",
    sessions: [
      { lieu: "Circulation dense", exercice: "Conduite dans les bouchons" },
      { lieu: "Circulation dense", exercice: "Anticipation en file lente" },
      { lieu: "Centre-ville saturé", exercice: "Insertion dans le trafic dense" },
      { lieu: "Centre-ville saturé", exercice: "Progression au pas" }
    ],
    feedbacks: [
      "Je gère mieux les bouchons",
      "Je reste calme dans les embouteillages",
      "Je m'insère mieux dans le trafic dense",
      "La circulation dense me stresse moins"
    ]
  },
  c3g: {
    title: "Inter-files moto",
    sessions: [
      { lieu: "Périphérique", exercice: "Observation de l'inter-files" },
      { lieu: "Périphérique", exercice: "Anticipation remontée de file" },
      { lieu: "Périphérique", exercice: "Contrôle avant changement de voie" },
      { lieu: "Périphérique", exercice: "Vigilance motos en circulation dense" }
    ],
    feedbacks: [
      "Je vérifie mieux l'inter-files",
      "J'anticipe les motos qui remontent",
      "Je regarde bien avant de changer de voie",
      "Je laisse de l'espace pour les motos"
    ]
  },
  c3h: {
    title: "Adhérence et visibilité réduites",
    sessions: [
      { lieu: "Pluie légère", exercice: "Conduite sous la pluie" },
      { lieu: "Pluie forte", exercice: "Adaptation à la chaussée mouillée" },
      { lieu: "Nuit", exercice: "Conduite de nuit en ville" },
      { lieu: "Nuit", exercice: "Utilisation des feux adaptés" }
    ],
    feedbacks: [
      "J'adapte ma conduite à la pluie",
      "J'augmente mes distances par temps humide",
      "La conduite de nuit me stresse moins",
      "J'utilise bien les feux adaptés"
    ]
  },
  c3i: {
    title: "Ouvrages routiers",
    sessions: [
      { lieu: "Tunnel", exercice: "Entrée et sortie de tunnel" },
      { lieu: "Pont", exercice: "Traversée de pont étroit" },
      { lieu: "Passage à niveau", exercice: "Respect du passage à niveau" },
      { lieu: "Péage", exercice: "Passage au péage" }
    ],
    feedbacks: [
      "Le tunnel me stresse moins",
      "Je gère mieux les ponts étroits",
      "Je respecte bien les passages à niveau",
      "Le péage devient routinier"
    ]
  },

  // ===== C4 - Conduite autonome, sûre et économique =====
  // Lieux: Parcours complet (mix de tous les environnements)
  
  c4a: {
    title: "Itinéraire autonome",
    sessions: [
      { lieu: "Centre-ville + périphérie", exercice: "Suivi d'itinéraire au GPS" },
      { lieu: "Centre-ville + périphérie", exercice: "Navigation avec panneaux seuls" },
      { lieu: "Parcours inconnu", exercice: "Orientation sans aide" },
      { lieu: "Parcours inconnu", exercice: "Choix d'itinéraire autonome" }
    ],
    feedbacks: [
      "Je suis bien les indications GPS",
      "Je lis mieux les panneaux de direction",
      "Je fais mes propres choix d'itinéraire",
      "Je me repère mieux sans aide"
    ]
  },
  c4b: {
    title: "Voyage longue distance",
    sessions: [
      { lieu: "Route nationale + voie rapide", exercice: "Simulation trajet longue distance" },
      { lieu: "Route nationale + voie rapide", exercice: "Gestion des pauses" },
      { lieu: "Autoroute", exercice: "Conduite prolongée sur autoroute" },
      { lieu: "Autoroute", exercice: "Anticipation de la fatigue" }
    ],
    feedbacks: [
      "J'ai bien préparé mon itinéraire",
      "Je gère mieux mes pauses",
      "Je reconnais les signes de fatigue",
      "Le long trajet s'est bien passé"
    ]
  },
  c4c: {
    title: "Facteurs de risque",
    sessions: [
      { lieu: "Parcours varié", exercice: "Analyse de situations à risque" },
      { lieu: "Parcours varié", exercice: "Identification des dangers" },
      { lieu: "Tous contextes", exercice: "Discussion sur fatigue/alcool/téléphone" },
      { lieu: "Tous contextes", exercice: "Anticipation des comportements dangereux" }
    ],
    feedbacks: [
      "Je comprends mieux les risques",
      "Je suis vigilant sur la fatigue",
      "Je range mon téléphone en conduisant",
      "J'anticipe mieux les dangers"
    ]
  },
  c4d: {
    title: "Comportement en cas d'accident (PAS)",
    sessions: [
      { lieu: "Parking (à l'arrêt)", exercice: "Exercice Protéger-Alerter-Secourir" },
      { lieu: "Parking (à l'arrêt)", exercice: "Mise en place du balisage" },
      { lieu: "Parking (à l'arrêt)", exercice: "Simulation appel urgences" },
      { lieu: "Parking (à l'arrêt)", exercice: "Révision des gestes de premiers secours" }
    ],
    feedbacks: [
      "Je connais la procédure PAS",
      "Je sais comment baliser un accident",
      "J'ai retenu le 15/17/18/112",
      "Je me sens capable d'agir en cas d'accident"
    ]
  },
  c4e: {
    title: "Aides à la conduite",
    sessions: [
      { lieu: "Voie rapide", exercice: "Utilisation du régulateur" },
      { lieu: "Voie rapide", exercice: "Utilisation du limiteur de vitesse" },
      { lieu: "Voie rapide", exercice: "Test de l'ABS (théorique)" },
      { lieu: "Voie rapide", exercice: "Navigation avec système embarqué" }
    ],
    feedbacks: [
      "Je maîtrise le régulateur de vitesse",
      "Le limiteur est pratique en ville",
      "Je comprends le fonctionnement de l'ABS",
      "Je sais utiliser les aides électroniques"
    ]
  },
  c4f: {
    title: "Entretien et dépannage",
    sessions: [
      { lieu: "Parking", exercice: "Vérification des niveaux" },
      { lieu: "Parking", exercice: "Contrôle pression des pneus" },
      { lieu: "Parking", exercice: "Simulation changement de roue" },
      { lieu: "Parking", exercice: "Localisation triangle et gilet" }
    ],
    feedbacks: [
      "Je sais vérifier les niveaux",
      "J'ai compris le changement de roue",
      "Je sais quoi faire en cas de panne",
      "J'ai mon gilet et triangle accessibles"
    ]
  },
  c4g: {
    title: "Éco-conduite",
    sessions: [
      { lieu: "Route départementale", exercice: "Anticipation des ralentissements" },
      { lieu: "Route départementale", exercice: "Utilisation du frein moteur" },
      { lieu: "Centre-ville", exercice: "Conduite souple en ville" },
      { lieu: "Centre-ville", exercice: "Régime moteur optimal" }
    ],
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
      subCompetencyTitle: 'Commandes et vérifications',
      competencyId: 'c1',
      competencyName: 'C1',
      context: 'Parking auto-école',
      situation: 'Tour du véhicule',
      feedback: "C'était ma première leçon, j'ai découvert le véhicule"
    };
  }
  
  const subCompId = lastCovered.subCompetency.id;
  const details = subCompetencyDetails[subCompId];
  
  if (!details || !details.sessions || details.sessions.length === 0) {
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
  
  // Pick a random coherent session (lieu + exercice pair)
  const session = randomElement(details.sessions);
  const feedback = randomElement(details.feedbacks);
  
  return {
    subCompetencyId: subCompId,
    subCompetencyCode: lastCovered.subCompetency.code.toUpperCase(),
    subCompetencyTitle: details.title,
    competencyId: lastCovered.competencyId,
    competencyName: lastCovered.competencyName,
    context: session.lieu,
    situation: session.exercice,
    feedback: feedback
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
// Prioritizes recent weak sub-competencies (near the progression front)
const findWeakCompetencies = (evaluation) => {
  const weak = [];
  const competencyOrder = ['c1', 'c2', 'c3', 'c4'];
  
  // Build a flat ordered list of all covered sub-competencies with their position
  let globalIndex = 0;
  let lastCoveredIndex = -1;
  const allCovered = [];
  
  for (const compId of competencyOrder) {
    const comp = evaluation[compId];
    for (const sub of comp.subCompetencies) {
      if (sub.covered) {
        allCovered.push({ compId, comp, sub, position: globalIndex });
        lastCoveredIndex = globalIndex;
      }
      globalIndex++;
    }
  }
  
  // Now find weak ones and score them by recency
  allCovered.forEach(item => {
    if (item.sub.status === 'faible' || item.sub.status === 'moyen') {
      // Recency score: closer to lastCoveredIndex = higher score
      const distance = lastCoveredIndex - item.position;
      const recencyScore = Math.max(0, 1 - (distance / Math.max(1, lastCoveredIndex)));
      
      weak.push({
        competencyId: item.compId,
        competencyName: item.comp.name,
        subCompetency: item.sub,
        priority: item.sub.status === 'faible' ? 1 : 2,
        recencyScore: recencyScore,
        // Combined score: weakness weight + recency weight
        // faible + recent = highest, moyen + old = lowest
        sortScore: (item.sub.status === 'faible' ? 0 : 10) + distance
      });
    }
  });
  
  // Sort by combined score (lower = more priority)
  return weak.sort((a, b) => a.sortScore - b.sortScore);
};

// Generate pedagogical objectives coherent with recent progression and weak points
const generateObjectives = (evaluation) => {
  const weakComps = findWeakCompetencies(evaluation);
  const objectives = [];
  
  // Take top 3 weak competencies (already sorted by recency + weakness)
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
const generateCourseHistory = (hours, enrollmentDate, currentLevel, evaluation, besoinSpecial, age) => {
  const hasSimulator = Math.random() > 0.4;
  const simulatorHours = hasSimulator ? randomInt(2, Math.min(10, Math.floor(hours * 0.3))) : 0;
  const realHours = hours - simulatorHours;
  
  // Calculate last lesson date (recent)
  const now = new Date();
  const daysSinceLastLesson = randomInt(1, 14);
  const lastLessonDate = new Date(now.getTime() - daysSinceLastLesson * 24 * 60 * 60 * 1000);
  
  // Get last session details based on evaluation
  const lastSession = generateLastSessionDetails(evaluation);
  
  // Generate estimated hours from initial evaluation (évaluation de départ)
  // Realistic ranges based on French driving school standards:
  // - Minimum legal: 20h
  // - Average student: 25-35h
  // - Student with difficulties or special needs: 30-45h
  // - Quick learner: 20-25h
  
  let heuresEstimees;
  let evaluationDepart;
  
  // Determine estimated hours based on various factors
  const hasSpecialNeeds = besoinSpecial !== null;
  const difficultyFactor = Math.random(); // 0 = easy learner, 1 = needs more practice
  
  if (hasSpecialNeeds) {
    // Students with special needs typically need more hours
    heuresEstimees = randomInt(30, 40);
    evaluationDepart = {
      niveau: "Adaptation nécessaire",
      commentaire: "Formation adaptée recommandée",
      facteur: "besoin spécifique"
    };
  } else if (difficultyFactor < 0.2) {
    // Quick learner (20%)
    heuresEstimees = randomInt(20, 25);
    evaluationDepart = {
      niveau: "Bonnes aptitudes",
      commentaire: "Bonne coordination, apprentissage rapide prévu",
      facteur: "facilité"
    };
  } else if (difficultyFactor < 0.5) {
    // Average student (30%)
    heuresEstimees = randomInt(25, 30);
    evaluationDepart = {
      niveau: "Aptitudes moyennes",
      commentaire: "Progression normale attendue",
      facteur: "standard"
    };
  } else if (difficultyFactor < 0.8) {
    // Needs more practice (30%)
    heuresEstimees = randomInt(28, 35);
    evaluationDepart = {
      niveau: "Travail supplémentaire",
      commentaire: "Coordination à travailler, prévoir heures supplémentaires",
      facteur: "travail"
    };
  } else {
    // Significant difficulties (20%)
    heuresEstimees = randomInt(32, 42);
    evaluationDepart = {
      niveau: "Difficultés identifiées",
      commentaire: "Appréhension au volant, formation longue probable",
      facteur: "difficulté"
    };
  }
  
  // Make sure estimated hours is at least current hours + some buffer
  if (heuresEstimees < hours + 3) {
    heuresEstimees = hours + randomInt(3, 8);
  }
  
  // Cap at realistic maximum
  heuresEstimees = Math.min(heuresEstimees, 50);
  
  // AAC (Apprentissage Anticipé de la Conduite) is only available for students aged 15-17
  // In France, AAC allows students to start learning at 15 and drive with a parent until 17
  const isAACEligible = age >= 15 && age <= 17;
  const hasAAC = isAACEligible && Math.random() > 0.6; // 40% chance for eligible students
  
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
    hasAAC: hasAAC,
    isAACEligible: isAACEligible,
    hasLicense: false, // Learning, so no license yet
    // Estimated hours from initial evaluation
    heuresEstimees: heuresEstimees,
    evaluationDepart: evaluationDepart,
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

// Get occupation coherent with age
const getOccupationByAge = (age) => {
  if (age <= 18) {
    return randomElement(profileData.occupationsByAge.lycee);
  } else if (age <= 21) {
    return randomElement(profileData.occupationsByAge.licence);
  } else if (age <= 23) {
    return randomElement(profileData.occupationsByAge.master);
  } else {
    return randomElement(profileData.occupationsByAge.doctorat);
  }
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
  
  // Special needs (90% chance of none - rarely present)
  const besoinSpecial = Math.random() > 0.9 ? 
    randomElement(profileData.besoins_speciaux.filter(b => b !== null)) : null;
  
  // Generate evaluation based on hours
  const evaluation = generateEvaluation(baseHours);
  
  // Get trap/error for role-play (filtered by current level AND covered competencies)
  const selectedTrap = getTrap(trap, currentLevel, evaluation);
  
  // Generate pedagogical objectives
  const objectifs = generateObjectives(evaluation);
  
  // Generate course history with current level context, evaluation, special needs and age
  const courseHistory = generateCourseHistory(baseHours, enrollmentDate.toISOString().split('T')[0], currentLevel, evaluation, besoinSpecial, age);
  
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
    occupation: getOccupationByAge(age),
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
