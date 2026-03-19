import React from 'react';
import { 
  AlertTriangle, 
  Target,
  Zap,
  Eye,
  Gauge,
  Brain,
  Hand,
  CircleDot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const TrapDisplay = ({ trap }) => {
  if (!trap) return null;

  // Icon mapping for each trap type
  const getIcon = (trapId) => {
    const icons = {
      coordination: Hand,
      commandes: CircleDot,
      volant: Target,
      observation: Eye,
      vitesse: Gauge,
      stress: Brain
    };
    return icons[trapId] || Zap;
  };

  const Icon = getIcon(trap.id);

  return (
    <Card className="border-2 border-orange-300 shadow-md overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50" data-testid="trap-display">
      <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-orange-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          Piège Pédagogique à Jouer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trap Header */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-orange-200">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <Badge className="bg-orange-100 text-orange-800 border border-orange-300 mb-1">
              {trap.label}
            </Badge>
            <p className="text-sm text-slate-700">{trap.description}</p>
          </div>
        </div>

        {/* Symptoms to simulate */}
        <div>
          <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Comportements à simuler :
          </h4>
          <ul className="space-y-2">
            {trap.symptoms.map((symptom, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-white border border-orange-100 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-700">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Affected competencies */}
        <div className="p-3 rounded-lg bg-orange-100/50 border border-orange-200">
          <p className="text-xs font-medium text-orange-700 mb-2">Sous-compétences concernées :</p>
          <div className="flex flex-wrap gap-1">
            {trap.affectedCompetencies.map((compId, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className="bg-white text-orange-700 border border-orange-200 text-xs"
              >
                {compId.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tip for the instructor */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Conseil :</strong> L'élève jouant ce rôle doit manifester ces comportements progressivement 
            pour permettre au formateur de les identifier et d'y répondre pédagogiquement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrapDisplay;
