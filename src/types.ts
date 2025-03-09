export type Application = {
  phone: string;
  email: string;
  country: string;
  passportNumber: string;
  address: string;
};

export type Weights = {
  phone: number;
  email: number;
  passportNumber: number;
  address: number;
};

export type RiskScore = {
  suspect: boolean;
  score: number;
  results: FactorResult[];
};

export type FactorResult = {
  suspect: boolean;
  deduction: number;
  reason: string;
};
