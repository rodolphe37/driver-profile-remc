// REMC Data - Référentiel pour l'Éducation à une Mobilité Citoyenne
// All 32 sub-competencies across C1-C4

export const remcData = {
  c1: {
    id: "c1",
    name: "C1",
    title: "Maîtriser le maniement du véhicule dans un trafic faible ou nul",
    subCompetencies: [
      { id: "c1a", code: "a", title: "Connaître les principaux organes et commandes du véhicule, effectuer des vérifications intérieures et extérieures" },
      { id: "c1b", code: "b", title: "Entrer, s'installer au poste de conduite et en sortir" },
      { id: "c1c", code: "c", title: "Tenir, tourner le volant et maintenir la trajectoire" },
      { id: "c1d", code: "d", title: "Démarrer et s'arrêter" },
      { id: "c1e", code: "e", title: "Doser l'accélération et le freinage à diverses allures" },
      { id: "c1f", code: "f", title: "Utiliser la boîte de vitesse" },
      { id: "c1g", code: "g", title: "Diriger la voiture en avant en ligne droite et en courbe en adaptant allure et trajectoire" },
      { id: "c1h", code: "h", title: "Regarder autour de soi et avertir" },
      { id: "c1i", code: "i", title: "Effectuer une marche arrière et un demi-tour en sécurité" }
    ]
  },
  c2: {
    id: "c2",
    name: "C2",
    title: "Appréhender la route et circuler dans des conditions normales",
    subCompetencies: [
      { id: "c2a", code: "a", title: "Rechercher la signalisation, les indices utiles et en tenir compte" },
      { id: "c2b", code: "b", title: "Positionner le véhicule sur la chaussée et choisir la voie de circulation" },
      { id: "c2c", code: "c", title: "Adapter l'allure aux situations" },
      { id: "c2d", code: "d", title: "Détecter, identifier et franchir les intersections suivant le régime de priorité" },
      { id: "c2e", code: "e", title: "Tourner à droite et à gauche en agglomération" },
      { id: "c2f", code: "f", title: "Franchir les ronds-points et les carrefours à sens giratoire" },
      { id: "c2g", code: "g", title: "S'arrêter et stationner en épi, en bataille, et en créneau" }
    ]
  },
  c3: {
    id: "c3",
    name: "C3",
    title: "Circuler dans des conditions difficiles et partager la route avec les autres usagers",
    subCompetencies: [
      { id: "c3a", code: "a", title: "Évaluer et maintenir les distances de sécurité" },
      { id: "c3b", code: "b", title: "Croiser, dépasser, être dépassé" },
      { id: "c3c", code: "c", title: "Passer des virages et conduire en déclivité" },
      { id: "c3d", code: "d", title: "Connaître les caractéristiques des autres usagers et savoir se comporter à leur égard avec respect et courtoisie" },
      { id: "c3e", code: "e", title: "S'insérer, circuler et sortir d'une voie rapide" },
      { id: "c3f", code: "f", title: "Conduire dans une file de véhicules et dans une circulation dense" },
      { id: "c3g", code: "g", title: "Connaître les règles relatives à la circulation inter-files des motocyclistes. Savoir en tenir compte" },
      { id: "c3h", code: "h", title: "Conduire quand l'adhérence et la visibilité sont réduites" },
      { id: "c3i", code: "i", title: "Conduire à l'abord et dans la traversée d'ouvrages routiers tels que les tunnels, les ponts, les passages à niveau" }
    ]
  },
  c4: {
    id: "c4",
    name: "C4",
    title: "Pratiquer une conduite autonome, sûre et économique",
    subCompetencies: [
      { id: "c4a", code: "a", title: "Suivre un itinéraire de manière autonome" },
      { id: "c4b", code: "b", title: "Préparer et effectuer un voyage longue distance en autonomie" },
      { id: "c4c", code: "c", title: "Connaître les principaux facteurs de risque au volant et les recommandations à appliquer" },
      { id: "c4d", code: "d", title: "Connaître les comportements à adopter en cas d'accident : protéger, alerter, secourir" },
      { id: "c4e", code: "e", title: "Faire l'expérience des aides à la conduite du véhicule (régulateur, limiteur de vitesse, ABS, aides à la navigation...)" },
      { id: "c4f", code: "f", title: "Avoir des notions sur l'entretien, le dépannage et les situations d'urgence" },
      { id: "c4g", code: "g", title: "Pratiquer l'éco-conduite" }
    ]
  }
};

