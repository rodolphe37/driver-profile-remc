import React, { useState, useCallback } from 'react';
import "@/App.css";
import { generateProfile } from './utils/profileGenerator';
import ProfileGenerator from './components/ProfileGenerator';
import ProfileDisplay from './components/ProfileDisplay';
import CourseHistory from './components/CourseHistory';
import CompetencyGrid from './components/CompetencyGrid';
import PedagogicalObjective from './components/PedagogicalObjective';
import TrapDisplay from './components/TrapDisplay';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [profile, setProfile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('random');
  const [selectedAdvancement, setSelectedAdvancement] = useState('random');
  const [selectedGender, setSelectedGender] = useState('random');
  const [selectedTrap, setSelectedTrap] = useState('none');

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    
    // Small delay for animation effect
    setTimeout(() => {
      try {
        // Pass all options to generator
        const options = {
          level: selectedLevel === 'random' ? null : parseInt(selectedLevel),
          advancement: selectedAdvancement,
          gender: selectedGender,
          trap: selectedTrap
        };
        const newProfile = generateProfile(options);
        setProfile(newProfile);
        
        const levelNames = { 1: 'C1', 2: 'C2', 3: 'C3', 4: 'C4' };
        const levelName = levelNames[newProfile.progression.currentLevel];
        
        let description = `${newProfile.nomComplet}, ${newProfile.age} ans - ${newProfile.courseHistory.totalHours}h de conduite (${levelName})`;
        if (newProfile.trap) {
          description += ` • Piège: ${newProfile.trap.label}`;
        }
        
        toast.success('Nouveau profil généré !', {
          description: description,
        });
      } catch (error) {
        console.error('Error generating profile:', error);
        toast.error('Erreur lors de la génération', {
          description: 'Veuillez réessayer.',
        });
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  }, [selectedLevel, selectedAdvancement, selectedGender, selectedTrap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" data-testid="app-container">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <ProfileGenerator 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasProfile={!!profile}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedAdvancement={selectedAdvancement}
            setSelectedAdvancement={setSelectedAdvancement}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedTrap={selectedTrap}
            setSelectedTrap={setSelectedTrap}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!profile ? (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" data-testid="empty-state">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
              <svg 
                className="w-16 h-16 text-blue-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Aucun profil généré
            </h2>
            <p className="text-slate-500 max-w-md mb-6">
              Cliquez sur le bouton "Générer un Profil" pour créer un profil d'élève fictif 
              basé sur le référentiel REMC.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                C1: Maniement du véhicule
              </div>
              <div className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                C2: Appréhender la route
              </div>
              <div className="px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                C3: Conditions difficiles
              </div>
              <div className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                C4: Conduite autonome
              </div>
            </div>
          </div>
        ) : (
          // Profile Display Grid
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" data-testid="profile-content">
            {/* Left Column - Profile & History */}
            <div className="lg:col-span-4 space-y-6">
              <ProfileDisplay profile={profile} />
              {profile.trap && <TrapDisplay trap={profile.trap} />}
              <CourseHistory 
                courseHistory={profile.courseHistory} 
                evaluation={profile.evaluation}
              />
            </div>

            {/* Right Column - Competencies & Objectives */}
            <div className="lg:col-span-8 space-y-6">
              <CompetencyGrid evaluation={profile.evaluation} />
              <PedagogicalObjective objectives={profile.objectifs} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 mt-12">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                TP
              </div>
              <span>Générateur de Profil TPECSR</span>
            </div>
            <p>
              Basé sur le Référentiel pour l'Éducation à une Mobilité Citoyenne (REMC)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
