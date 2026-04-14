import React from 'react';
import { 
  History, 
  Car, 
  MonitorPlay, 
  Calendar, 
  Clock, 
  MapPin,
  MessageSquare,
  CheckCircle2,
  Target,
  BookOpen
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

  // Get last session details
  const lastSession = courseHistory.lastSession || {
    competencyId: 'c1',
    competencyName: 'C1',
    subCompetencyCode: 'A',
    subCompetencyTitle: 'Vérifications',
    context: courseHistory.lastContext || 'Parking',
    situation: 'Exercices pratiques',
    feedback: courseHistory.studentFeedback || 'Séance normale'
  };

  // Get competency color scheme
  const getCompColor = (compId) => {
    const colors = {
      c1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500', badge: 'bg-blue-100 text-blue-800' },
      c2: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-100 text-emerald-800' },
      c3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500', badge: 'bg-amber-100 text-amber-800' },
      c4: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-500 to-pink-500', badge: 'bg-purple-100 text-purple-800' }
    };
    return colors[compId] || colors.c1;
  };

  const compColor = getCompColor(lastSession.competencyId);

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
        <CardContent className="p-4 md:p-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-600" />
            Dernière Séance
          </h3>
          
          <div className="space-y-3">
            {/* Sub-competency worked on */}
            <div className={`p-3 rounded-xl ${compColor.bg} border-2 ${compColor.border}`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${compColor.badge} flex items-center justify-center font-bold text-sm`}>
                  {lastSession.competencyName}-{lastSession.subCompetencyCode}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${compColor.text} mb-0.5`}>Sous-compétence travaillée</p>
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {lastSession.subCompetencyTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Context and Situation */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3" />
                  Lieu
                </p>
                <p className="text-sm font-medium text-slate-700">{lastSession.context}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                  <Target className="w-3 h-3" />
                  Exercice
                </p>
                <p className="text-sm font-medium text-slate-700">{lastSession.situation}</p>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Car className="w-3 h-3" />
                Véhicule
              </span>
              <span className="text-sm font-medium text-slate-700">{courseHistory.vehicule}</span>
            </div>
            
            {/* Student feedback */}
            <div className="p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Retour de l'élève</p>
                  <p className="text-sm text-slate-700 italic">"{lastSession.feedback}"</p>
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
