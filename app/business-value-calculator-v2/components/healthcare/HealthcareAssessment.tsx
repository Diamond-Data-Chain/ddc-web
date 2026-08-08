"use client";

import { useMemo, useState } from "react";
import {
  calculateHealthcareAssessment,
  EMPTY_HEALTHCARE_INPUTS,
  type HealthcareInputs,
} from "../../../business-value-calculator/healthcareValueModel";

import HealthcareScope from "./HealthcareScope";
import HealthcareCosts from "./HealthcareCosts";
import HealthcareResults from "./HealthcareResults";

export default function HealthcareAssessment() {
  const [inputs, setInputs] = useState<HealthcareInputs>({
    ...EMPTY_HEALTHCARE_INPUTS,
  });

  const results = useMemo(
    () => calculateHealthcareAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof HealthcareInputs>(
    key: K,
    value: HealthcareInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <HealthcareScope inputs={inputs} update={update} />
      <HealthcareCosts inputs={inputs} update={update} />
      <HealthcareResults inputs={inputs} results={results} />
    </div>
  );
}
