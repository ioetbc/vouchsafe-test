import twilio from "twilio";
import "dotenv/config";
import {sum} from "../helpers/sum";
import {RiskScore, Application, FactorResult} from "../types";
import {VOIP_CARRIERS, WEIGHTS} from "../consts";
import {RiskFactor} from "./risk-engine";
import {PhoneNumberInstance} from "twilio/lib/rest/lookups/v2/phoneNumber";
import {calculateRiskFactorScore} from "../helpers/calculate-weights";

const cache = new Map();

type Risk = Promise<FactorResult | undefined>;

export class PhoneNumberRisk implements RiskFactor {
  phone: string;
  twilio_client: twilio.Twilio;
  country: string;

  constructor(application: Application) {
    this.phone = application.phone;
    this.country = application.country;
    this.twilio_client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  normalisePhoneNumber(phone: string): number {
    return parseInt(phone.replace(/\D/g, ""), 10);
  }

  private async twilioPhoneNumberLookup(): Promise<
    PhoneNumberInstance | undefined
  > {
    if (cache.has(this.phone)) {
      return cache.get(this.phone);
    }

    try {
      const risk = await this.twilio_client.lookups.v2
        .phoneNumbers(this.phone)
        .fetch({
          fields:
            "sms_pumping_risk,phone_number_quality_score,line_type_intelligence,sim_swap",
        });

      cache.set(this.phone, risk);
      return risk;
    } catch (error) {
      console.error(`Twilio lookup failed for ${this.phone}:`, error);
      return undefined;
    }
  }

  private async reverseNumberLookup(): Risk {
    const isReverseLookup = false;

    return isReverseLookup
      ? {
          suspect: true,
          deduction: 0.5,
          reason: "This phone number has been reverse looked up",
        }
      : undefined;
  }

  private async smsPumpingRisk(): Risk {
    const twilio = await this.twilioPhoneNumberLookup();
    const isSmsPumping = twilio?.smsPumpingRisk.sms_pumping_risk_score > 20;

    return isSmsPumping
      ? {
          suspect: true,
          deduction: 0.5,
          reason: "This phone number has a high SMS pumping risk",
        }
      : undefined;
  }

  private async voiceOverInternetProtocol(): Risk {
    const twilio = await this.twilioPhoneNumberLookup();

    const isVoip = VOIP_CARRIERS.includes(twilio?.lineTypeIntelligence.type);

    return isVoip
      ? {
          suspect: true,
          deduction: 0.2,
          reason: "This phone number uses voice over internet protocol",
        }
      : undefined;
  }

  private async countryCodeMatchesApplication(): Promise<
    FactorResult | undefined
  > {
    const twilio = await this.twilioPhoneNumberLookup();
    const applicationMisMatch = twilio?.countryCode !== this.country;

    return applicationMisMatch
      ? {
          suspect: true,
          deduction: 0.1,
          reason: "The country code does not match the application",
        }
      : undefined;
  }

  private async spamCallRegistry(): Risk {
    const isSpamCallRegistry = false;

    return isSpamCallRegistry
      ? {
          suspect: true,
          deduction: 0.4,
          reason: "Phone number is registered as spam",
        }
      : undefined;
  }

  private async reservedOfcomNumbers(): Risk {
    const normalisedPhoneNumber = this.normalisePhoneNumber(this.phone);

    const range = {start: 7700900000, end: 7700900999};
    const inRange =
      normalisedPhoneNumber >= range.start &&
      normalisedPhoneNumber <= range.end;

    return inRange
      ? {
          suspect: true,
          deduction: 1,
          reason: "Phone number is a fictitious number",
        }
      : undefined;
  }

  async evaluateLocalRisk(): Promise<RiskScore> {
    const isReservedOfcomNumber = await this.reservedOfcomNumbers();

    if (isReservedOfcomNumber) {
      return {
        suspect: true,
        score: 1,
        results: [isReservedOfcomNumber],
      };
    }

    // Check to see that it looks like a real number

    const checks = [
      this.reverseNumberLookup,
      this.voiceOverInternetProtocol,
      this.smsPumpingRisk,
      this.countryCodeMatchesApplication,
      this.spamCallRegistry,
    ];

    const results = await Promise.allSettled(
      checks.map((check) => check.call(this))
    );

    const fulfilledResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const suspectChecks = fulfilledResults.filter(
      (result) => result !== undefined
    );

    const deductions = sum(suspectChecks.map(({deduction}) => deduction));
    const score = calculateRiskFactorScore({
      score: deductions,
      weight: WEIGHTS.phone,
    });

    return {
      suspect: suspectChecks.length > 0,
      score,
      results: suspectChecks,
    };
  }
}
