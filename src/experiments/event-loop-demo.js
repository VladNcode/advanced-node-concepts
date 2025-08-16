import chalk from 'chalk';
import { performance } from 'perf_hooks';

console.log(chalk.blue.bold('🔄 Event Loop Demonstration'));
console.log(chalk.yellow('This demonstrates Node.js event loop phases and execution order\n'));

// Demo 1: Basic event loop phases
console.log(chalk.blue('📋 Demo 1: Event Loop Phases'));
console.log(chalk.gray('Understanding the 6 phases of the Node.js event loop\n'));

console.log(chalk.cyan('Event Loop Phases:'));
console.log(chalk.gray('1. Timers: setTimeout, setInterval'));
console.log(chalk.gray('2. Pending callbacks: I/O callbacks deferred to next loop'));
console.log(chalk.gray('3. Idle, prepare: internal use'));
console.log(chalk.gray('4. Poll: new I/O events, I/O callbacks'));
console.log(chalk.gray('5. Check: setImmediate callbacks'));
console.log(chalk.gray('6. Close callbacks: close event handlers'));

// Demo 2: Execution order demonstration
console.log(chalk.blue('\n📋 Demo 2: Execution Order'));
console.log(chalk.yellow('Demonstrating the order: sync → microtasks → timers → setImmediate\n'));

console.log(chalk.gray('🔄 Starting execution order demo...\n'));

// Synchronous code (executes immediately)
console.log(chalk.green('1️⃣  Synchronous code (immediate)'));

// Microtasks (process.nextTick, Promises)
process.nextTick(() => {
  console.log(chalk.yellow('2️⃣  process.nextTick (microtask)'));
});

Promise.resolve().then(() => {
  console.log(chalk.yellow('3️⃣  Promise.then (microtask)'));
});

// Timers (setTimeout, setInterval)
setTimeout(() => {
  console.log(chalk.blue('4️⃣  setTimeout 0ms (timer phase)'));
}, 0);

setTimeout(() => {
  console.log(chalk.blue('5️⃣  setTimeout 1ms (timer phase)'));
}, 1);

// setImmediate (check phase)
setImmediate(() => {
  console.log(chalk.magenta('6️⃣  setImmediate (check phase)'));
});

// I/O operation simulation
const fs = await import('fs');
fs.promises
  .readFile('./package.json')
  .then(() => {
    console.log(chalk.cyan('7️⃣  I/O callback (poll phase)'));
  })
  .catch(() => {
    console.log(chalk.cyan('7️⃣  I/O callback (poll phase) - simulated'));
  });

console.log(chalk.gray('\n🔄 Execution order demo started. Results will appear above...\n'));

// Wait for execution order demo to complete
await new Promise(resolve => {
  setTimeout(resolve, 1000); // Wait 1 second for all callbacks to execute
});

console.log(chalk.green('\n✅ Demo 2 completed! Press Enter to continue to Demo 3...'));
await new Promise(resolve => {
  process.stdin.once('data', resolve);
});

// Demo 3: Event loop blocking demonstration
console.log(chalk.blue('\n📋 Demo 3: Event Loop Blocking'));
console.log(chalk.yellow('Showing how CPU-intensive tasks block the event loop\n'));

console.log(chalk.gray('🔄 Starting blocking demo...\n'));

// Non-blocking timer
setTimeout(() => {
  console.log(chalk.green('✅ Non-blocking timer executed'));
}, 100);

// CPU-intensive task that blocks the event loop
console.log(chalk.yellow('🔄 Running CPU-intensive task (this will block the event loop)...'));
const start = performance.now();

let result = 0;
for (let i = 0; i < 100000000; i++) {
  // 100 million iterations
  result += Math.sqrt(i) * Math.sin(i);
  if (i % 10000000 === 0) {
    process.stdout.write(chalk.gray('.'));
  }
}

const duration = performance.now() - start;
console.log(chalk.green(`\n✅ CPU-intensive task completed in ${duration.toFixed(2)}ms`));
console.log(chalk.gray(`Result: ${result.toFixed(2)}`));

console.log(chalk.green('\n✅ Demo 3 completed! Press Enter to continue to Demo 4...'));
await new Promise(resolve => {
  process.stdin.once('data', resolve);
});

// Demo 4: Microtask queue demonstration
console.log(chalk.blue('\n📋 Demo 4: Microtask Queue'));
console.log(chalk.yellow('Demonstrating microtask priority over timers\n'));

console.log(chalk.gray('🔄 Starting microtask demo...\n'));

