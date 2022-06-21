function writeInputs() {
  var html = `
    <div class="form-group">
        <label><b>{titulo}</b></label>
        <div class="d-flex">
          <select class="form-control tier">
            <option value="1" >T1</option>
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

function getItemLvT1Rare(ini, val, value) {
  if (ini > val) return value;

  if (ini === 1) return getItemLvT1Rare(ini + 1, val, value + 18);

  if (ini <= 15) return getItemLvT1Rare(ini + 1, val, value + 20);

  return getItemLvT1Rare(ini + 1, val, value + 25);
}

function getItemLvlT2Rare(ini, val, value) {
  if (ini > val) return value;

  if (ini === 1) return getItemLvlT2Rare(ini + 1, val, value + 18);

  if (ini <= 15) return getItemLvlT2Rare(ini + 1, val, value + 20);

  return getItemLvlT2Rare(ini + 1, val, value + 25);
}

function getItemLvlT3Rare(ini, val, value) {
  if (ini > val) return value;

  if (ini === 1) return getItemLvlT3Rare(2, val, value + 2);

  if (ini <= 3) return getItemLvlT3Rare(ini + 1, val, value + 3);

  return getItemLvlT3Rare(ini + 1, val, value + 5);
}

function getItemLvlT3Legendary(ini, val, value) {
  if (ini > val) return value;

  if (ini <= 15) return getItemLvlT3Legendary(ini + 1, val, value + 5);

  if (ini <= 25) return getItemLvlT3Legendary(ini + 1, val, value + 15);
}

function getItemLvl(type, tier, val, inival) {
  if (tier === "1") return getItemLvT1Rare(1, val, inival);

  if (tier === "2") return getItemLvlT2Rare(1, val, inival);

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
  if (tier === "1") return 302;
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

function validateInput(input, select, type) {
  let val = parseInt(input.value);
  let selectVal = parseInt(select.value);
  if (selectVal < 3 && val > 20) {
    input.value = 20;
    return 20;
  }

  if (selectVal === 2 && val > 20) {
    input.value = 20;
    return 20;
  }

  if (selectVal === 3 && type.value === "0" && val > 15) {
    input.value = 15;
    return 15;
  }

  if (val > 25) {
    input.value = 25;
    return 25;
  }

  return val;
}

function writeILvl(ilvl) {
  document.getElementById("ilvl").innerText = isNaN(ilvl)
    ? "Valor de refino inválido"
    : ilvl;
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

    const select = ipt.parentElement.querySelector(".tier");
    const type = ipt.parentElement.querySelector(".type");

    let intVal = validateInput(ipt, select, type);

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

  let itemLvl = calculaItemLvl();
  if (!itemLvl) return true;
  writeILvl(itemLvl);
}

function allTierChange() {
  let allTier = document.querySelector("#all-tier");
  let selects = document.querySelectorAll(".tier");

  [...selects].forEach((ipt) => {
    ipt.value = allTier.value;
  });

  let allType = document.querySelector("#all-type");
  if (parseInt(allTier.value) < 3) {
    allType.value = 0;
    allType.setAttribute("disabled", "disabled");
    allTypeChange();
  } else {
    let selects = document.querySelectorAll(".type");
    [...selects].forEach((ipt) => {
      if (ipt.hasAttribute("disabled")) ipt.removeAttribute("disabled");
    });
  }

  let itemLvl = calculaItemLvl();

  writeILvl(itemLvl);
}

function allTypeChange() {
  let allType = document.querySelector("#all-type");
  let selects = document.querySelectorAll(".type");

  [...selects].forEach((ipt) => {
    ipt.value = allType.value;
    if (allType.hasAttribute("disabled"))
      ipt.setAttribute("disabled", "disabled");
  });

  let itemLvl = calculaItemLvl();
  writeILvl(itemLvl);
}

function allValueChange() {
  let allValue = document.querySelector("#all-value");
  let inputs = document.querySelectorAll("input");
  console.log(inputs);
  [...inputs].forEach((ipt) => {
    ipt.value = allValue.value;
  });

  let itemLvl = calculaItemLvl();

  writeILvl(itemLvl);
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

  writeILvl(itemLvl);
};