// Data for profile generation
export const profileData = {
  prenoms: {
    masculin: ["Lucas", "Hugo", "Nathan", "Théo", "Maxime", "Antoine", "Thomas", "Alexandre", "Julien", "Pierre", "Louis", "Arthur", "Gabriel", "Raphaël", "Adam", "Mathis", "Léo", "Clément", "Romain", "Baptiste"],
    feminin: ["Emma", "Léa", "Chloé", "Manon", "Camille", "Sarah", "Julie", "Marie", "Laura", "Océane", "Clara", "Inès", "Zoé", "Jade", "Louise", "Alice", "Lucie", "Anaïs", "Pauline", "Margot"]
  },
  noms: ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand", "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier"],
  occupations: [
    "Lycéen(ne) en Terminale",
    "Étudiant(e) en BTS",
    "Étudiant(e) à l'université",
    "Apprenti(e) en alternance",
    "En recherche d'emploi",
    "Salarié(e) en CDI",
    "Salarié(e) en CDD",
    "Intérimaire",
    "Stagiaire",
    "Service civique",
    "Auto-entrepreneur(se)",
    "Étudiant(e) en école d'ingénieur",
    "Étudiant(e) en école de commerce",
    "Préparateur(trice) de commandes",
    "Vendeur(se)"
  ],
  hobbies: [
    "Football", "Basketball", "Tennis", "Natation", "Course à pied", "Musculation", "Yoga",
    "Jeux vidéo", "Lecture", "Cinéma", "Musique", "Guitare", "Piano",
    "Photographie", "Dessin", "Peinture", "Cuisine", "Jardinage",
    "Voyages", "Randonnée", "Escalade", "Vélo", "Équitation",
    "Bénévolat", "Théâtre", "Danse", "Échecs", "Coding"
  ],
  mobilite: [
    "Transports en commun (bus/métro)",
    "Vélo",
    "Vélo électrique",
    "Trottinette électrique",
    "Covoiturage",
    "Marche à pied",
    "Scooter 50cc",
    "Scooter 125cc",
    "Parents qui conduisent"
  ],
  professions_parents: [
    "Enseignant(e)",
    "Infirmier(ère)",
    "Médecin",
    "Avocat(e)",
    "Ingénieur(e)",
    "Comptable",
    "Commercial(e)",
    "Artisan(e)",
    "Ouvrier(ère)",
    "Employé(e) de bureau",
    "Cadre",
    "Agriculteur(trice)",
    "Fonctionnaire",
    "Chef d'entreprise",
    "Technicien(ne)",
    "Retraité(e)",
    "Sans emploi",
    "Aide-soignant(e)",
    "Chauffeur routier",
    "Agent immobilier"
  ],
  motivations: [
    "Trouver un emploi plus facilement",
    "Être plus autonome au quotidien",
    "Pouvoir rendre visite à ma famille",
    "Accompagner mes futurs enfants",
    "Partir en week-end librement",
    "Éviter les transports en commun bondés",
    "Obligation professionnelle",
    "Voyager plus librement",
    "Aider mes parents dans leurs déplacements",
    "Stage ou alternance dans une zone mal desservie",
    "Passion pour l'automobile",
    "Indépendance vis-à-vis des parents",
    "Préparer mon avenir professionnel",
    "Déménagement prévu en zone rurale"
  ],
  lieux_residence: [
    "Centre-ville",
    "Banlieue proche",
    "Banlieue éloignée",
    "Zone périurbaine",
    "Zone rurale",
    "Petite commune",
    "Grande agglomération",
    "Quartier résidentiel",
    "Cité universitaire"
  ],
  besoins_speciaux: [
    null,
    "Dyslexie légère",
    "Dyslexie modérée",
    "Troubles de l'attention (TDAH)",
    "Anxiété au volant",
    "Difficultés de mémorisation",
    "Problème de vue corrigé",
    "Malentendant(e) appareillé(e)"
  ],
  vehicules: [
    "Peugeot 208",
    "Renault Clio V",
    "Citroën C3",
    "Volkswagen Polo",
    "Toyota Yaris",
    "Opel Corsa",
    "Fiat 500",
    "Dacia Sandero"
  ],
  contextes_conduite: [
    "Parking auto-école",
    "Quartier calme",
    "Centre-ville",
    "Zone commerciale",
    "Route départementale",
    "Route nationale",
    "Périphérique",
    "Voie rapide",
    "Rond-point complexe",
    "Zone industrielle",
    "Village",
    "Montagne (virages)",
    "Nuit en agglomération",
    "Pluie légère",
    "Pluie forte",
    "Circulation dense"
  ],
  retours_eleve: [
    "Je me suis senti(e) à l'aise aujourd'hui",
    "J'ai encore du mal avec les créneaux",
    "Les ronds-points me stressent",
    "J'ai mieux géré ma vitesse",
    "Je dois travailler mes rétros",
    "Je progresse sur les démarrages en côte",
    "J'ai eu peur lors d'un dépassement",
    "Je suis plus confiant(e) en ville",
    "Je dois améliorer mon positionnement",
    "La conduite de nuit m'inquiète",
    "J'ai bien anticipé les priorités",
    "Je me suis trompé(e) de direction",
    "Le moniteur était content de moi",
    "Je dois mieux utiliser mes clignotants",
    "J'ai fait une belle séance aujourd'hui"
  ]
};