setTimeout(() => {
  console.log(chalk.blue('⏰ Timer callback'));

  // Add microtasks from within timer
  Promise.resolve().then(() => {
    console.log(chalk.yellow('🔄 Microtask from timer'));
  });

  process.nextTick(() => {
    console.log(chalk.yellow('🔄 process.nextTick from timer'));
  });
}, 200);

// Wait for microtask demo to complete
await new Promise(resolve => {
  setTimeout(resolve, 500); // Wait for timer and microtasks
});

console.log(chalk.green('\n✅ Demo 4 completed! Press Enter to continue to Demo 5...'));
await new Promise(resolve => {
  process.stdin.once('data', resolve);
});

// Demo 5: Event loop monitoring
console.log(chalk.blue('\n📋 Demo 5: Event Loop Monitoring'));
console.log(chalk.yellow('Monitoring event loop lag and performance\n'));

console.log(chalk.gray('🔄 Starting event loop monitoring...\n'));

const monitoringDuration = 5000; // 5 seconds
const startTime = performance.now();
const measurements = [];

// Monitor event loop lag
const monitor = setInterval(() => {
  const now = performance.now();
  const expectedTime = startTime + measurements.length * 16; // 16ms intervals
  const actualLag = now - expectedTime;

  measurements.push(actualLag);

  // Show current status
  process.stdout.write(
    chalk.gray(`\r⏱️  Monitoring... ${measurements.length}s | Current lag: ${actualLag.toFixed(2)}ms`),
  );
}, 16);

// Wait for monitoring to complete
await new Promise(resolve => {
  setTimeout(() => {
    clearInterval(monitor);
    resolve();
  }, monitoringDuration);
});

// Analyze results
const avgLag = measurements.reduce((sum, lag) => sum + lag, 0) / measurements.length;
const maxLag = Math.max(...measurements);
const minLag = Math.min(...measurements);
const lagOver16ms = measurements.filter(lag => lag > 16).length;
const lagPercentage = (lagOver16ms / measurements.length) * 100;

console.log(chalk.cyan('\n\n📊 Event Loop Performance Analysis:'));
console.log(chalk.gray('═'.repeat(60)));
console.log(chalk.gray(`Total measurements: ${measurements.length}`));
console.log(chalk.gray(`Average lag: ${avgLag.toFixed(2)}ms`));
console.log(chalk.gray(`Maximum lag: ${maxLag.toFixed(2)}ms`));
console.log(chalk.gray(`Minimum lag: ${minLag.toFixed(2)}ms`));
console.log(chalk.gray(`Lag > 16ms: ${lagOver16ms} (${lagPercentage.toFixed(2)}%)`));

// Performance rating
let rating;
let color;
if (avgLag < 5) {
  rating = 'Excellent';
  color = chalk.green;
} else if (avgLag < 16) {
  rating = 'Good';
  color = chalk.yellow;
} else if (avgLag < 50) {
  rating = 'Fair';
  color = chalk.red;
} else {
  rating = 'Poor';
  color = chalk.red.bold;
}

console.log(chalk.yellow('\n📈 Performance Rating:'));
console.log(color(`  • Rating: ${rating}`));

if (lagPercentage > 10) {
  console.log(chalk.red('  • ⚠️  Event loop lag detected - consider optimization'));
} else {
  console.log(chalk.green('  • ✅ Event loop performance is good'));
}

console.log(chalk.gray('═'.repeat(60)));

console.log(chalk.green('\n✅ Demo 5 completed! Press Enter to continue to Demo 6...'));
await new Promise(resolve => {
  process.stdin.once('data', resolve);
});

// Demo 6: Best practices
console.log(chalk.blue('\n📋 Demo 6: Event Loop Best Practices'));
console.log(chalk.yellow('Guidelines for keeping the event loop responsive\n'));

console.log(chalk.cyan('✅ Do:'));
console.log(chalk.gray('  • Use async/await for I/O operations'));
console.log(chalk.gray('  • Break up CPU-intensive tasks with setImmediate'));
console.log(chalk.gray('  • Use worker threads for heavy computation'));
console.log(chalk.gray('  • Handle errors in promises and callbacks'));

console.log(chalk.cyan("\n❌ Don't:"));
console.log(chalk.gray('  • Block the event loop with long loops'));
console.log(chalk.gray('  • Use synchronous I/O in production'));
console.log(chalk.gray('  • Create infinite loops or recursive calls'));
console.log(chalk.gray('  • Ignore promise rejections'));

console.log(chalk.green('\n✅ Event Loop demonstration completed!'));
process.exit(0);

// Keep the process alive for the monitoring
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n🛑 Event loop demo stopped by user'));
  process.exit(0);
});
