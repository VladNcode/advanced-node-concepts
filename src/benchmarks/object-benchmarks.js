import chalk from 'chalk';
import pkg from 'lodash';
const { cloneDeep } = pkg;
import { performance } from 'perf_hooks';

export async function runObjectBenchmarks() {
  console.log(chalk.cyan('🔄 Object Performance Benchmarks\n'));

  const iterations = 100000;
  const results = [];

  // Benchmark 1: Object creation methods
  console.log(chalk.yellow('📊 Object Creation Methods:'));

  // Object literal
  const literalStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const obj = { a: 1, b: 2, c: 3 };
  }
  const literalTime = performance.now() - literalStart;
  results.push({ name: 'Object literal', time: literalTime });

  // Object constructor
  const constructorStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const obj = new Object();
    obj.a = 1;
    obj.b = 2;
    obj.c = 3;
  }
  const constructorTime = performance.now() - constructorStart;
  results.push({ name: 'Object constructor', time: constructorTime });

  // Object.create
  const createStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const obj = Object.create(null);
    obj.a = 1;
    obj.b = 2;
    obj.c = 3;
  }
  const createTime = performance.now() - createStart;
  results.push({ name: 'Object.create', time: createTime });

  // Benchmark 2: Object property access methods
  console.log(chalk.yellow('\n📊 Object Property Access Methods:'));

  const testObject = { a: 1, b: 2, c: 3, d: 4, e: 5 };

  // Direct property access
  const directAccessStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const sum = testObject.a + testObject.b + testObject.c + testObject.d + testObject.e;
  }
  const directAccessTime = performance.now() - directAccessStart;
  results.push({ name: 'Direct access', time: directAccessTime });

  // Bracket notation
  const bracketAccessStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const sum = testObject['a'] + testObject['b'] + testObject['c'] + testObject['d'] + testObject['e'];
  }
  const bracketAccessTime = performance.now() - bracketAccessStart;
  results.push({ name: 'Bracket notation', time: bracketAccessTime });

  // Object.values
  const valuesStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const values = Object.values(testObject);
    const sum = values.reduce((a, b) => a + b, 0);
  }
  const valuesTime = performance.now() - valuesStart;
  results.push({ name: 'Object.values', time: valuesTime });

  // Benchmark 3: Object property assignment methods
  console.log(chalk.yellow('\n📊 Object Property Assignment Methods:'));

  // Direct assignment
  const directAssignStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const obj = {};
    obj.a = i;
    obj.b = i + 1;
    obj.c = i + 2;
  }
  const directAssignTime = performance.now() - directAssignStart;
  results.push({ name: 'Direct assignment', time: directAssignTime });

  // Object.assign
  const assignStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const obj = Object.assign({}, { a: i, b: i + 1, c: i + 2 });
  }
  const assignTime = performance.now() - assignStart;
  results.push({ name: 'Object.assign', time: assignTime });

  // Spread operator
  const spreadStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const obj = { ...{ a: i, b: i + 1, c: i + 2 } };
  }
  const spreadTime = performance.now() - spreadStart;
  results.push({ name: 'Spread operator', time: spreadTime });

  // Benchmark 4: Object iteration methods
  console.log(chalk.yellow('\n📊 Object Iteration Methods:'));

  const largeObject = {};
  for (let i = 0; i < 1000; i++) {
    largeObject[`key${i}`] = i;
  }

  // for...in loop
  const forInStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (const key in largeObject) {
      sum += largeObject[key];
    }
  }
  const forInTime = performance.now() - forInStart;
  results.push({ name: 'for...in', time: forInTime });

  // Object.keys with forEach
  const keysForEachStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    Object.keys(largeObject).forEach(key => {
      sum += largeObject[key];
    });
  }
  const keysForEachTime = performance.now() - keysForEachStart;
  results.push({ name: 'Object.keys+forEach', time: keysForEachTime });

  // Object.entries with for...of
  const entriesForOfStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (const [key, value] of Object.entries(largeObject)) {
      sum += value;
    }
  }
  const entriesForOfTime = performance.now() - entriesForOfStart;
  results.push({ name: 'Object.entries+for...of', time: entriesForOfTime });

  // Benchmark 5: Object cloning methods
  console.log(chalk.yellow('\n📊 Object Cloning Methods:'));

  const sourceObject = { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] };

  // Structured clone
  const structuredCloneStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const clone = structuredClone(sourceObject);
  }
  const structuredCloneTime = performance.now() - structuredCloneStart;
  results.push({ name: 'Structured clone', time: structuredCloneTime });

  // Clone deep with lodash
  const cloneDeepStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const clone = cloneDeep(sourceObject);
  }
  const cloneDeepTime = performance.now() - cloneDeepStart;
  results.push({ name: 'Clone deep with lodash', time: cloneDeepTime });

  // Shallow clone with spread
  const spreadCloneStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const clone = { ...sourceObject };
  }
  const spreadCloneTime = performance.now() - spreadCloneStart;
  results.push({ name: 'Spread clone', time: spreadCloneTime });

  // Shallow clone with Object.assign
  const assignCloneStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const clone = Object.assign({}, sourceObject);
  }
  const assignCloneTime = performance.now() - assignCloneStart;
  results.push({ name: 'Object.assign clone', time: assignCloneTime });

  // Deep clone with JSON
  const jsonCloneStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const clone = JSON.parse(JSON.stringify(sourceObject));
  }
  const jsonCloneTime = performance.now() - jsonCloneStart;
  results.push({ name: 'JSON clone', time: jsonCloneTime });

  // Display results
  console.log(chalk.cyan('\n📈 Benchmark Results:'));
  console.log(chalk.gray('═'.repeat(80)));
  console.log(chalk.gray('Method'.padEnd(25) + 'Time (ms)'.padEnd(15) + 'Performance'));
  console.log(chalk.gray('═'.repeat(80)));

  // Sort by performance (fastest first)
  results.sort((a, b) => a.time - b.time);

  results.forEach((result, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    const color = index < 3 ? chalk.green : chalk.gray;
    const performanceRating = index < 3 ? 'Excellent' : index < 6 ? 'Good' : 'Fair';

    console.log(color(`${medal} ${result.name.padEnd(22)} ${result.time.toFixed(2).padEnd(15)} ${performanceRating}`));
  });

  console.log(chalk.gray('═'.repeat(80)));

  // Performance insights
  const fastest = results[0];
  const slowest = results[results.length - 1];
  const speedup = slowest.time / fastest.time;

  console.log(chalk.yellow('\n💡 Performance Insights:'));
  console.log(chalk.gray(`  • Fastest: ${fastest.name} (${fastest.time.toFixed(2)}ms)`));
  console.log(chalk.gray(`  • Slowest: ${slowest.name} (${slowest.time.toFixed(2)}ms)`));
  console.log(chalk.blue(`  • Speed difference: ${speedup.toFixed(2)}x`));

  if (speedup > 10) {
    console.log(chalk.red('  • ⚠️  Significant performance differences detected'));
  } else if (speedup > 5) {
    console.log(chalk.yellow('  • ⚠️  Moderate performance differences detected'));
  } else {
    console.log(chalk.green('  • ✅ Performance differences are reasonable'));
  }

  // Cloning method insights
  console.log(chalk.yellow('\n🔍 Cloning Method Insights:'));
  console.log(chalk.gray('  • Spread & Object.assign: Shallow clone (fastest)'));
  console.log(chalk.gray('  • JSON.parse/stringify: Deep clone but loses functions & undefined'));
  console.log(chalk.gray('  • structuredClone: Native deep clone (Node.js 17+)'));
  console.log(chalk.gray('  • lodash.cloneDeep: Reliable deep clone with all data types'));
  console.log(chalk.gray('  • Choose based on: depth needed, data types, and performance'));
}

// Run directly if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runObjectBenchmarks();
}
