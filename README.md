A Voice over Internet Protocol (VoIP) number is a virtual phone number that uses the internet to make and receive calls

I will be using a phone number as the single point

## Checks to find a legit customer

We will use a weighting system to verify if the customer is likely to be legitimate. I think the fair thing to do would be to first assume every customer is legitimate until they give us reasons otherwise so everyone will start with a score of 100. Then as we surface non-legit activity we will de-grade their score until all the checks have been performed. If the users score drops to a, currently arbitrary number below _60_ then we will need to follow up with some legit forms of testing legitimacy.

If the score drops to a lowish number just above the above 60% threshold then perhaps we could get a bot to call the number and get them to verify their name

# Checks to perform

- [] Country code matches application country address
- [] Reverse phone number lookup to see if the number is associated with a known person or business
- [] If it is a temporary number use Twilio Lookup
- [] See if the number has had a long usage history
- [] Spam call registries HLR Lookup
- [] Check to see if the phone number was pasted into the UI
- [] See if the phone number is one from a film there is a name for this type of number...
- [] Get a b to call the number to verify some info inputted in the form. If this is legit then perhaps bump their score up, else they loose more points or send them a code and call them to tell them to answer
- [] include a honey pot input to catch bots (invisible to screen readers) have a legit phone number field which has a different name. Bots would use the decoy
- [] There is probably a list of phony phone numbers somewhere, I hvave defo used 07777777779 before. Block these before calling any apis
- [] I wonder if there is a way to use the users device to identify if the number is tied to the specific device (would only work on mobile not desktop)
- [] get the average time to fill out a phone number filled. If the "user" fills in the input much quicker then it could potentially be a bot
- [] A phone number that has no digital footprint is suspicious. if a phone number is not linked to a social media account then perhaps suspicious
- [] Check to see if the phone number was recently ported to a new sim

Collect device information (browser fingerprint, IP, OS, etc.).
Check if the phone number matches a known device fingerprint or if it has been used on multiple different devices recently.
If multiple mismatches occur (e.g., phone number used on different devices within minutes), flag for fraud review.
Tools for device fingerprinting:

FingerprintJS
FraudLabs Pro
ThreatMetrix Device ID

1. number matches application data
   curl -X GET "https://lookups.twilio.com/v2/PhoneNumbers/{PhoneNumber}?Fields=caller_name" \ -u

2.
