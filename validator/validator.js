import { validations } from "./validations.js";

class Validator {
  constructor(form) {
    this.form = form;
    this.form.addEventListener("submit", this.submit.bind(this));
    this.inputs = [...this.form.querySelectorAll("input, select, textarea")];
    for (let input of this.inputs) {
      input.addEventListener("input", () => this.validateInput(input));
    }
  }

  submit(e) {
    if (!this.validateAll()) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  validateAll() {
    let isValid = true;
    for (let input of this.inputs) {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    }
    return isValid;
  }

  validateInput(input) {
    this.clearInputErrors(input);
    let isValid = true;
    for (let name in validations) {
      if (!input.hasAttribute(name)) continue;

      let param = input.getAttribute(name);
      let validation = validations[name](param);
      if (!validation.isValid(input.value)) {
        this.showInputErrors(input, validation.onError);
        isValid = false;
      }
    }
    return isValid;
  }

  showInputErrors(input, errors) {
    let container = this.form.querySelector(`.${input.name}_errors`);
    if (container) {
      container.innerText = errors;
      return;
    }

    const div = document.createElement("div");
    div.classList.add(`${input.name}_errors`, "has-errors", "error-label");
    div.innerText = errors;
    input.classList.add("has-errors");
    input.parentNode.insertBefore(div, input.nextSibling);
  }

  clearInputErrors(input) {
    this.form.querySelector(`.${input.name}_errors`)?.remove();
    input.classList.remove("has-errors");
  }

  clearAll() {
    this.form.querySelector(`.${input.name}_errors`)?.remove();
    for (let input of this.inputs) {
      input.classList.remove("has-errors");
    }
  }
}

const forms = [...document.querySelectorAll("form[withValidations]")];
const validators = [];
for (let form of forms) {
  validators.push(new Validator(form));
}
