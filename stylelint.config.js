module.exports = {
  plugins: ['stylelint-order', 'stylelint-scss'],
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    'order/properties-alphabetical-order': true,
    'no-invalid-position-at-import-rule': null
  }
};
