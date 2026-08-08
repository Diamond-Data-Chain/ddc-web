"use client";

import { useMemo, useState } from "react";
import {
  calculateTransportAssessment,
  EMPTY_TRANSPORT_INPUTS,
  type TransportInputs,
} from "../../../business-value-calculator/transportValueModel";

import TransportScope from "./TransportScope";
import TransportCosts from "./TransportCosts";
import TransportResults from "./TransportResults";

export default function TransportAssessment() {
  const [inputs, setInputs] = useState<TransportInputs>({
    ...EMPTY_TRANSPORT_INPUTS,
  });

  const results = useMemo(
    () => calculateTransportAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof TransportInputs>(
    key: K,
    value: TransportInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <TransportScope inputs={inputs} update={update} />
      <TransportCosts inputs={inputs} update={update} />
      <TransportResults inputs={inputs} results={results} />
    </div>
  );
}
