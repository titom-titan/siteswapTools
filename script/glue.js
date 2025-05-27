// 📁 script/glue.js

// ≡ Module principal (temporaire dans <script>)
window.currentGen = "partition"; // ou "arrangement", etc. par défaut
configureInputsFor(currentGen); // adapte dynamiquement les champs

(function() {
    const FUNCTION_SIGNATURES = {
        partition: ["number", "number", "number", "number", "checkbox"],
        arrangement: ["number", "number", "number", "number"],
        siteswap: ["number", "number", "number", "number"],
        quotient: ["number", "number", "number", "number"]
    };

    // Mapping index → input id
    const INPUT_IDS = ["n", "b", "capMin", "capMax", "paddle"];

    // Active/désactive les entrées selon la signature
    function configureInputsFor(fnName) {
        const sig = FUNCTION_SIGNATURES[fnName] || [];
        INPUT_IDS.forEach((id, i) => {
            const elem = document.getElementById(id);
            const label = document.querySelector(`#inputParams label[for="${id}"]`);
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
    }

    const GENERATORS = {
        partition: (n, b, capMin, capMax, paddle) => {
            return partition(n * b, n, capMin).map(p => p.join(","));
        },
        arrangement: (n, b, capMin, capMax) => {
            return arrangements(n, b).map(a => a.join(","));
        },
        siteswap: (n, b, capMin, capMax) => {
            return permutations(n, b).map(p => p.join(","));
        },
        quotient: (n, b, capMin, capMax) => {
            return combinations(n, b).map(c => c.join(","));
        }
    };

    let currentGen = 'partition';

    // ≡ Tabs
    document.querySelectorAll('#gen-tabs .tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#gen-tabs .tab-button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGen = btn.dataset.tab;
            updateInputs();
            generate();
        });
    });

    // ≡ Inputs ↔ Mise à jour dynamique avec cohérence
    window.updateInputs = function() {
        const n = +document.getElementById('n').value;
        const b = +document.getElementById('b').value;
        const capMin = +document.getElementById('capMin').value;
        const capMax = +document.getElementById('capMax').value;

        const minH_Q = Math.floor(capMin / n);
        const maxH_Q = Math.ceil(capMax / n);

        document.querySelector('#inputParams label[for="n"]').innerHTML = `n = <code>${n}\n</code>`;
        document.querySelector('#inputParams label[for="b"]').innerHTML = `b = <code>${b}\n</code>`;
        document.querySelector('#inputParams label[for="capMin"]').innerHTML = `h min = <code>${capMin}</code> | Q h min = <code>${minH_Q}</code>`;
        document.querySelector('#inputParams label[for="capMax"]').innerHTML = `h max = <code>${capMax}</code> | Q h max = <code>${maxH_Q}</code>`;

        document.querySelector("#b").min = capMin;
        document.querySelector("#b").max = capMax;
        document.querySelector("#capMax").min = capMin;
        document.querySelector("#capMin").max = capMax;
    };

    // ≡ Lecture des paramètres
    function readInputs() {
        const n = +document.getElementById("n").value;
        const b = +document.getElementById("b").value;
        const capMin = +document.getElementById("capMin").value;
        const capMax = +document.getElementById("capMax").value;
        const paddle = !!document.getElementById("paddle")?.checked;
        return [n, b, capMin, capMax, paddle];
    }

    // ≡ Génération combinatoire
    window.generate = function() {
        const inputs = readInputs();
        const gen = GENERATORS[currentGen];
        if (!gen) return;
        const out = gen(...inputs);
        document.getElementById("outputRaw").value = out.join("\n");
    };

    // ≡ Analyse du résultat
    window.runAnalysis = function() {
        const raw = document.getElementById("outputRaw").value.trim();
        const lines = raw.split(/\s*[\n]+\s*/);
        const html = ['<table><thead><tr><th>#</th><th>⟨Élément⟩</th></tr></thead><tbody>'];
        lines.forEach((line, i) => {
            html.push(`<tr><td>${i + 1}</td><td>${line}</td></tr>`);
        });
        html.push('</tbody></table>');
        document.getElementById("table").innerHTML = html.join("");
    };

    // ≡ Générateurs bruts (à modulariser plus tard)
    function combinations(n, k) {
        if (k === 0) return [
            []
        ];
        if (n < k) return [];
        const combs = combinations(n - 1, k - 1).map(c => [n - 1, ...c]);
        return combs.concat(combinations(n - 1, k));
    }

    function permutations(n, k) {
        if (k === 0) return [
            []
        ];
        const result = [];
        for (let i = 0; i < n; i++) {
            const subPerms = permutations(n, k - 1);
            subPerms.forEach(p => {
                if (!p.includes(i)) result.push([i, ...p]);
            });
        }
        return result;
    }

    function partition(n, k, start = 1) {
        if (k === 0) return n === 0 ? [
            []
        ] : [];
        const parts = [];
        for (let i = start; i <= n; i++) {
            const sub = partition(n - i, k - 1, i);
            sub.forEach(p => parts.push([i, ...p]));
        }
        return parts;
    }

    function arrangements(n, k) {
        if (k === 0) return [
            []
        ];
        const result = [];
        for (let i = 0; i < n; i++) {
            const subArrs = arrangements(n, k - 1);
            subArrs.forEach(p => {
                if (!p.includes(i)) result.push([i, ...p]);
            });
        }
        return result;
    }

    // ≡ Initialisation
    updateInputs();
    generate();

})();