function writeInputs() {
  var html = `
    <div class="input">
        <label>{titulo}</label>
        <input type="number" step="1" min="6" value="6" />
    </div>
    `;
  var elementos = ["Capacete", "Ombreira", "Armadura", "Calça", "Luva", "Arma"];
  elementos.forEach((label, index) => {
    document.querySelector("body").innerHTML += html.replace("{titulo}", label);
  });
}

function writeResolution() {
  document.querySelector("body").innerHTML += `
    <div class="result">
        <label>Seu ILVL:</label>
        <b id="ilvl"></b>
    </div>
    `;
}

function getItemLvl(val) {
  if (val <= 15) {
    return (val - 6) * 5;
  }

  let inicio = (15 - 6) * 5;
  return inicio + (val - 15) * 15;
}

function validaValor(valor) {
  if (valor < 6) {
    document.getElementById("ilvl").innerText =
      "Valor de refino inválido (abaixo de 6)";
    return false;
  }
  return true;
}

function calculaItemLvl() {
  let inputs = document.querySelectorAll("input");

  let mediaSum = 0;
  let numeroElementos = 0;
  let invalido = false;
  [...inputs].forEach((ipt) => {
    if (!validaValor(ipt.value)) {
      mediaSum = 0;
      numeroElementos = 0;
      invalido = true;
    }

    if (invalido) return;

    let intVal = parseInt(ipt.value);
    mediaSum += 1370 + getItemLvl(intVal);
    numeroElementos++;
  });

  return invalido ? null : mediaSum / numeroElementos;
}

function onKeyUp(evt) {
  let val = evt.target.value;
  val = val.replace(/\D/g,'');
  val = parseInt(val);

  evt.target.value = val;
  if (val > 25) evt.target.value = 25;

  let itemLvl = calculaItemLvl();
  if (!itemLvl) return true;
  console.log(itemLvl);
  document.getElementById("ilvl").innerText = itemLvl;
}

window.onload = () => {
  writeInputs();
  writeResolution();
  let inputs = document.querySelectorAll("input");

  [...inputs].forEach((ipt) => {
    ipt.addEventListener("keyup", onKeyUp);
  });

  let itemLvl = calculaItemLvl();
  if (!itemLvl) return true;
  document.getElementById("ilvl").innerText = itemLvl;
};
