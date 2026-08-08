"use client";

import { useMemo, useState } from "react";
import {
  calculateAIAssessment,
  EMPTY_AI_INPUTS,
  type AIInputs,
} from "../../../business-value-calculator/aiValueModel";

import AIScope from "./AIScope";
import AICosts from "./AICosts";
import AIResults from "./AIResults";

export default function AIAssessment() {
  const [inputs, setInputs] = useState<AIInputs>({
    ...EMPTY_AI_INPUTS,
  });

  const results = useMemo(
    () => calculateAIAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof AIInputs>(
    key: K,
    value: AIInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <AIScope inputs={inputs} update={update} />
      <AICosts inputs={inputs} update={update} />
      <AIResults inputs={inputs} results={results} />
    </div>
  );
}
