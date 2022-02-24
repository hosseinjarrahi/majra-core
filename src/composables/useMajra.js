let registeredFields = {};

export default () => {
  function registerFields(fields) {
    registeredFields = fields;
  }

  return { registerFields, registeredFields };
};