// Pedagogical objectives templates
export const objectifsTemplates = {
  c1: {
    a: "Revoir l'emplacement et le fonctionnement des commandes principales (essuie-glaces, clignotants, feux)",
    b: "Pratiquer l'installation au poste et les réglages (siège, rétros, ceinture) de manière systématique",
    c: "Exercices de slalom et de trajectoire sur parking pour améliorer la tenue du volant",
    d: "Séquences de démarrage/arrêt répétées en terrain plat puis en légère pente",
    e: "Travail du dosage pédalier sur parcours varié (accélérations douces, freinages progressifs)",
    f: "Exercices de passage de vitesses en ligne droite, puis en situation réelle",
    g: "Conduite sur circuit fermé avec virages de rayons différents",
    h: "Exercices de contrôles visuels (rétros, angles morts) avant chaque manœuvre",
    i: "Pratique des demi-tours et marches arrière en zone sécurisée"
  },
  c2: {
    a: "Parcours de reconnaissance de la signalisation (panneaux, marquages, feux)",
    b: "Exercices de placement latéral sur différents types de voies",
    c: "Adaptation de la vitesse selon les zones (30, 50, 70, 90 km/h)",
    d: "Approche et franchissement d'intersections variées (cédez, stop, feux)",
    e: "Exercices de tourne-à-droite et tourne-à-gauche en agglomération",
    f: "Pratique des ronds-points de complexité croissante",
    g: "Séances dédiées aux différents types de stationnement"
  },
  c3: {
    a: "Exercices d'évaluation des distances de sécurité (règle des 2 secondes)",
    b: "Situations de croisement et dépassement sur routes variées",
    c: "Conduite en zone vallonnée avec virages",
    d: "Sensibilisation au partage de la route (piétons, cyclistes, deux-roues)",
    e: "Insertion et sortie de voie rapide/périphérique",
    f: "Conduite en circulation dense (heures de pointe)",
    g: "Théorie et vigilance sur la circulation inter-files des motos",
    h: "Conduite par temps dégradé (pluie, brouillard) si conditions réunies",
    i: "Approche d'ouvrages routiers (tunnel, pont, passage à niveau)"
  },
  c4: {
    a: "Navigation autonome sur itinéraire inconnu avec GPS",
    b: "Préparation théorique d'un trajet longue distance (pauses, itinéraire)",
    c: "Discussion sur les facteurs de risque (fatigue, alcool, téléphone)",
    d: "Révision des gestes de premiers secours (PAS : Protéger, Alerter, Secourir)",
    e: "Découverte et utilisation des aides à la conduite du véhicule",
    f: "Notions d'entretien de base et réaction en cas de panne",
    g: "Principes et pratique de l'éco-conduite"
  }
};

export default remcData;
