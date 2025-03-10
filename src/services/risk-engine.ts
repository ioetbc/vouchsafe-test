import {RiskScore} from "../types";
import {promiseResults} from "../helpers/promise-results";
import {sum} from "../helpers/sum";

export interface RiskFactor {
  evaluateLocalRisk(): Promise<RiskScore>;
}

export class RiskEngine {
  riskFactors: RiskFactor[];

  constructor(riskFactors: RiskFactor[]) {
    this.riskFactors = riskFactors;
  }

  async evaluateRisk() {
    const results = await Promise.allSettled(
      this.riskFactors.map((factor) => factor.evaluateLocalRisk())
    );

    // better name / function that calls allSettled and logs errors in a helper
    return promiseResults(results);
  }

  calculateScore(results: RiskScore[]) {
    const score = sum(results.map((result) => result.score));

    return score;
  }

  async calculateUserRisk() {
    const results = await this.evaluateRisk();

    const score = this.calculateScore(results);
    const reasons = results.flatMap((result) => result.results);
    const suspect = reasons.some((result) => result.suspect);

    return {
      score,
      suspect,
      results: reasons,
    };
  }
}
