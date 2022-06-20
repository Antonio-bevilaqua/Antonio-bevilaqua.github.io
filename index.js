function writeInputs() {
  var html = `
    <div class="form-group">
        <label><b>{titulo}</b></label>
        <div class="d-flex">
          <select class="form-control tier">
            <option value="2" >T2</option>
            <option value="3" selected>T3</option>
          <select>
          <select class="form-control type">
            <option value="0" >Rare / Epic</option>
            <option value="1" selected>Legendary +</option>
          <select>
          <input class="form-control honing" type="number" step="1" min="0" value="6" />
        </div>
    </div>
    `;
  var elementos = ["Capacete", "Ombreira", "Armadura", "Calça", "Luva", "Arma"];
  elementos.forEach((label, index) => {
    document.querySelector("#conteudo").innerHTML += html.replace(
      "{titulo}",
      label
    );
  });
}

function writeResolution() {
  document.querySelector("#conteudo").innerHTML += `
    <div class="result">
        <label>Seu ILVL:</label>
        <b id="ilvl"></b>
    </div>
    `;
}

function getItemLvlT2Rare(ini, val, value) {
  if (ini > val) return value;

  if (ini === 1) return getItemLvlT2Rare(ini + 1, val, value + 18);
  return getItemLvlT2Rare(ini + 1, val, value + 20);
}

function getItemLvlT3Rare(ini, val, value) {
  if (ini > val) return value;

  if (ini === 1) return getItemLvlT3Rare(2, val, value + 3);

  if (ini <= 6) return getItemLvlT3Rare(ini + 1, val, value + 4);

  if (ini <= 15) return getItemLvlT3Rare(ini + 1, val, value + 5);
}

function getItemLvlT3Legendary(ini, val, value) {
  if (ini > val) return value;

  if (ini <= 15) return getItemLvlT3Legendary(ini + 1, val, value + 5);

  if (ini <= 25) return getItemLvlT3Legendary(ini + 1, val, value + 15);
}

function getItemLvl(type, tier, val, inival) {
  if (tier === "1") {
    if (val <= 15) {
      return val * 5;
    }

    let inicio = (15 - 6) * 5;
    return inicio + (val - 15) * 15;
  }
  if (tier === "2") {
    return getItemLvlT2Rare(1, val, inival);
  }

  if (tier === "3") {
    if (type === "0") return getItemLvlT3Rare(1, val, inival);
    if (type === "1") return getItemLvlT3Legendary(1, val, inival);
  }
}

function validaValor(valor) {
  if (valor < 0) {
    document.getElementById("ilvl").innerText = "Valor de refino inválido";
    return false;
  }
  return true;
}

function getInitialLevelForTier(tier, type) {
  //if (tier === "1") return 302;
  if (tier === "2") return 802;
  if (tier === "3") {
    switch (type) {
      case "0":
        return 1302;
      default:
        return 1340;
    }
  }
}

function calculaItemLvl() {
  let inputs = document.querySelectorAll(".honing");

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
    const select = ipt.parentElement.querySelector(".tier");
    const type = ipt.parentElement.querySelector(".type");
    const initial = getInitialLevelForTier(select.value, type.value);
    mediaSum += getItemLvl(type.value, select.value, intVal, initial);
    numeroElementos++;
  });

  return invalido ? null : mediaSum / numeroElementos;
}

function onKeyUp(evt) {
  let val = evt.target.value;
  val = val.replace(/\D/g, "");
  val = parseInt(val);

  evt.target.value = val;
  if (val > 25) evt.target.value = 25;

  let itemLvl = calculaItemLvl();
  if (!itemLvl) return true;
  document.getElementById("ilvl").innerText = itemLvl;
}

function allTierChange() {
  let allTier = document.querySelector("#all-tier");
  let selects = document.querySelectorAll(".tier");

  [...selects].forEach((ipt) => {
    ipt.value = allTier.value;
  });

  let itemLvl = calculaItemLvl();
  document.getElementById("ilvl").innerText = itemLvl;
}

function allTypeChange() {
  let allType = document.querySelector("#all-type");
  let selects = document.querySelectorAll(".type");

  [...selects].forEach((ipt) => {
    ipt.value = allType.value;
  });

  let itemLvl = calculaItemLvl();
  document.getElementById("ilvl").innerText = itemLvl;
}

function allValueChange() {
  let allValue = document.querySelector("#all-value");
  let inputs = document.querySelectorAll("input");
  console.log(inputs);
  [...inputs].forEach((ipt) => {
    ipt.value = allValue.value;
  });

  let itemLvl = calculaItemLvl();
  document.getElementById("ilvl").innerText = itemLvl;
}

window.onload = () => {
  writeInputs();
  writeResolution();
  let inputs = document.querySelectorAll(".honing");

  [...inputs].forEach((ipt) => {
    ipt.addEventListener("keyup", onKeyUp);
  });

  let selects = document.querySelectorAll("select");

  [...selects].forEach((ipt) => {
    ipt.addEventListener("change", onKeyUp);
  });

  let itemLvl = calculaItemLvl();
  if (!itemLvl) return true;

  let allTier = document.querySelector("#all-tier");
  let allType = document.querySelector("#all-type");
  let allValue = document.querySelector("#all-value");

  allTier.addEventListener("change", allTierChange);
  allType.addEventListener("change", allTypeChange);
  allValue.addEventListener("keyup", allValueChange);

  document.getElementById("ilvl").innerText = itemLvl;
};
