// 📁 script/ui.js

(function() {

    const FUNCTION_SIGNATURES = {
        partition: ["number", "number", "number", "number", "checkbox"],
        arrangement: ["number", "number", "number", "number"],
        siteswap: ["number", "number", "number", "number"],
        quotient: ["number", "number", "number", "number"]
    };

    const INPUT_IDS = ["n", "b", "capMin", "capMax", "paddle"];

    window.configureInputsFor = function(fnName) {
        const sig = FUNCTION_SIGNATURES[fnName] || [];
        INPUT_IDS.forEach((id, i) => {
            const elem = document.getElementById(id);
            const label = document.querySelector(`#inputParams label[for="${id}"]`);
            if (!elem || !label) return;
            if (sig[i]) {
                elem.style.display = "";
                label.style.display = "";
                elem.disabled = false;
            } else {
                elem.style.display = "none";
                label.style.display = "none";
                elem.disabled = true;
            }
        });
    };

})();

window.updateInputs = function() {
    const n = +document.getElementById('n').value;
    let b = +document.getElementById('b').value;
    let capMin = +document.getElementById('capMin').value;
    let capMax = +document.getElementById('capMax').value;

    // ⊘ Correction automatique des incohérences
    if (capMin > capMax)[capMin, capMax] = [capMax, capMin];
    if (b < capMin) b = capMin;
    if (b > capMax) b = capMax;

    // ↻ Réinjecte les valeurs corrigées
    document.getElementById("b").value = b;
    document.getElementById("capMin").value = capMin;
    document.getElementById("capMax").value = capMax;

    // ⊚ Calculs auxiliaires
    const minH_Q = Math.floor(capMin / n);
    const maxH_Q = Math.ceil(capMax / n);

    // ⬒ Affichage dans les labels
    document.querySelector('#inputParams label[for="n"]').innerHTML = `n = <code>${n}\n</code>`;
    document.querySelector('#inputParams label[for="b"]').innerHTML = `b = <code>${b}\n</code>`;
    document.querySelector('#inputParams label[for="capMin"]').innerHTML = `h min = <code>${capMin}</code> | Q h min = <code>${minH_Q}</code>`;
    document.querySelector('#inputParams label[for="capMax"]').innerHTML = `h max = <code>${capMax}</code> | Q h max = <code>${maxH_Q}</code>`;

    // ⤷ Contraintes de plage en DOM
    document.querySelector("#b").min = capMin;
    document.querySelector("#b").max = capMax;
    document.querySelector("#capMax").min = capMin;
    document.querySelector("#capMin").max = capMax;
};

// 🔁 Gestion des onglets généraux (niveau 1)
document.querySelectorAll('#gen-tabs .tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Retire l’état actif
        document.querySelectorAll('#gen-tabs .tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

        // Active le bon
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        const content = document.getElementById(tabId);
        if (content) content.style.display = 'block';

        configureInputsFor(currentGen);
        updateInputs();
        generate();
    });
});

// 🔁 Gestion des onglets de vue (niveau 2)
document.querySelectorAll('#view-tabs .tab-button-2').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#view-tabs .tab-button-2').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        const pane = document.getElementById(tabId);
        if (pane) pane.style.display = 'block';
    });
});