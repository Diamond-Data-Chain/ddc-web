"use client";

import { useMemo, useState } from "react";
import {
  calculateInsuranceAssessment,
  EMPTY_INSURANCE_INPUTS,
  type InsuranceInputs,
} from "../../../business-value-calculator/insuranceValueModel";

import InsuranceScope from "./InsuranceScope";
import InsuranceCosts from "./InsuranceCosts";
import InsuranceResults from "./InsuranceResults";

export default function InsuranceAssessment() {
  const [inputs, setInputs] = useState<InsuranceInputs>({
    ...EMPTY_INSURANCE_INPUTS,
  });

  const results = useMemo(
    () => calculateInsuranceAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof InsuranceInputs>(
    key: K,
    value: InsuranceInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <InsuranceScope inputs={inputs} update={update} />
      <InsuranceCosts inputs={inputs} update={update} />
      <InsuranceResults inputs={inputs} results={results} />
    </div>
  );
}
