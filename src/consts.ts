import {Application, Weights} from "./types";

export const WEIGHTS: Weights = {
  phone: 0.5,
  email: 0.5,
  passportNumber: 0.9,
  address: 0.2,
};

const validPhoneNumber = "+447493774943";
const pumpingRisk = "+447772000001";
const fictitiousNumber = "7700900001";
const voipCarrier = "+441234567890"; // no working

export const APPLICATION: Application = {
  phone: pumpingRisk,
  email: "test@test.com",
  country: "GB",
  passportNumber: "1234567890",
  address: "123 Main St, London, UK",
};

export const VOIP_CARRIERS = ["nonFixedVoip", "fixedVoip"];
