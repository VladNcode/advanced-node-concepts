import chalk from 'chalk';
import { performance } from 'perf_hooks';
import { EventEmitter } from 'events';

console.log(chalk.blue.bold('💾 Memory Leak Demonstration'));
console.log(chalk.yellow('This demonstrates common memory leak patterns and detection methods\n'));

// Demo 1: Event listener memory leak
console.log(chalk.blue('📋 Demo 1: Event Listener Memory Leak'));
console.log(chalk.yellow('Showing how event listeners can cause memory leaks\n'));

console.log(chalk.gray('🔄 Starting event listener leak demo...\n'));

const beforeEventLeak = process.memoryUsage();
const eventEmitters = [];
const listeners = [];

// Create event emitters with listeners
for (let i = 0; i < 1000; i++) {
  const emitter = new EventEmitter();
  const listener = data => {
    // This listener captures the emitter in its closure
    console.log(`Listener ${i} received: ${data}`);
  };

  emitter.on('data', listener);
  eventEmitters.push(emitter);
  listeners.push({ emitter, listener });

  // Emit some events
  emitter.emit('data', `Event ${i}`);
}

const afterEventLeak = process.memoryUsage();
console.log(chalk.green(`✅ Created ${eventEmitters.length} event emitters with listeners`));
console.log(chalk.cyan(`📊 Memory used: ${formatBytes(afterEventLeak.heapUsed - beforeEventLeak.heapUsed)}`));

// Demonstrate the leak
console.log(chalk.yellow('\n⚠️  Memory Leak Detected!'));
console.log(chalk.gray('• Event listeners are still holding references to emitters'));
console.log(chalk.gray("• Even though we're done with them, they can't be garbage collected"));
console.log(chalk.gray('• This creates a circular reference: emitter → listener → emitter'));

// Show how to fix it
console.log(chalk.cyan('\n🔧 How to Fix:'));
console.log(chalk.gray("• Remove listeners when done: emitter.removeListener('data', listener)"));
console.log(chalk.gray('• Use once() instead of on() for one-time events'));
console.log(chalk.gray('• Use weak references or proper cleanup patterns'));

// Clean up properly
console.log(chalk.yellow('\n🧹 Cleaning up event listeners...'));
listeners.forEach(({ emitter, listener }) => {
  emitter.removeListener('data', listener);
});

listeners.length = 0;
eventEmitters.length = 0;

console.log(chalk.green('✅ Event listeners cleaned up'));

// Demo 2: Closure memory leak
console.log(chalk.blue('\n📋 Demo 2: Closure Memory Leak'));
console.log(chalk.yellow('Showing how closures can capture and retain references\n'));

console.log(chalk.gray('🔄 Starting closure leak demo...\n'));

const beforeClosureLeak = process.memoryUsage();
const closureFunctions = [];
const largeData = [];

// Create functions that capture large data in closures
for (let i = 0; i < 100; i++) {
  const data = new Array(10000).fill(`data-${i}`);
  largeData.push(data);

  const closureFunction = () => {
    // This closure captures the large data array
    return data.length;
  };

  closureFunctions.push(closureFunction);
}

const afterClosureLeak = process.memoryUsage();
console.log(chalk.green(`✅ Created ${closureFunctions.length} closure functions`));
console.log(chalk.cyan(`📊 Memory used: ${formatBytes(afterClosureLeak.heapUsed - beforeClosureLeak.heapUsed)}`));

console.log(chalk.yellow('\n⚠️  Memory Leak Detected!'));
console.log(chalk.gray('• Closure functions capture references to large data'));
console.log(chalk.gray('• Data cannot be garbage collected while functions exist'));
console.log(chalk.gray('• Each function holds a reference to its captured data'));

// Clean up
console.log(chalk.yellow('\n🧹 Cleaning up closure functions...'));
closureFunctions.length = 0;
largeData.length = 0;

console.log(chalk.green('✅ Closure functions cleaned up'));

// Demo 3: Array/object accumulation leak
console.log(chalk.blue('\n📋 Demo 3: Array/Object Accumulation Leak'));
console.log(chalk.yellow('Showing how unchecked accumulation can cause memory leaks\n'));

console.log(chalk.gray('🔄 Starting accumulation leak demo...\n'));

