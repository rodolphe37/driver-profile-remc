import React from 'react';
import { 
  History, 
  Car, 
  MonitorPlay, 
  Calendar, 
  Clock, 
  MapPin,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const CourseHistory = ({ courseHistory, evaluation }) => {
  if (!courseHistory) return null;

  // Format date to French locale
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Calculate days since enrollment
  const daysSinceEnrollment = () => {
    const enrollment = new Date(courseHistory.enrollmentDate);
    const now = new Date();
    const diff = Math.floor((now - enrollment) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Get current competency from course history (now properly set based on hours)
  const currentComp = courseHistory.currentCompetency || {
    id: 'c1',
    name: 'C1',
    title: remcData?.c1?.title || 'Maîtriser le maniement du véhicule'
  };

  // Get competency color scheme
  const getCompColor = (compId) => {
    const colors = {
      c1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500' },
      c2: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-500' },
      c3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500' },
      c4: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-pink-500' }
    };
    return colors[compId] || colors.c1;
  };

  const compColor = getCompColor(currentComp.id);

  // Level descriptions
  const getLevelDescription = (level) => {
    const descriptions = {
      1: "Maniement du véhicule (trafic faible)",
      2: "Circulation normale",
      3: "Conditions difficiles",
      4: "Conduite autonome"
    };
    return descriptions[level] || descriptions[1];
  };

  return (
    <div className="space-y-4" data-testid="course-history">
      {/* Hours Overview Card */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden" data-testid="card-hours-overview">
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            Historique de Formation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hours Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-blue-500 text-white mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-blue-700">{courseHistory.totalHours}h</p>
              <p className="text-xs text-blue-600 font-medium">Heures totales</p>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-emerald-500 text-white mb-2">
                <Car className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">{courseHistory.realDrivingHours}h</p>
              <p className="text-xs text-emerald-600 font-medium">Conduite réelle</p>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 text-center">
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-violet-500 text-white mb-2">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-violet-700">{courseHistory.simulatorHours}h</p>
              <p className="text-xs text-violet-600 font-medium">Simulateur</p>
            </div>
          </div>

          {/* Progress to 20h minimum */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Progression vers 20h minimum</span>
              <span className="text-sm font-bold text-slate-800">{Math.min(100, Math.round((courseHistory.totalHours / 20) * 100))}%</span>
            </div>
            <Progress value={Math.min(100, (courseHistory.totalHours / 20) * 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card className="border border-slate-200 shadow-sm" data-testid="card-timeline">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Chronologie
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Date d'inscription</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(courseHistory.enrollmentDate)}</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Il y a {daysSinceEnrollment()} jours
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Dernière leçon</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(courseHistory.lastLessonDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Session Card */}
      <Card className="border border-slate-200 shadow-sm" data-testid="card-last-session">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <Car className="w-4 h-4 text-slate-600" />
            Dernière Séance
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-600">Véhicule</span>
              <span className="text-sm font-semibold text-slate-800">{courseHistory.vehicule}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <span className="text-sm text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Contexte
              </span>
              <Badge variant="outline" className={`${compColor.bg} ${compColor.text} ${compColor.border}`}>
                {courseHistory.lastContext}
              </Badge>
            </div>

            <div className={`p-3 rounded-lg ${compColor.bg} border ${compColor.border}`}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className={`w-4 h-4 ${compColor.text}`} />
                <span className={`text-xs font-medium ${compColor.text}`}>Compétence travaillée</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{currentComp.name} - {currentComp.title}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Retour de l'élève</p>
                  <p className="text-sm text-slate-700 italic">"{courseHistory.studentFeedback}"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {courseHistory.hasAAC && (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
            Conduite Accompagnée (AAC)
          </Badge>
        )}
        {courseHistory.hasSimulator && (
          <Badge className="bg-violet-100 text-violet-800 border border-violet-200">
            Formation Simulateur
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CourseHistory;
