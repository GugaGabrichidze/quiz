const ahpmatrix = [
  [1.0, 2.0, 3.0, 0.333, 3.0, 0.5, 2.0], // C1: ხარჯი
  [0.5, 1.0, 2.0, 0.25, 2.0, 0.333, 1.0], // C2: პასუხის დრო
  [0.333, 0.5, 1.0, 0.2, 1.0, 0.25, 0.5], // C3: კადრები
  [3.0, 4.0, 5.0, 1.0, 5.0, 2.0, 4.0], // C4: უსაფრთხოება
  [0.333, 0.5, 1.0, 0.2, 1.0, 0.25, 0.5], // C5: Lock-in
  [2.0, 3.0, 4.0, 0.5, 4.0, 1.0, 3.0], // C6: მასშტაბირება
  [0.5, 1.0, 2.0, 0.333, 2.0, 0.5, 1.0], // C7: რისკი
];

const n = ahpmatrix.length;

let colSums = [0, 0, 0, 0, 0, 0, 0];
for (let c = 0; c < n; c++) {
  for (let r = 0; r < n; r++) {
    colSums[c] += ahpmatrix[r][c];
  }
}

let ahpWeights = [];
for (let r = 0; r < n; r++) {
  let rowSum = 0;

  for (let c = 0; c < n; c++) {
    rowSum += ahpmatrix[r][c] / colSums[c];
  }

  ahpWeights.push(rowSum / n);
}

let lambdaMax = 0;
for (let c = 0; c < n; c++) {
  lambdaMax += colSums[c] * ahpWeights[c];
}
let CI = (lambdaMax - n) / (n - 1);
let CR = CI / 1.32;

console.log("ლამბდა: " + lambdaMax.toFixed(4));
console.log("Consistency Index (CI): " + CI.toFixed(4));
console.log("Consistency Ratio (CR): " + CR.toFixed(4));
console.log("C1 (ხარჯი): " + ahpWeights[0].toFixed(3));
console.log("C2 (პასუხის დრო): " + ahpWeights[1].toFixed(3));
console.log("C3 (კადრები): " + ahpWeights[2].toFixed(3));
console.log("C4 (უსაფრთხოება): " + ahpWeights[3].toFixed(3));
console.log("C5 (Lock-in): " + ahpWeights[4].toFixed(3));
console.log("C6 (მასშტაბირება): " + ahpWeights[5].toFixed(3));
console.log("C7 (რისკი): " + ahpWeights[6].toFixed(3));

const alternatives = [
  {
    name: "A1: AWS Fully Managed EKS",
    c1: 2.8,
    c2: 15,
    c3: 8,
    c4: 9,
    c5: 20,
    c6: 9,
    c7: 4,
  },
  {
    name: "A2: On-Premise Hybrid OpenStack",
    c1: 2.1,
    c2: 35,
    c3: 5,
    c4: 7,
    c5: 75,
    c6: 6,
    c7: 8,
  },
  {
    name: "A3: MS Azure Enterprise Cloud",
    c1: 2.5,
    c2: 20,
    c3: 7,
    c4: 8,
    c5: 15,
    c6: 8,
    c7: 5,
  },
  {
    name: "A4: Multi-Cloud Custom Microservices",
    c1: 3.4,
    c2: 45,
    c3: 6,
    c4: 8,
    c5: 65,
    c6: 8,
    c7: 9,
  },
  {
    name: "A5: Serverless AWS Lambda",
    c1: 3.6,
    c2: 10,
    c3: 7,
    c4: 9,
    c5: 10,
    c6: 10,
    c7: 6,
  },
  {
    name: "A6: Hybrid GCP & Bare Metal",
    c1: 2.3,
    c2: 30,
    c3: 6,
    c4: 7,
    c5: 40,
    c6: 7,
    c7: 7,
  },
  {
    name: "A7: Java Spring Boot + Postgres",
    c1: 1.9,
    c2: 40,
    c3: 8,
    c4: 6,
    c5: 70,
    c6: 5,
    c7: 3,
  },
  {
    name: "A8: Docker Swarm on VPS",
    c1: 2.0,
    c2: 55,
    c3: 6,
    c4: 5,
    c5: 80,
    c6: 5,
    c7: 4,
  },
];

const weights = {
  c1: 0.158, // ხარჯი (Min)
  c2: 0.092, // პასუხის დრო (Min)
  c3: 0.052, // კადრები (Max)
  c4: 0.312, // უსაფრთხოება (Max)
  c5: 0.055, // Lock-in (Max)
  c6: 0.218, // მასშტაბირებადობა (Max)
  c7: 0.113, // რისკი (Min)
};

const minValues = { c1: 1.9, c2: 10, c7: 3 };
const maxValues = { c3: 8, c4: 9, c5: 80, c6: 10 };

let results = [];

for (let i = 0; i < alternatives.length; i++) {
  let item = alternatives[i];

  let normC1 = minValues.c1 / item.c1;
  let normC2 = minValues.c2 / item.c2;
  let normC7 = minValues.c7 / item.c7;

  let normC3 = item.c3 / maxValues.c3;
  let normC4 = item.c4 / maxValues.c4;
  let normC5 = item.c5 / maxValues.c5;
  let normC6 = item.c6 / maxValues.c6;

  let finalScore =
    normC1 * weights.c1 +
    normC2 * weights.c2 +
    normC3 * weights.c3 +
    normC4 * weights.c4 +
    normC5 * weights.c5 +
    normC6 * weights.c6 +
    normC7 * weights.c7;

  results.push({
    name: item.name,
    score: finalScore.toFixed(4),
  });
}

results.sort(function (a, b) {
  return b.score - a.score;
});

for (let i = 0; i < results.length; i++) {
  console.log(i + 1 + ". " + results[i].name + "  ქულა: " + results[i].score);
}