const beforeAccumulationLeak = process.memoryUsage();
const dataStore = [];
let totalItems = 0;

// Simulate data accumulation without cleanup
for (let i = 0; i < 50; i++) {
  const batch = [];
  for (let j = 0; j < 1000; j++) {
    batch.push({
      id: `${i}-${j}`,
      data: new Array(100).fill(`item-${i}-${j}`),
      timestamp: Date.now(),
      metadata: Array.from({ length: 20 }, (_, k) => `prop${k}`),
    });
  }
  dataStore.push(...batch);
  totalItems += batch.length;

  if (i % 10 === 0) {
    process.stdout.write(chalk.gray('.'));
  }
}

const afterAccumulationLeak = process.memoryUsage();
console.log(chalk.green(`\n✅ Accumulated ${totalItems.toLocaleString()} items`));
console.log(
  chalk.cyan(`📊 Memory used: ${formatBytes(afterAccumulationLeak.heapUsed - beforeAccumulationLeak.heapUsed)}`),
);

console.log(chalk.yellow('\n⚠️  Memory Leak Detected!'));
console.log(chalk.gray('• Data is accumulating without any cleanup strategy'));
console.log(chalk.gray('• No size limits or expiration policies'));
console.log(chalk.gray('• Memory usage grows indefinitely'));

// Demonstrate cleanup strategies
console.log(chalk.cyan('\n🔧 Cleanup Strategies:'));
console.log(chalk.gray('• Keep only recent data (time-based cleanup)'));
console.log(chalk.gray('• Limit total items (size-based cleanup)'));
console.log(chalk.gray('• Implement LRU (Least Recently Used) eviction'));
console.log(chalk.gray('• Use weak references for caches'));

// Clean up
console.log(chalk.yellow('\n🧹 Cleaning up accumulated data...'));
dataStore.length = 0;

console.log(chalk.green('✅ Accumulated data cleaned up'));

// Demo 4: Timer memory leak
console.log(chalk.blue('\n📋 Demo 4: Timer Memory Leak'));
console.log(chalk.yellow('Showing how timers can cause memory leaks\n'));

console.log(chalk.gray('🔄 Starting timer leak demo...\n'));

const beforeTimerLeak = process.memoryUsage();
const timers = [];

// Create various types of timers
for (let i = 0; i < 100; i++) {
  const timeoutId = setTimeout(() => {
    // This callback captures variables in its closure
    console.log(`Timer ${i} executed`);
  }, 1000 + i);

  const intervalId = setInterval(() => {
    // This will run forever unless cleared
    console.log(`Interval ${i} tick`);
  }, 2000 + i);

  timers.push({ timeoutId, intervalId, index: i });
}

const afterTimerLeak = process.memoryUsage();
console.log(chalk.green(`✅ Created ${timers.length} timers`));
console.log(chalk.cyan(`📊 Memory used: ${formatBytes(afterTimerLeak.heapUsed - beforeTimerLeak.heapUsed)}`));

console.log(chalk.yellow('\n⚠️  Memory Leak Detected!'));
console.log(chalk.gray('• Timers are still active and consuming memory'));
console.log(chalk.gray('• Intervals will run forever unless cleared'));
console.log(chalk.gray('• Each timer holds references to its callback and variables'));

// Show how to fix it
console.log(chalk.cyan('\n🔧 How to Fix:'));
console.log(chalk.gray('• Always clear timeouts and intervals when done'));
console.log(chalk.gray('• Use clearTimeout() and clearInterval()'));
console.log(chalk.gray('• Store timer IDs and clear them in cleanup'));
console.log(chalk.gray('• Consider using AbortController for cancellation'));

// Clean up properly
console.log(chalk.yellow('\n🧹 Cleaning up timers...'));
timers.forEach(({ timeoutId, intervalId }) => {
  clearTimeout(timeoutId);
  clearInterval(intervalId);
});

timers.length = 0;

console.log(chalk.green('✅ Timers cleaned up'));

// Demo 5: Memory leak detection and monitoring
console.log(chalk.blue('\n📋 Demo 5: Memory Leak Detection & Monitoring'));
console.log(chalk.yellow('Demonstrating memory leak detection techniques\n'));

console.log(chalk.gray('🔄 Starting leak detection demo...\n'));

