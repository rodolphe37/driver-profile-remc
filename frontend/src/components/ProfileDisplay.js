import React from 'react';
import { 
  User, 
  Briefcase, 
  Heart, 
  Users, 
  Car, 
  MapPin, 
  Target,
  AlertCircle,
  Bike
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const ProfileDisplay = ({ profile }) => {
  if (!profile) return null;

  const InfoItem = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value || 'Non renseigné'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4" data-testid="profile-display">
      {/* Main Profile Card */}
      <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden" data-testid="card-profile-main">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="p-6">
          {/* Header with Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/25">
                {profile.prenom[0]}{profile.nom[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
                <span className="text-xs font-bold text-slate-700">{profile.age}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {profile.nomComplet}
              </h2>
              <p className="text-sm text-slate-500">{profile.genre} • {profile.age} ans</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {profile.courseHistory.totalHours}h de conduite
                </Badge>
                {profile.courseHistory.hasAAC && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                    AAC
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Progression */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Progression REMC</span>
              <span className="text-sm font-bold text-slate-800">{profile.progression.percentage}%</span>
            </div>
            <Progress value={profile.progression.percentage} className="h-2" />
            <p className="text-xs text-slate-500 mt-2">
              {profile.progression.covered} / {profile.progression.total} sous-compétences abordées
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoItem icon={Briefcase} label="Occupation" value={profile.occupation} highlight />
            <InfoItem icon={MapPin} label="Résidence" value={profile.lieuResidence} />
            <InfoItem icon={Users} label="Fratrie" value={profile.siblings} />
            <InfoItem icon={Bike} label="Mobilité actuelle" value={profile.mobilite} />
          </div>
        </CardContent>
      </Card>

      {/* Secondary Info Card */}
      <Card className="border border-slate-200 shadow-sm" data-testid="card-profile-details">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Contexte Personnel
          </h3>
          
          <div className="space-y-4">
            {/* Hobbies */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Centres d'intérêt</p>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby, idx) => (
                  <Badge key={idx} variant="outline" className="bg-white text-slate-700 border-slate-200">
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Parents */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-medium text-slate-500">Profession mère</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">{profile.professionMere}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-xs font-medium text-slate-500">Profession père</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">{profile.professionPere}</p>
              </div>
            </div>

            {/* Special Needs */}
            {profile.besoinSpecial && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs font-medium text-amber-700">Besoin spécifique</p>
                </div>
                <p className="text-sm font-semibold text-amber-800 mt-1">{profile.besoinSpecial}</p>
              </div>
            )}

            {/* Motivation */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Motivation</p>
              </div>
              <p className="text-sm text-slate-700 italic">"{profile.motivation}"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDisplay;
