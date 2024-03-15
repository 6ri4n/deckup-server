const {
  passwordConstants: { minimum, regex },
} = require("./passwordConstants");

const strongPassword = (password) => {
  if (password.length < minimum.characters) {
    return false;
  }

  if ((password.match(regex.lowercase) || []).length < minimum.lowercase) {
    return false;
  }

  if ((password.match(regex.uppercase) || []).length < minimum.uppercase) {
    return false;
  }

  if ((password.match(regex.numbers) || []).length < minimum.numbers) {
    return false;
  }

  if ((password.match(regex.symbols) || []).length < minimum.symbols) {
    return false;
  }

  return true;
};

module.exports = strongPassword;
