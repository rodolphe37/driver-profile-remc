import React from 'react';
import { Wand2, RefreshCw, Settings2, AlertTriangle } from 'lucide-react';
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
import { ScrollArea } from './ui/scroll-area';

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
    { value: '1', label: 'C1 - Maniement', color: 'bg-blue-100 text-blue-700' },
    { value: '2', label: 'C2 - Route', color: 'bg-emerald-100 text-emerald-700' },
    { value: '3', label: 'C3 - Difficile', color: 'bg-amber-100 text-amber-700' },
    { value: '4', label: 'C4 - Autonome', color: 'bg-purple-100 text-purple-700' },
  ];

  const advancementOptions = [
    { value: 'random', label: 'Aléatoire' },
    { value: 'debut', label: 'Début' },
    { value: 'milieu', label: 'Milieu' },
    { value: 'fin', label: 'Fin' },
  ];

  const genderOptions = [
    { value: 'random', label: 'Aléatoire' },
    { value: 'homme', label: 'Homme' },
    { value: 'femme', label: 'Femme' },
  ];

  // Traps with their associated competency levels and sub-competencies
  const allTrapOptions = [
    { value: 'none', label: 'Aucun piège', levels: [1, 2, 3, 4] },
    { value: 'random', label: 'Piège aléatoire', levels: [1, 2, 3, 4] },
    { value: 'coordination', label: 'Coordination', levels: [1, 2], hint: 'C1d, C1e, C1f' },
    { value: 'commandes', label: 'Commandes', levels: [1], hint: 'C1a, C1b, C1h' },
    { value: 'volant', label: 'Volant', levels: [1, 2], hint: 'C1c, C1g, C1i' },
    { value: 'observation', label: 'Observation', levels: [1, 2, 3], hint: 'C1h, C2a, C3a' },
    { value: 'vitesse', label: 'Vitesse', levels: [2, 3], hint: 'C1e, C2c, C3a' },
    { value: 'stress', label: 'Stress', levels: [2, 3, 4], hint: 'C2d, C3b, C3f' },
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
    <div className="flex flex-col gap-3 w-full" data-testid="profile-generator">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
          <Wand2 className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Générateur REMC
        </h1>
      </div>

      {/* Buttons Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Options Modal Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`relative px-3 py-2 rounded-lg font-medium border-2 transition-all duration-200 ${
                hasCustomOptions 
                  ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              data-testid="btn-open-options"
            >
              <Settings2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Options</span>
              {hasCustomOptions && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[450px] max-h-[90vh] p-0">
            <DialogHeader className="p-4 pb-2 border-b border-slate-100">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Settings2 className="w-5 h-5 text-blue-600" />
                Options de génération
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh]">
              <div className="p-4 space-y-5">
                {/* Profile Options Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Profil de l'élève
                  </h3>
                  
                  {/* Gender & Level Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">Genre</label>
                      <Select value={selectedGender} onValueChange={setSelectedGender}>
                        <SelectTrigger className="w-full h-9 text-sm" data-testid="select-gender">
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

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600">Niveau</label>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger className="w-full h-9 text-sm" data-testid="select-level">
                          <SelectValue placeholder="Niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={`${option.color} text-xs px-1.5 py-0`}>
                                  {option.value === 'random' ? '?' : `C${option.value}`}
                                </Badge>
                                <span className="text-sm">{option.label.split(' - ')[1] || option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Advancement Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Avancement</label>
                    <Select 
                      value={selectedAdvancement} 
                      onValueChange={setSelectedAdvancement} 
                      disabled={selectedLevel === 'random'}
                    >
                      <SelectTrigger 
                        className={`w-full h-9 text-sm ${selectedLevel === 'random' ? 'opacity-50' : ''}`} 
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
                      <p className="text-xs text-slate-400">Sélectionnez un niveau d'abord</p>
                    )}
                  </div>
                </div>

                {/* Trap Section */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-orange-600 uppercase tracking-wide flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Piège pédagogique
                  </h3>
                  
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 space-y-2">
                    <Select value={selectedTrap} onValueChange={setSelectedTrap}>
                      <SelectTrigger className="w-full h-9 text-sm bg-white border-orange-200" data-testid="select-trap">
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
                              {option.hint && (
                                <span className="text-xs text-slate-400">({option.hint})</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <p className="text-xs text-orange-600">
                      Erreur à simuler pour le jeu de rôle
                    </p>
                  </div>
                </div>

                {/* Summary */}
                {hasCustomOptions && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs font-medium text-slate-500 mb-2">Résumé :</p>
                    <div className="flex flex-wrap gap-1.5">
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
                          {trapOptions.find(t => t.value === selectedTrap)?.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Generate Button */}
        <Button
          data-testid="btn-generate-profile"
          onClick={onGenerate}
          disabled={isGenerating}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md shadow-blue-500/25 transition-all duration-200 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
              <span className="hidden sm:inline">Génération...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : hasProfile ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Nouveau Profil</span>
              <span className="sm:hidden">Nouveau</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Générer un Profil</span>
              <span className="sm:hidden">Générer</span>
            </>
          )}
        </Button>

        {/* Active options badges - inline on mobile */}
        {hasCustomOptions && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedGender !== 'random' && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5">
                {selectedGender === 'homme' ? 'H' : 'F'}
              </Badge>
            )}
            {selectedLevel !== 'random' && (
              <Badge variant="secondary" className={`${getSelectedLevelColor()} text-xs px-2 py-0.5`}>
                C{selectedLevel}
              </Badge>
            )}
            {selectedTrap !== 'none' && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
                <AlertTriangle className="w-3 h-3" />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileGenerator;