// Simulate memory leak over time
const leakDetectionData = [];
const startTime = Date.now();

console.log(chalk.yellow('🔄 Simulating memory leak over time...'));

for (let i = 0; i < 10; i++) {
  // Create some objects that won't be cleaned up
  const leakyBatch = [];
  for (let j = 0; j < 1000; j++) {
    leakyBatch.push({
      id: `${i}-${j}`,
      data: new Array(50).fill(`leak-${i}-${j}`),
      timestamp: Date.now(),
    });
  }

  // Store reference (simulating leak)
  leakDetectionData.push(leakyBatch);

  const currentMemory = process.memoryUsage();
  const elapsed = (Date.now() - startTime) / 1000;

  console.log(chalk.gray(`  Phase ${i + 1}: ${formatBytes(currentMemory.heapUsed)} (${elapsed.toFixed(1)}s)`));

  // Wait a bit to simulate time passing
  await new Promise(resolve => setTimeout(resolve, 100));
}

console.log(chalk.green('\n✅ Memory leak simulation completed'));

// Analyze the leak
const finalMemory = process.memoryUsage();
const memoryGrowth = finalMemory.heapUsed - beforeTimerLeak.heapUsed;
const growthRate = memoryGrowth / 10; // MB per phase

console.log(chalk.cyan('\n📊 Memory Leak Analysis:'));
console.log(chalk.gray('═'.repeat(60)));
console.log(chalk.gray(`Total memory growth: ${formatBytes(memoryGrowth)}`));
console.log(chalk.gray(`Growth rate: ${formatBytes(growthRate)} per phase`));
console.log(chalk.gray(`Final heap used: ${formatBytes(finalMemory.heapUsed)}`));

if (growthRate > 1024 * 1024) {
  // > 1MB per phase
  console.log(chalk.red('  • 🔴 Critical memory leak detected!'));
} else if (growthRate > 100 * 1024) {
  // > 100KB per phase
  console.log(chalk.yellow('  • 🟡 Moderate memory leak detected'));
} else if (growthRate > 0) {
  console.log(chalk.yellow('  • 🟡 Minor memory growth - monitor closely'));
} else {
  console.log(chalk.green('  • 🟢 No memory leak detected'));
}

console.log(chalk.gray('═'.repeat(60)));

// Demo 6: Prevention and best practices
console.log(chalk.blue('\n📋 Demo 6: Memory Leak Prevention & Best Practices'));
console.log(chalk.yellow('Guidelines for preventing memory leaks\n'));

console.log(chalk.cyan('✅ Prevention Strategies:'));
console.log(chalk.gray('• Use weak references (WeakMap, WeakSet) for caches'));
console.log(chalk.gray('• Implement proper cleanup in destructors'));
console.log(chalk.gray('• Set size limits on data structures'));
console.log(chalk.gray('• Use time-based expiration policies'));
console.log(chalk.gray('• Monitor memory usage in production'));

console.log(chalk.cyan('\n🔍 Detection Methods:'));
console.log(chalk.gray('• Memory usage monitoring over time'));
console.log(chalk.gray('• Heap snapshot comparison'));
console.log(chalk.gray('• Memory leak detection tools'));
console.log(chalk.gray('• Performance profiling'));
console.log(chalk.gray('• Automated testing for memory leaks'));

console.log(chalk.cyan('\n❌ Common Pitfalls:'));
console.log(chalk.gray('• Forgetting to remove event listeners'));
console.log(chalk.gray('• Circular references in objects'));
console.log(chalk.gray('• Unbounded data accumulation'));
console.log(chalk.gray('• Not clearing timers and intervals'));
console.log(chalk.gray('• Storing large objects in global scope'));

// Final cleanup
console.log(chalk.yellow('\n🧹 Final cleanup...'));
leakDetectionData.length = 0;

// Run garbage collection if available
if (typeof global.gc === 'function') {
  console.log(chalk.yellow('🔄 Running garbage collection...'));
  global.gc();
  const afterFinalGC = process.memoryUsage();
  const finalFreed = finalMemory.heapUsed - afterFinalGC.heapUsed;
  console.log(chalk.green(`✅ Final memory freed: ${formatBytes(finalFreed)}`));
}

console.log(chalk.green('\n✅ Memory Leak demonstration completed!'));

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
