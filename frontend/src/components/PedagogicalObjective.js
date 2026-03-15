import React from 'react';
import { 
  Crosshair, 
  AlertTriangle, 
  CheckCircle2,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const PedagogicalObjective = ({ objectives }) => {
  if (!objectives || objectives.length === 0) {
    return (
      <Card className="border border-slate-200 shadow-sm" data-testid="pedagogical-objectives">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-blue-600" />
            Objectifs Pédagogiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm text-emerald-700 font-medium">
              Excellent ! Toutes les compétences abordées sont maîtrisées.
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              Continuer la progression vers les compétences suivantes.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get competency color
  const getCompColor = (compName) => {
    const colors = {
      'C1': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
      'C2': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      'C3': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
      'C4': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800 border-purple-200' }
    };
    return colors[compName] || colors['C1'];
  };

  return (
    <Card className="border border-slate-200 shadow-sm overflow-hidden" data-testid="pedagogical-objectives">
      <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-amber-600" />
          Objectifs Pédagogiques Prioritaires
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Basés sur les sous-compétences à renforcer
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((obj, idx) => {
          const compColor = getCompColor(obj.competency);
          const isPriority = obj.priority === 'Prioritaire';

          return (
            <div 
              key={idx}
              className={`p-4 rounded-xl border ${isPriority ? 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50' : `${compColor.border} ${compColor.bg}`} transition-all duration-200 hover:shadow-md`}
              data-testid={`objective-${idx}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={compColor.badge}>
                    {obj.competency}-{obj.subCompetency}
                  </Badge>
                  {isPriority ? (
                    <Badge className="bg-red-100 text-red-800 border border-red-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {obj.priority}
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
                      {obj.priority}
                    </Badge>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-600">#{idx + 1}</span>
                </div>
              </div>

              {/* Sub-competency title */}
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Sous-compétence concernée
                </p>
                <p className="text-sm text-slate-700 line-clamp-2">
                  {obj.title}
                </p>
              </div>

              {/* Objective */}
              <div className={`p-3 rounded-lg bg-white border ${compColor.border}`}>
                <div className="flex items-start gap-2">
                  <Lightbulb className={`w-4 h-4 ${compColor.text} mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-1">Objectif de la prochaine séance</p>
                    <p className="text-sm text-slate-800 font-medium">
                      {obj.objective}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action indicator */}
              <div className="flex items-center justify-end mt-3">
                <div className={`flex items-center gap-1 text-xs ${compColor.text} font-medium`}>
                  <span>Planifier cette séance</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="font-medium">
              {objectives.filter(o => o.priority === 'Prioritaire').length} objectif(s) prioritaire(s) 
              et {objectives.filter(o => o.priority !== 'Prioritaire').length} à consolider
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PedagogicalObjective;
