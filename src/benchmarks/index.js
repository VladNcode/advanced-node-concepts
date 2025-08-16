import chalk from 'chalk';
import { performance } from 'perf_hooks';
import { runArrayBenchmarks } from './array-benchmarks.js';
import { runStringBenchmarks } from './string-benchmarks.js';
import { runObjectBenchmarks } from './object-benchmarks.js';
import { runAsyncBenchmarks } from './async-benchmarks.js';

console.log(chalk.blue.bold('🏃‍♂️ Node.js Performance Benchmarks'));
console.log(chalk.yellow('Comprehensive performance testing for Node.js applications\n'));

async function runAllBenchmarks() {
  const startTime = performance.now();

  try {
    // Run different benchmark suites
    console.log(chalk.blue('📋 Running Array Performance Benchmarks...'));
    await runArrayBenchmarks();

    console.log(chalk.blue('\n📋 Running String Performance Benchmarks...'));
    await runStringBenchmarks();

    console.log(chalk.blue('\n📋 Running Object Performance Benchmarks...'));
    await runObjectBenchmarks();

    console.log(chalk.blue('\n📋 Running Async Performance Benchmarks...'));
    await runAsyncBenchmarks();

    const totalTime = performance.now() - startTime;
    console.log(chalk.green(`\n✅ All benchmarks completed in ${totalTime.toFixed(2)}ms`));
  } catch (error) {
    console.error(chalk.red(`❌ Benchmark error: ${error.message}`));
    process.exit(1);
  }
}

// Run benchmarks if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllBenchmarks();
}

export { runAllBenchmarks };
