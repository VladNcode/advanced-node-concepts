import chalk from 'chalk';
import { performance } from 'perf_hooks';

export async function runArrayBenchmarks() {
  console.log(chalk.cyan('🔄 Array Performance Benchmarks\n'));

  const iterations = 100000;
  const results = [];

  // Benchmark 1: Array creation methods
  console.log(chalk.yellow('📊 Array Creation Methods:'));

  // Array constructor
  const arrayConstructorStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    new Array(100);
  }
  const arrayConstructorTime = performance.now() - arrayConstructorStart;
  results.push({ name: 'Array constructor', time: arrayConstructorTime });

  // Array literal
  const arrayLiteralStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    [];
  }
  const arrayLiteralTime = performance.now() - arrayLiteralStart;
  results.push({ name: 'Array literal', time: arrayLiteralTime });

  // Array.from
  const arrayFromStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    Array.from({ length: 100 });
  }
  const arrayFromTime = performance.now() - arrayFromStart;
  results.push({ name: 'Array.from', time: arrayFromTime });

  // Benchmark 2: Array modification methods
  console.log(chalk.yellow('\n📊 Array Modification Methods:'));

  // push vs unshift
  const pushStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const arr = [];
    for (let j = 0; j < 100; j++) {
      arr.push(j);
    }
  }
  const pushTime = performance.now() - pushStart;
  results.push({ name: 'Array.push', time: pushTime });

  const unshiftStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const arr = [];
    for (let j = 0; j < 100; j++) {
      arr.unshift(j);
    }
  }
  const unshiftTime = performance.now() - unshiftStart;
  results.push({ name: 'Array.unshift', time: unshiftTime });

  // Benchmark 3: Array iteration methods
  console.log(chalk.yellow('\n📊 Array Iteration Methods:'));

  const testArray = Array.from({ length: 1000 }, (_, i) => i);

  // for loop
  const forLoopStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (let j = 0; j < testArray.length; j++) {
      sum += testArray[j];
    }
  }
  const forLoopTime = performance.now() - forLoopStart;
  results.push({ name: 'for loop', time: forLoopTime });

  // forEach
  const forEachStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    testArray.forEach(item => {
      sum += item;
    });
  }
  const forEachTime = performance.now() - forEachStart;
  results.push({ name: 'forEach', time: forEachTime });

  // for...of
  const forOfStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (const item of testArray) {
      sum += item;
    }
  }
  const forOfTime = performance.now() - forOfStart;
  results.push({ name: 'for...of', time: forOfTime });

  // Benchmark 4: Array transformation methods
  console.log(chalk.yellow('\n📊 Array Transformation Methods:'));

  // map
  const mapStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testArray.map(x => x * 2);
  }
  const mapTime = performance.now() - mapStart;
  results.push({ name: 'map', time: mapTime });

  // for loop transformation
  const forTransformStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const result = new Array(testArray.length);
    for (let j = 0; j < testArray.length; j++) {
      result[j] = testArray[j] * 2;
    }
  }
  const forTransformTime = performance.now() - forTransformStart;
  results.push({ name: 'for transform', time: forTransformTime });

  // Benchmark 5: Array filtering methods
  console.log(chalk.yellow('\n📊 Array Filtering Methods:'));

  // filter
  const filterStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testArray.filter(x => x % 2 === 0);
  }
  const filterTime = performance.now() - filterStart;
  results.push({ name: 'filter', time: filterTime });

  // for loop filtering
  const forFilterStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const result = [];
    for (let j = 0; j < testArray.length; j++) {
      if (testArray[j] % 2 === 0) {
        result.push(testArray[j]);
      }
    }
  }
  const forFilterTime = performance.now() - forFilterStart;
  results.push({ name: 'for filter', time: forFilterTime });

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
}

// Run directly if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runArrayBenchmarks();
}
