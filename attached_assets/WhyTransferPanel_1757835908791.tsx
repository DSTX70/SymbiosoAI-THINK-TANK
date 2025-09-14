import React from 'react';

export default function WhyTransferPanel() {
  return (
    <div data-testid="why-transfer-panel" className="rounded-xl p-4 border">
      <h3 className="text-lg font-semibold">Why transfer to Guided/Expert?</h3>
      <ul className="list-disc ml-6 mt-2 space-y-1">
        <li>Carry forward context to reduce rework and errors.</li>
        <li>Increase answer quality via structured multi-agent rounds.</li>
        <li>Surface dissent and unresolved items explicitly.</li>
        <li>Produce a decision dossier (consensus + action plan).</li>
      </ul>
      <p className="text-sm mt-3 opacity-80">Tip: Use Guided for clearer framing; Expert for deep debate and traceable rationale.</p>
    </div>
  );
}
