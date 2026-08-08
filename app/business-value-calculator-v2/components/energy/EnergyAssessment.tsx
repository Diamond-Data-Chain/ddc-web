"use client";

import { useMemo, useState } from "react";
import {
  calculateEnergyAssessment,
  EMPTY_ENERGY_INPUTS,
  type EnergyInputs,
} from "../../../business-value-calculator/energyValueModel";

import EnergyScope from "./EnergyScope";
import EnergyCosts from "./EnergyCosts";
import EnergyResults from "./EnergyResults";

export default function EnergyAssessment() {
  const [inputs, setInputs] = useState<EnergyInputs>({
    ...EMPTY_ENERGY_INPUTS,
  });

  const results = useMemo(
    () => calculateEnergyAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof EnergyInputs>(
    key: K,
    value: EnergyInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <EnergyScope inputs={inputs} update={update} />
      <EnergyCosts inputs={inputs} update={update} />
      <EnergyResults inputs={inputs} results={results} />
    </div>
  );
}
