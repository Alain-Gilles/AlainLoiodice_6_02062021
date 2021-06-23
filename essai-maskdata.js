// https://www.npmjs.com/package/maskdata#mask-email-id
// https://medium.com/@sumukha.hs369/hide-sensitive-information-in-node-js-84873503e5fa
const MaskData = require("maskdata");

const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false,
};

const email = "my.test.email@testEmail.com";

const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

console.log("email  ", email);
console.log("maskedEmail ", maskedEmail);
