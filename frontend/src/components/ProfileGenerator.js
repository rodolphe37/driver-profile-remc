import React from 'react';
import { Wand2, RefreshCw, Settings2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

const ProfileGenerator = ({ onGenerate, isGenerating, hasProfile, selectedLevel, setSelectedLevel, selectedAdvancement, setSelectedAdvancement }) => {
  
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

  const getSelectedLevelColor = () => {
    const option = levelOptions.find(o => o.value === selectedLevel);
    return option?.color || 'bg-slate-100 text-slate-700';
  };

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

      {/* Options Row */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Settings2 className="w-4 h-4" />
          <span className="font-medium">Options :</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Niveau</span>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[220px] h-9 bg-white" data-testid="select-level">
              <SelectValue placeholder="Choisir un niveau" />
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Avancement</span>
          <Select value={selectedAdvancement} onValueChange={setSelectedAdvancement} disabled={selectedLevel === 'random'}>
            <SelectTrigger className={`w-[180px] h-9 bg-white ${selectedLevel === 'random' ? 'opacity-50' : ''}`} data-testid="select-advancement">
              <SelectValue placeholder="Choisir l'avancement" />
            </SelectTrigger>
            <SelectContent>
              {advancementOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedLevel !== 'random' && (
          <Badge className={`${getSelectedLevelColor()} ml-auto`}>
            {selectedLevel !== 'random' && `C${selectedLevel}`} 
            {selectedAdvancement !== 'random' && ` • ${advancementOptions.find(a => a.value === selectedAdvancement)?.label}`}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProfileGenerator;
