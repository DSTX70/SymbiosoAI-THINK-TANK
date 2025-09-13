import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WhyTransferPanel() {
  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50" data-testid="why-transfer-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
          Why transfer to Guided/Expert?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Carry forward context to reduce rework and errors.</span>
          </li>
          <li className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Increase answer quality via structured multi-agent rounds.</span>
          </li>
          <li className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Surface dissent and unresolved items explicitly.</span>
          </li>
          <li className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Produce a decision dossier (consensus + action plan).</span>
          </li>
        </ul>
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            💡 Tip: Use Guided for clearer framing; Expert for deep debate and traceable rationale.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}