// Fichier contenant les fonctions mathématiques du projet

function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}

function cartesian(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result.push([a[i], b[j]]);
    }
  }
  return result;
}

function combinations(n, k) {
  if (k === 0) return [[]];
  if (n < k) return [];
  const combs = combinations(n - 1, k - 1).map(c => [n - 1, ...c]);
  return combs.concat(combinations(n - 1, k));
}

function permutations(n, k) {
  if (k === 0) return [[]];
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
  if (k === 0) return n === 0 ? [[]] : [];
  const parts = [];
  for (let i = start; i <= n; i++) {
    const subparts = partition(n - i, k - 1, i);
    subparts.forEach(p => parts.push([i, ...p]));
  }
  return parts;
}

function arrangements(n, k) {
  if (k === 0) return [[]];
  const result = [];
  for (let i = 0; i < n; i++) {
    const subArrs = arrangements(n, k - 1);
    subArrs.forEach(p => {
      if (!p.includes(i)) result.push([i, ...p]);
    });
  }
  return result;
}

function polynomial_value(arr, b) {
  return arr.reduce((sum, val, i) => sum + val * Math.pow(b, i), 0);
}

function isPrime(arr, b) {
  const val = polynomial_value(arr, b);
  if (val < 2) return false;
  for (let i = 2; i <= Math.sqrt(val); i++) {
    if (val % i === 0) return false;
  }
  return true;
}

function orbitalTarget(arr) {
  arr = arr.slice().reverse();
  return arr.map((val, i) => val + i);
}

function hasCollision(arr) {
  arr = arr.slice().reverse();
  const l = arr.length;
  const moved = arr.map((val, i) => (val + i) % l);
  return new Set(moved).size !== l;
}

function isCyclic(arr) {
  const l = arr.length;
  const avg = sum(arr) / l;
  return !hasCollision(arr) && Number.isInteger(avg);
}
