"use client";

import { useMemo, useState } from "react";
import {
  calculateBankingAssessment,
  EMPTY_BANKING_INPUTS,
  type BankingInputs,
} from "../../../business-value-calculator/bankingValueModel";

import BankingScope from "./BankingScope";
import BankingCosts from "./BankingCosts";
import BankingResults from "./BankingResults";

export default function BankingAssessment() {
  const [inputs, setInputs] = useState<BankingInputs>({
    ...EMPTY_BANKING_INPUTS,
  });

  const results = useMemo(
    () => calculateBankingAssessment(inputs),
    [inputs]
  );

  const update = <K extends keyof BankingInputs>(
    key: K,
    value: BankingInputs[K]
  ) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 space-y-8">
      <BankingScope inputs={inputs} update={update} />
      <BankingCosts inputs={inputs} update={update} />
      <BankingResults inputs={inputs} results={results} />
    </div>
  );
}
