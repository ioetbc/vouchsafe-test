# How to run

1. Add twillio env vars to `.env` take a look at `env.example`
2. `pnpm run`
3. `curl http://localhost:3000/api/risk-engine`

# Checks to perform

[x] Country code matches application country address
[x] Is a Voip number
[x] Within reserved phone number rage (Ofcom)
[x] SMS pumping risk
[] Reverse phone number lookup to see if the number is associated with a known person or business
[] See if the number has had a long usage history
[] Spam call registries HLR Lookup
[] There is probably a list of phony phone numbers somewhere, I have defo used 07777777779 before.
[] User device to identify if the number is tied to that specific device
[] A phone number that has no digital footprint is suspicious
[] Check to see if the phone number was recently ported to a new sim
[] Phone number been used on multiple devices
[] Check to see if the phone number was pasted into the UI
[] A honey pot input on the form which is only visible to bots
[] Time to fill out a phone number. Quick inputs could be suspicious

# Notes

A risk engine which accepts different risk factors (iv’e focused on the phone risk for now) but it could be extended in the future to include other data points such as email, face id, address etc.

The idea is that each user begins with a perfect score of 1 meaning they are of no risk.

We the run various checks against their application and deduct from their initial score based on severity of failure.

1. ReverseNumberLookup
2. VoiceOverInternetProtocol
3. SmsPumpingRisk
4. CountryCodeMatchesApplication
5. SpamCallRegistry

A flag is raised if any checks indicate suspicious activity.

The more deductions, the higher the risk.

Weights allow different risk factors to influence the overall risk score. We can make certain checks more influential by adjusting weights in the `WEIGHTS` object.

The RiskEngine class aggregates results, while individual risk factor classes run their own independent checks
