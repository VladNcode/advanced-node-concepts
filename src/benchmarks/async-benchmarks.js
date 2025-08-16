import chalk from 'chalk';
import { performance } from 'perf_hooks';

export async function runAsyncBenchmarks() {
  console.log(chalk.cyan('🔄 Async Performance Benchmarks\n'));

  const iterations = 10000;
  const results = [];

  // Benchmark 1: Promise creation methods
  console.log(chalk.yellow('📊 Promise Creation Methods:'));

  // Promise constructor
  const promiseConstructorStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    new Promise(resolve => resolve(i));
  }
  const promiseConstructorTime = performance.now() - promiseConstructorStart;
  results.push({ name: 'Promise constructor', time: promiseConstructorTime });

  // Promise.resolve
  const promiseResolveStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    Promise.resolve(i);
  }
  const promiseResolveTime = performance.now() - promiseResolveStart;
  results.push({ name: 'Promise.resolve', time: promiseResolveTime });

  // async function
  const asyncFunctionStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    (async () => i)();
  }
  const asyncFunctionTime = performance.now() - asyncFunctionStart;
  results.push({ name: 'async function', time: asyncFunctionTime });

  // Benchmark 2: Promise chaining methods
  console.log(chalk.yellow('\n📊 Promise Chaining Methods:'));

  // .then() chaining
  const thenChainingStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    Promise.resolve(i)
      .then(x => x + 1)
      .then(x => x * 2)
      .then(x => x - 1);
  }
  const thenChainingTime = performance.now() - thenChainingStart;
  results.push({ name: '.then() chaining', time: thenChainingTime });

  // async/await
  const asyncAwaitStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    (async () => {
      let x = await Promise.resolve(i);
      x = await Promise.resolve(x + 1);
      x = await Promise.resolve(x * 2);
      x = await Promise.resolve(x - 1);
    })();
  }
  const asyncAwaitTime = performance.now() - asyncAwaitStart;
  results.push({ name: 'async/await', time: asyncAwaitTime });

  // Promise.all
  const promiseAllStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    Promise.all([Promise.resolve(i), Promise.resolve(i + 1), Promise.resolve(i + 2)]);
  }
  const promiseAllTime = performance.now() - promiseAllStart;
  results.push({ name: 'Promise.all', time: promiseAllTime });

  // Benchmark 3: Async operation simulation
  console.log(chalk.yellow('\n📊 Async Operation Simulation:'));

  // Simulated async operation with setTimeout
  const setTimeoutStart = performance.now();
  const setTimeoutPromises = [];
  for (let i = 0; i < iterations; i++) {
    setTimeoutPromises.push(new Promise(resolve => setTimeout(() => resolve(i), 0)));
  }
  await Promise.all(setTimeoutPromises);
  const setTimeoutTime = performance.now() - setTimeoutStart;
  results.push({ name: 'setTimeout simulation', time: setTimeoutTime });

  // Simulated async operation with setImmediate
  const setImmediateStart = performance.now();
  const setImmediatePromises = [];
  for (let i = 0; i < iterations; i++) {
    setImmediatePromises.push(new Promise(resolve => setImmediate(() => resolve(i))));
  }
  await Promise.all(setImmediatePromises);
  const setImmediateTime = performance.now() - setImmediateStart;
  results.push({ name: 'setImmediate simulation', time: setImmediateTime });

  // Simulated async operation with process.nextTick
  const nextTickStart = performance.now();
  const nextTickPromises = [];
  for (let i = 0; i < iterations; i++) {
    nextTickPromises.push(new Promise(resolve => process.nextTick(() => resolve(i))));
  }
  await Promise.all(nextTickPromises);
  const nextTickTime = performance.now() - nextTickStart;
  results.push({ name: 'process.nextTick', time: nextTickTime });

  // Benchmark 4: Error handling methods
  console.log(chalk.yellow('\n📊 Error Handling Methods:'));

  // .catch() method
  const catchStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    Promise.reject(new Error(`Error ${i}`)).catch(error => error.message);
  }
  const catchTime = performance.now() - catchStart;
  results.push({ name: '.catch() method', time: catchTime });

  // try/catch with async
  const tryCatchStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    (async () => {
      try {
        throw new Error(`Error ${i}`);
      } catch (error) {
        error.message;
      }
    })();
  }
  const tryCatchTime = performance.now() - tryCatchStart;
  results.push({ name: 'try/catch async', time: tryCatchTime });

  // Benchmark 5: Memory usage in async operations
  console.log(chalk.yellow('\n📊 Memory Usage in Async Operations:'));

  const initialMemory = process.memoryUsage();

  // Create many pending promises
  const pendingPromises = [];
  for (let i = 0; i < iterations; i++) {
    pendingPromises.push(
      new Promise(resolve => {
        // Simulate some work
        const data = new Array(100).fill(i);
        setTimeout(() => resolve(data), 100);
      }),
    );
  }

  const afterMemory = process.memoryUsage();
  const memoryUsed = afterMemory.heapUsed - initialMemory.heapUsed;

  console.log(
    chalk.cyan(`  📊 Memory used by ${iterations.toLocaleString()} pending promises: ${formatBytes(memoryUsed)}`),
  );

  // Wait for all promises to resolve
  await Promise.all(pendingPromises);

  const finalMemory = process.memoryUsage();
  const memoryAfterResolve = finalMemory.heapUsed - initialMemory.heapUsed;

  console.log(chalk.cyan(`  📊 Memory after promises resolved: ${formatBytes(memoryAfterResolve)}`));

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
    const performance = index < 3 ? 'Excellent' : index < 6 ? 'Good' : 'Fair';

    console.log(color(`${medal} ${result.name.padEnd(22)} ${result.time.toFixed(2).padEnd(15)} ${performance}`));
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

  // Async-specific insights
  console.log(chalk.yellow('\n🔄 Async-Specific Insights:'));
  console.log(chalk.gray('  • process.nextTick is fastest for microtasks'));
  console.log(chalk.gray('  • setImmediate is faster than setTimeout(0)'));
  console.log(chalk.gray('  • Promise.resolve is faster than new Promise'));
  console.log(chalk.gray('  • .then() chaining vs async/await depends on complexity'));
}

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run directly if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAsyncBenchmarks();
}
