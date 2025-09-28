import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Users, FileText, Shield, Zap, Target } from 'lucide-react';

type TransferContext = {
  fromMode: 'simple' | 'guided' | 'expert';
  toMode: 'guided' | 'expert';
  sessionData?: {
    consensus?: string;
    dissents?: Array<{ position: string; reasoning?: string }>;
    unresolved?: string[];
    quality?: number;
  };
  transferReason?: 'upgrade_analysis' | 'need_deeper_insight' | 'consensus_building' | 'custom';
  customReason?: string;
};

type Props = {
  context?: TransferContext;
  showMetrics?: boolean;
};

const transferBenefits = {
  'simple-guided': {
    title: 'Simple → Guided Analysis',
    icon: Users,
    color: 'blue',
    benefits: [
      'Add structured multi-agent perspective rounds',
      'Introduce domain expert selection and routing',
      'Enable systematic consensus building process',
      'Generate comprehensive decision frameworks'
    ],
    metrics: { qualityBoost: '40-60%', timeIncrease: '2-3x', agents: '3-5' }
  },
  'simple-expert': {
    title: 'Simple → Expert Analysis',
    icon: Brain,
    color: 'purple',
    benefits: [
      'Enable full multi-agent collaborative reasoning',
      'Add advanced thinking patterns and frameworks',
      'Implement enterprise specialist perspectives',
      'Generate audit-ready decision documentation'
    ],
    metrics: { qualityBoost: '70-90%', timeIncrease: '3-5x', agents: '5-8' }
  },
  'guided-expert': {
    title: 'Guided → Expert Analysis',
    icon: Target,
    color: 'emerald',
    benefits: [
      'Unlock advanced reasoning methodologies',
      'Add enterprise-grade specialist perspectives',
      'Enable deep forensic analysis capabilities',
      'Generate comprehensive audit trails'
    ],
    metrics: { qualityBoost: '30-50%', timeIncrease: '1.5-2x', agents: '2-3 additional' }
  }
};

const transferReasons = {
  upgrade_analysis: {
    icon: Zap,
    title: 'Quality Enhancement',
    description: 'Current analysis quality could benefit from more sophisticated reasoning'
  },
  need_deeper_insight: {
    icon: Brain,
    title: 'Deeper Insight Required',
    description: 'Complex topic requires more thorough multi-perspective analysis'
  },
  consensus_building: {
    icon: Users,
    title: 'Consensus Building',
    description: 'Multiple dissenting views need structured debate resolution'
  },
  custom: {
    icon: FileText,
    title: 'Custom Requirements',
    description: 'Specific analytical needs require enhanced capabilities'
  }
};

export default function WhyTransferPanel({ context, showMetrics = false }: Props) {
  const transferKey = context ? `${context.fromMode}-${context.toMode}` as keyof typeof transferBenefits : 'simple-guided';
  const config = transferBenefits[transferKey];
  const reason = context?.transferReason ? transferReasons[context.transferReason] : null;

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50" data-testid="why-transfer-panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <config.icon size={20} />
            {config.title}
          </CardTitle>
          <Badge variant="secondary" className={
            config.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            config.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
            config.color === 'emerald' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }>
            Transfer Available
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Transfer Reason */}
        {reason && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <reason.icon size={16} className="text-orange-500" />
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {reason.title}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {context?.customReason || reason.description}
            </p>
          </div>
        )}

        {/* Current Session Context */}
        {context?.sessionData && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Current Analysis Status:
            </div>
            
            {context.sessionData.consensus && (
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-2 rounded border-l-2 border-green-400">
                <span className="font-medium">Consensus: </span>
                {context.sessionData.consensus.substring(0, 100)}...
              </div>
            )}
            
            <div className="flex gap-4 text-xs">
              {context.sessionData.dissents && context.sessionData.dissents.length > 0 && (
                <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  {context.sessionData.dissents.length} dissenting views
                </div>
              )}
              
              {context.sessionData.unresolved && context.sessionData.unresolved.length > 0 && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  {context.sessionData.unresolved.length} unresolved questions
                </div>
              )}
              
              {context.sessionData.quality && (
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  {Math.round(context.sessionData.quality)}% confidence
                </div>
              )}
            </div>
          </div>
        )}

        {/* Benefits List */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Enhanced Capabilities:
          </div>
          
          <ul className="space-y-2 text-sm">
            {config.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                <ArrowRight size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Performance Metrics */}
        {showMetrics && config.metrics && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Shield size={16} />
              Expected Performance Impact:
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="font-medium text-green-600 dark:text-green-400">
                  +{config.metrics.qualityBoost}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Quality</div>
              </div>
              
              <div className="text-center">
                <div className="font-medium text-orange-600 dark:text-orange-400">
                  {config.metrics.timeIncrease}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Time</div>
              </div>
              
              <div className="text-center">
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  {config.metrics.agents}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Agents</div>
              </div>
            </div>
          </div>
        )}

        {/* Guidance Tip */}
        <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            💡 <strong>Pro Tip:</strong> {
              context?.toMode === 'guided' 
                ? 'Guided mode provides structured analysis with clear step-by-step reasoning.'
                : context?.toMode === 'expert'
                  ? 'Expert mode offers the deepest analysis with comprehensive audit trails and enterprise-grade insights.'
                  : 'Each mode builds upon the previous, carrying forward all context and insights while adding enhanced capabilities.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}