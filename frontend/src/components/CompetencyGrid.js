import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ChevronDown,
  ChevronUp,
  Car,
  Route,
  Users,
  Compass
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const CompetencyGrid = ({ evaluation }) => {
  const [expandedComps, setExpandedComps] = useState(['c1', 'c2', 'c3', 'c4']);

  if (!evaluation) return null;

  const toggleExpand = (compId) => {
    setExpandedComps(prev => 
      prev.includes(compId) 
        ? prev.filter(id => id !== compId)
        : [...prev, compId]
    );
  };

  // Competency configurations
  const compConfig = {
    c1: {
      icon: Car,
      colors: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        gradient: 'from-blue-500 to-cyan-500',
        headerBg: 'bg-gradient-to-r from-blue-600 to-cyan-600'
      }
    },
    c2: {
      icon: Route,
      colors: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        gradient: 'from-emerald-500 to-teal-500',
        headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600'
      }
    },
    c3: {
      icon: Users,
      colors: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        gradient: 'from-amber-500 to-orange-500',
        headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500'
      }
    },
    c4: {
      icon: Compass,
      colors: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-pink-500',
        headerBg: 'bg-gradient-to-r from-purple-600 to-pink-600'
      }
    }
  };

  // Status configurations
  const getStatusConfig = (status, covered) => {
    if (!covered) {
      return {
        icon: XCircle,
        text: 'Non abordé',
        className: 'bg-slate-100 text-slate-500 border-slate-200'
      };
    }
    switch (status) {
      case 'fort':
        return {
          icon: CheckCircle2,
          text: 'Fort',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'moyen':
        return {
          icon: AlertCircle,
          text: 'Moyen',
          className: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'faible':
        return {
          icon: XCircle,
          text: 'Faible',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: XCircle,
          text: 'Non évalué',
          className: 'bg-slate-100 text-slate-500 border-slate-200'
        };
    }
  };

  // Calculate competency stats
  const getCompStats = (comp) => {
    const total = comp.subCompetencies.length;
    const covered = comp.subCompetencies.filter(s => s.covered).length;
    const strong = comp.subCompetencies.filter(s => s.covered && s.status === 'fort').length;
    const medium = comp.subCompetencies.filter(s => s.covered && s.status === 'moyen').length;
    const weak = comp.subCompetencies.filter(s => s.covered && s.status === 'faible').length;
    
    return { total, covered, strong, medium, weak };
  };

  const competencies = ['c1', 'c2', 'c3', 'c4'];

  return (
    <div className="space-y-4" data-testid="competency-grid">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Évaluation des Compétences
        </h2>
        <div className="flex gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Fort
          </Badge>
          <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" /> Moyen
          </Badge>
          <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs">
            <XCircle className="w-3 h-3 mr-1" /> Faible
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {competencies.map((compId) => {
          const comp = evaluation[compId];
          const config = compConfig[compId];
          const stats = getCompStats(comp);
          const Icon = config.icon;
          const isExpanded = expandedComps.includes(compId);

          return (
            <Card 
              key={compId} 
              className={`border ${config.colors.border} shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md`}
              data-testid={`card-competency-${compId}`}
            >
              <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(compId)}>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className={`${config.colors.headerBg} text-white p-4 cursor-pointer`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-base font-bold">{comp.name}</CardTitle>
                          <p className="text-xs text-white/80 font-normal line-clamp-1">{comp.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold">{stats.covered}/{stats.total}</p>
                          <p className="text-xs text-white/70">abordées</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    
                    {/* Mini stats bar */}
                    <div className="flex gap-1 mt-3">
                      {stats.strong > 0 && (
                        <div className="h-1.5 bg-emerald-400 rounded-full" style={{ width: `${(stats.strong / stats.total) * 100}%` }} />
                      )}
                      {stats.medium > 0 && (
                        <div className="h-1.5 bg-amber-400 rounded-full" style={{ width: `${(stats.medium / stats.total) * 100}%` }} />
                      )}
                      {stats.weak > 0 && (
                        <div className="h-1.5 bg-red-400 rounded-full" style={{ width: `${(stats.weak / stats.total) * 100}%` }} />
                      )}
                      {(stats.total - stats.covered) > 0 && (
                        <div className="h-1.5 bg-white/30 rounded-full" style={{ width: `${((stats.total - stats.covered) / stats.total) * 100}%` }} />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className={`p-4 ${config.colors.bg}`}>
                    <div className="space-y-2">
                      {comp.subCompetencies.map((sub, idx) => {
                        const statusConfig = getStatusConfig(sub.status, sub.covered);
                        const StatusIcon = statusConfig.icon;

                        return (
                          <div 
                            key={sub.id}
                            className={`p-3 rounded-lg bg-white border ${sub.covered ? config.colors.border : 'border-slate-200'} transition-all duration-200 hover:shadow-sm`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            data-testid={`subcomp-${sub.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${config.colors.bg} ${config.colors.text}`}>
                                {sub.code.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${sub.covered ? 'text-slate-800' : 'text-slate-500'} line-clamp-2`}>
                                  {sub.title}
                                </p>
                              </div>
                              <Badge className={`flex-shrink-0 ${statusConfig.className} text-xs`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.text}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompetencyGrid;
