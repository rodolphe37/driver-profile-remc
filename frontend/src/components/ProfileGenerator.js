import React from 'react';
import { Wand2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const ProfileGenerator = ({ onGenerate, isGenerating, hasProfile }) => {
  return (
    <div className="flex items-center justify-between w-full" data-testid="profile-generator">
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
  );
};

export default ProfileGenerator;
