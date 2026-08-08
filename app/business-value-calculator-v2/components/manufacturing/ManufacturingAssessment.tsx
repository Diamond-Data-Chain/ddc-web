"use client";

import { useMemo, useState } from "react";
import {
  calculateManufacturingAssessment,
  EMPTY_MANUFACTURING_INPUTS,
  type ManufacturingInputs,
} from "../../../business-value-calculator/manufacturingValueModel";

import ManufacturingScope from "./ManufacturingScope";
import ManufacturingCosts from "./ManufacturingCosts";
import ManufacturingResults from "./ManufacturingResults";

export default function ManufacturingAssessment() {
  const [inputs, setInputs] = useState<ManufacturingInputs>({
    ...EMPTY_MANUFACTURING_INPUTS,
  });

  const results = useMemo(
    () => calculateManufacturingAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof ManufacturingInputs>(
    key: K,
    value: ManufacturingInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <ManufacturingScope inputs={inputs} update={update} />

      <ManufacturingCosts inputs={inputs} update={update} />

      <ManufacturingResults inputs={inputs} results={results} />
    </div>
  );
}
