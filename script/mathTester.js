// Registre des fonctions à tester
const FUNCTIONS = {
  sum,
  cartesian,
  combinations,
  permutations,
  partition,
  arrangements,
  polynomial_value,
  isPrime,
  orbitalTarget,
  hasCollision,
  isCyclic
};

// Signature des entrées attendues pour chaque fonction
const FUNCTION_SIGNATURES = {
  sum: ["array"],
  cartesian: ["array", "array"],
  combinations: ["number", "number"],
  permutations: ["number", "number"],
  arrangements: ["number", "number"],
  partition: ["number", "number"],
  polynomial_value: ["array", "number"],
  isPrime: ["array", "number"],
  orbitalTarget: ["array"],
  hasCollision: ["array"],
  isCyclic: ["array"]
};

// Initialisation de l'interface une fois le DOM chargé
document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("choose_function");
  const computeBtn = document.getElementById("computeBtn");
  const output = document.getElementById("output");
  const dynamicInputs = document.getElementById("dynamicInputs");

  if (!select || !computeBtn || !output || !dynamicInputs) return;

  // Charger les options du select
  Object.keys(FUNCTIONS).forEach(fnName => {
    const option = document.createElement("option");
    option.value = fnName;
    option.textContent = fnName;
    select.appendChild(option);
  });

  // Générer dynamiquement les champs d'entrée
  function renderInputs(fnName) {
    dynamicInputs.innerHTML = "";
    const signature = FUNCTION_SIGNATURES[fnName];
    if (!signature) return;

    signature.forEach((type, index) => {
      const label = document.createElement("label");
      label.textContent = `Paramètre ${index + 1} (${type})`;
      dynamicInputs.appendChild(label);

      let input;
      if (type === "array") {
        input = document.createElement("textarea");
        input.rows = 3;
        input.value = "[0,1,2]";
      } else {
        input = document.createElement("input");
        input.type = "number";
        input.value = "3";
      }
      input.id = `param${index}`;
      dynamicInputs.appendChild(input);
    });
  }

  // Quand l'utilisateur change de fonction, afficher les bons inputs
  select.addEventListener("change", () => {
    renderInputs(select.value);
  });

  // Lancer l'exécution quand on clique sur "Exécuter"
  computeBtn.addEventListener("click", () => {
    const fnName = select.value;
    if (!fnName || !FUNCTIONS[fnName]) {
      output.textContent = "Veuillez sélectionner une fonction valide.";
      return;
    }

    const signature = FUNCTION_SIGNATURES[fnName];
    const args = signature.map((type, index) => {
      const val = document.getElementById(`param${index}`).value;
      if (type === "array") {
        try {
          return JSON.parse(val);
        } catch {
          throw new Error(`Erreur de parsing pour le paramètre ${index + 1}`);
        }
      } else {
        return parseFloat(val);
      }
    });

    let result;
    try {
      result = FUNCTIONS[fnName](...args);
      output.textContent = JSON.stringify(result, null, 2);
    } catch (e) {
      output.textContent = "Erreur pendant l'exécution : " + e.message;
    }
  });
});
