import React from 'react';
import { Wand2, RefreshCw, Settings2, AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const ProfileGenerator = ({ 
  onGenerate, 
  isGenerating, 
  hasProfile, 
  selectedLevel, 
  setSelectedLevel, 
  selectedAdvancement, 
  setSelectedAdvancement,
  selectedGender,
  setSelectedGender,
  selectedTrap,
  setSelectedTrap
}) => {
  
  const levelOptions = [
    { value: 'random', label: 'Aléatoire', color: 'bg-slate-100 text-slate-700' },
    { value: '1', label: 'C1 - Maniement du véhicule', color: 'bg-blue-100 text-blue-700' },
    { value: '2', label: 'C2 - Appréhender la route', color: 'bg-emerald-100 text-emerald-700' },
    { value: '3', label: 'C3 - Conditions difficiles', color: 'bg-amber-100 text-amber-700' },
    { value: '4', label: 'C4 - Conduite autonome', color: 'bg-purple-100 text-purple-700' },
  ];

  const advancementOptions = [
    { value: 'random', label: 'Aléatoire' },
    { value: 'debut', label: 'Début de compétence' },
    { value: 'milieu', label: 'Milieu de compétence' },
    { value: 'fin', label: 'Fin de compétence' },
  ];

  const genderOptions = [
    { value: 'random', label: 'Aléatoire' },
    { value: 'homme', label: 'Homme' },
    { value: 'femme', label: 'Femme' },
  ];

  // Traps with their associated competency levels
  const allTrapOptions = [
    { value: 'none', label: 'Aucun piège', levels: [1, 2, 3, 4] },
    { value: 'random', label: 'Piège aléatoire', levels: [1, 2, 3, 4] },
    { value: 'coordination', label: 'Coordination (pieds/mains)', levels: [1, 2] },
    { value: 'commandes', label: 'Commandes (confusion)', levels: [1] },
    { value: 'volant', label: 'Volant (trajectoire)', levels: [1, 2] },
    { value: 'observation', label: 'Observation (rétros/angles morts)', levels: [1, 2, 3] },
    { value: 'vitesse', label: 'Vitesse (dosage)', levels: [2, 3] },
    { value: 'stress', label: 'Stress (blocage)', levels: [2, 3, 4] },
  ];

  // Filter traps based on selected level
  const getFilteredTrapOptions = () => {
    if (selectedLevel === 'random') {
      return allTrapOptions;
    }
    const level = parseInt(selectedLevel);
    return allTrapOptions.filter(trap => trap.levels.includes(level));
  };

  const trapOptions = getFilteredTrapOptions();

  // Reset trap if current selection is not valid for new level
  React.useEffect(() => {
    if (selectedLevel !== 'random' && selectedTrap !== 'none' && selectedTrap !== 'random') {
      const level = parseInt(selectedLevel);
      const currentTrap = allTrapOptions.find(t => t.value === selectedTrap);
      if (currentTrap && !currentTrap.levels.includes(level)) {
        setSelectedTrap('none');
      }
    }
  }, [selectedLevel, selectedTrap, setSelectedTrap]);

  const getSelectedLevelColor = () => {
    const option = levelOptions.find(o => o.value === selectedLevel);
    return option?.color || 'bg-slate-100 text-slate-700';
  };

  // Check if any option is customized
  const hasCustomOptions = selectedLevel !== 'random' || selectedGender !== 'random' || selectedTrap !== 'none';

  return (
    <div className="flex flex-col gap-4 w-full" data-testid="profile-generator">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Générateur de Profil REMC
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Créez des profils d'élèves fictifs pour la formation TPECSR
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Options Modal Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={`relative px-4 py-2.5 rounded-xl font-medium border-2 transition-all duration-200 ${
                  hasCustomOptions 
                    ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                data-testid="btn-open-options"
              >
                <Settings2 className="w-5 h-5 mr-2" />
                Options
                {hasCustomOptions && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Settings2 className="w-5 h-5 text-blue-600" />
                  Options de génération
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Profile Options Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Profil de l'élève
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Gender Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Genre</label>
                      <Select value={selectedGender} onValueChange={setSelectedGender}>
                        <SelectTrigger className="w-full" data-testid="select-gender">
                          <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Level Selector */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Niveau</label>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger className="w-full" data-testid="select-level">
                          <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={`${option.color} text-xs px-2 py-0`}>
                                  {option.value === 'random' ? '?' : `C${option.value}`}
                                </Badge>
                                <span className="text-sm">{option.value === 'random' ? 'Aléatoire' : option.label.split(' - ')[1]}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Advancement Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Avancement dans la compétence</label>
                    <Select 
                      value={selectedAdvancement} 
                      onValueChange={setSelectedAdvancement} 
                      disabled={selectedLevel === 'random'}
                    >
                      <SelectTrigger 
                        className={`w-full ${selectedLevel === 'random' ? 'opacity-50' : ''}`} 
                        data-testid="select-advancement"
                      >
                        <SelectValue placeholder="Avancement" />
                      </SelectTrigger>
                      <SelectContent>
                        {advancementOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedLevel === 'random' && (
                      <p className="text-xs text-slate-500">Sélectionnez un niveau pour choisir l'avancement</p>
                    )}
                  </div>
                </div>

                {/* Trap Section */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Piège pédagogique
                  </h3>
                  
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-3">
                    <Select value={selectedTrap} onValueChange={setSelectedTrap}>
                      <SelectTrigger className="w-full bg-white border-orange-200" data-testid="select-trap">
                        <SelectValue placeholder="Choisir un piège" />
                      </SelectTrigger>
                      <SelectContent>
                        {trapOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.value !== 'none' && option.value !== 'random' && (
                                <AlertTriangle className="w-3 h-3 text-orange-500" />
                              )}
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <p className="text-xs text-orange-600">
                      Erreur typique à simuler pour l'exercice de jeu de rôle.
                      {selectedLevel !== 'random' && (
                        <span className="block mt-1 font-medium">
                          Les pièges affichés sont adaptés au niveau C{selectedLevel}.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Summary */}
                {hasCustomOptions && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-600 mb-2">Résumé des options :</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGender !== 'random' && (
                        <Badge className="bg-slate-100 text-slate-700">
                          {selectedGender === 'homme' ? 'Homme' : 'Femme'}
                        </Badge>
                      )}
                      {selectedLevel !== 'random' && (
                        <Badge className={getSelectedLevelColor()}>
                          C{selectedLevel}
                          {selectedAdvancement !== 'random' && ` • ${advancementOptions.find(a => a.value === selectedAdvancement)?.label}`}
                        </Badge>
                      )}
                      {selectedTrap !== 'none' && (
                        <Badge className="bg-orange-100 text-orange-800 border border-orange-200">
                          {trapOptions.find(t => t.value === selectedTrap)?.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Generate Button */}
          <Button
            data-testid="btn-generate-profile"
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Génération...
              </>
            ) : hasProfile ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Nouveau Profil
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Générer un Profil
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick summary of selected options */}
      {hasCustomOptions && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-medium">Options actives :</span>
          {selectedGender !== 'random' && (
            <Badge variant="secondary" className="bg-white text-slate-700 text-xs">
              {selectedGender === 'homme' ? 'Homme' : 'Femme'}
            </Badge>
          )}
          {selectedLevel !== 'random' && (
            <Badge variant="secondary" className={`${getSelectedLevelColor()} text-xs`}>
              C{selectedLevel}
              {selectedAdvancement !== 'random' && ` - ${advancementOptions.find(a => a.value === selectedAdvancement)?.label}`}
            </Badge>
          )}
          {selectedTrap !== 'none' && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {trapOptions.find(t => t.value === selectedTrap)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileGenerator;
