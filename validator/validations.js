export const validations = {
  required: () => ({
    isValid: (value) => value.trim() !== "",
    onError: "Este campo é requerido!",
  }),
  email: () => ({
    isValid: (value) =>
      String(value)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
    onError: "Este campo não é um email válido",
  }),
  min: (val) => ({
    isValid: (value) => value >= val,
    onError: `O valor mínimo para este campo é ${val}`,
  }),
  max: (val) => ({
    isValid: (value) => value >= val,
    onError: `O valor máximo para este campo é ${val}`,
  }),
};
