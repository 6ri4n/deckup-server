const minimum = {
  characters: 6,
  lowercase: 1,
  uppercase: 1,
  numbers: 1,
  symbols: 1,
};

const regex = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  numbers: /[0-9]/,
  symbols: /[!@#$%&]/,
};

exports.passwordConstants = {
  minimum,
  regex,
};
