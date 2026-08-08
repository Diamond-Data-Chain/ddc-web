"use client";

import { useMemo, useState } from "react";
import {
  calculateOtherAssessment,
  EMPTY_OTHER_INPUTS,
  type OtherInputs,
} from "../../../business-value-calculator/otherValueModel";

import OtherScope from "./OtherScope";
import OtherCosts from "./OtherCosts";
import OtherResults from "./OtherResults";

export default function OtherAssessment() {
  const [inputs, setInputs] = useState<OtherInputs>({
    ...EMPTY_OTHER_INPUTS,
  });

  const results = useMemo(
    () => calculateOtherAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof OtherInputs>(
    key: K,
    value: OtherInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <OtherScope inputs={inputs} update={update} />
      <OtherCosts inputs={inputs} update={update} />
      <OtherResults inputs={inputs} results={results} />
    </div>
  );
}
