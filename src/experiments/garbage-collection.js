import chalk from 'chalk';
import { performance } from 'perf_hooks';

console.log(chalk.blue.bold('🗑️  Garbage Collection Demonstration'));
console.log(chalk.yellow('This demonstrates Node.js garbage collection and memory management\n'));

// Demo 1: Basic garbage collection
console.log(chalk.blue('📋 Demo 1: Basic Garbage Collection'));
console.log(chalk.yellow('Understanding how garbage collection works\n'));

console.log(chalk.cyan('Garbage Collection Basics:'));
console.log(chalk.gray('• V8 uses generational garbage collection'));
console.log(chalk.gray('• Young generation: New objects (scavenging)'));
console.log(chalk.gray('• Old generation: Surviving objects (mark-sweep)'));
console.log(chalk.gray('• Incremental marking for large heaps'));

// Demo 2: Memory allocation and GC triggers
console.log(chalk.blue('\n📋 Demo 2: Memory Allocation & GC Triggers'));
console.log(chalk.yellow('Showing how memory allocation triggers garbage collection\n'));

console.log(chalk.gray('🔄 Starting memory allocation demo...\n'));

// Check if --expose-gc flag is enabled
if (typeof global.gc !== 'function') {
  console.log(chalk.red('❌ Garbage collection not available. Run with: node --expose-gc'));
  console.log(chalk.yellow('💡 This demo requires the --expose-gc flag to work properly'));
  process.exit(1);
}

// Take initial memory snapshot
const initialMemory = process.memoryUsage();
console.log(chalk.cyan('📊 Initial Memory Usage:'));
console.log(chalk.gray(`  • Heap Used: ${formatBytes(initialMemory.heapUsed)}`));
console.log(chalk.gray(`  • Heap Total: ${formatBytes(initialMemory.heapTotal)}`));
console.log(chalk.gray(`  • External: ${formatBytes(initialMemory.external)}`));

// Allocate memory in chunks
const chunks = [];
const chunkSize = 1024 * 1024; // 1MB chunks
const numChunks = 50;

console.log(chalk.yellow(`\n🔄 Allocating ${numChunks} chunks of ${formatBytes(chunkSize)} each...`));

for (let i = 0; i < numChunks; i++) {
  const chunk = Buffer.alloc(chunkSize, i.toString());
  chunks.push(chunk);

  if (i % 10 === 0) {
    process.stdout.write(chalk.gray('.'));
  }
}

console.log(chalk.green(`\n✅ Allocated ${numChunks} chunks`));

// Check memory after allocation
const afterAllocation = process.memoryUsage();
console.log(chalk.cyan('\n📊 Memory After Allocation:'));
console.log(chalk.gray(`  • Heap Used: ${formatBytes(afterAllocation.heapUsed)}`));
console.log(chalk.gray(`  • Heap Total: ${formatBytes(afterAllocation.heapTotal)}`));
console.log(chalk.gray(`  • Memory Growth: ${formatBytes(afterAllocation.heapUsed - initialMemory.heapUsed)}`));

// Demo 3: Manual garbage collection
console.log(chalk.blue('\n📋 Demo 3: Manual Garbage Collection'));
console.log(chalk.yellow('Triggering garbage collection manually\n'));

console.log(chalk.gray('🔄 Running manual garbage collection...'));
const gcStart = performance.now();

global.gc();

const gcDuration = performance.now() - gcStart;
const afterGC = process.memoryUsage();

console.log(chalk.green(`✅ Garbage collection completed in ${gcDuration.toFixed(2)}ms`));
console.log(chalk.cyan('\n📊 Memory After GC:'));
console.log(chalk.gray(`  • Heap Used: ${formatBytes(afterGC.heapUsed)}`));
console.log(chalk.gray(`  • Heap Total: ${formatBytes(afterGC.heapTotal)}`));
console.log(chalk.gray(`  • Memory Freed: ${formatBytes(afterAllocation.heapUsed - afterGC.heapUsed)}`));

// Demo 4: Memory leak demonstration
console.log(chalk.blue('\n📋 Demo 4: Memory Leak Demonstration'));
console.log(chalk.yellow('Showing how memory leaks prevent garbage collection\n'));

console.log(chalk.gray('🔄 Starting memory leak demo...\n'));

// Create objects that won't be garbage collected
const leakyObjects = [];
const leakChunkSize = 512 * 1024; // 512KB chunks
const numLeakChunks = 20;

console.log(chalk.yellow(`🔄 Creating ${numLeakChunks} leaky objects...`));

for (let i = 0; i < numLeakChunks; i++) {
  const leakyObject = {
    id: i,
    data: Buffer.alloc(leakChunkSize, i.toString()),
    timestamp: Date.now(),
    reference: leakyObjects, // Circular reference!
  };
  leakyObjects.push(leakyObject);

  if (i % 5 === 0) {
    process.stdout.write(chalk.gray('.'));
  }
}

console.log(chalk.green(`\n✅ Created ${numLeakChunks} leaky objects`));

// Check memory with leaky objects
const withLeaks = process.memoryUsage();
console.log(chalk.cyan('\n📊 Memory With Leaks:'));
console.log(chalk.gray(`  • Heap Used: ${formatBytes(withLeaks.heapUsed)}`));
console.log(chalk.gray(`  • Heap Total: ${formatBytes(withLeaks.heapTotal)}`));
console.log(chalk.gray(`  • Additional Memory: ${formatBytes(withLeaks.heapUsed - afterGC.heapUsed)}`));

// Try to garbage collect (shouldn't free much due to leaks)
console.log(chalk.yellow('\n🔄 Running garbage collection with leaks...'));
const leakGCStart = performance.now();

global.gc();

const leakGCDuration = performance.now() - leakGCStart;
const afterLeakGC = process.memoryUsage();

console.log(chalk.green(`✅ Garbage collection completed in ${leakGCDuration.toFixed(2)}ms`));
console.log(chalk.cyan('\n📊 Memory After GC (with leaks):'));
console.log(chalk.gray(`  • Heap Used: ${formatBytes(afterLeakGC.heapUsed)}`));
console.log(chalk.gray(`  • Heap Total: ${formatBytes(afterLeakGC.heapTotal)}`));
console.log(chalk.gray(`  • Memory Freed: ${formatBytes(withLeaks.heapUsed - afterLeakGC.heapUsed)}`));

if (afterLeakGC.heapUsed > withLeaks.heapUsed * 0.9) {
  console.log(chalk.red('  • ⚠️  Memory leak detected - most memory not freed'));
} else {
  console.log(chalk.green('  • ✅ Memory properly freed'));
}

// Demo 5: Memory cleanup demonstration
console.log(chalk.blue('\n📋 Demo 5: Memory Cleanup Demonstration'));
console.log(chalk.yellow('Showing proper memory cleanup techniques\n'));

console.log(chalk.gray('🔄 Starting cleanup demo...\n'));

// Clean up leaky objects
console.log(chalk.yellow('🔄 Cleaning up leaky objects...'));
leakyObjects.length = 0; // Clear the array

// Clean up regular chunks
console.log(chalk.yellow('🔄 Cleaning up regular chunks...'));
chunks.length = 0; // Clear the array

// Run final garbage collection
console.log(chalk.yellow('🔄 Running final garbage collection...'));
const finalGCStart = performance.now();

global.gc();

const finalGCDuration = performance.now() - finalGCStart;
const finalMemory = process.memoryUsage();

console.log(chalk.green(`✅ Final garbage collection completed in ${finalGCDuration.toFixed(2)}ms`));
console.log(chalk.cyan('\n📊 Final Memory Usage:'));
console.log(chalk.gray(`  • Heap Used: ${formatBytes(finalMemory.heapUsed)}`));
console.log(chalk.gray(`  • Heap Total: ${formatBytes(finalMemory.heapTotal)}`));
console.log(chalk.gray(`  • Total Memory Freed: ${formatBytes(afterAllocation.heapUsed - finalMemory.heapUsed)}`));

// Demo 6: GC performance analysis
console.log(chalk.blue('\n📋 Demo 6: Garbage Collection Performance Analysis'));
console.log(chalk.yellow('Analyzing GC performance and memory efficiency\n'));

console.log(chalk.cyan('📊 GC Performance Summary:'));
console.log(chalk.gray('═'.repeat(60)));

const gcStats = [
  { name: 'Initial GC', duration: gcDuration, memoryFreed: afterAllocation.heapUsed - afterGC.heapUsed },
  { name: 'Leak GC', duration: leakGCDuration, memoryFreed: withLeaks.heapUsed - afterLeakGC.heapUsed },
  { name: 'Final GC', duration: finalGCDuration, memoryFreed: withLeaks.heapUsed - finalMemory.heapUsed },
];

gcStats.forEach((stat, index) => {
  const color = stat.memoryFreed > 0 ? chalk.green : chalk.red;
  console.log(
    color(`${stat.name.padEnd(15)} ${stat.duration.toFixed(2)}ms ${formatBytes(stat.memoryFreed).padEnd(15)}`),
  );
});

console.log(chalk.gray('═'.repeat(60)));

// Memory efficiency analysis
const totalAllocated = afterAllocation.heapUsed - initialMemory.heapUsed;
const totalFreed = afterAllocation.heapUsed - finalMemory.heapUsed;
const efficiency = (totalFreed / totalAllocated) * 100;

console.log(chalk.yellow('\n📈 Memory Efficiency Analysis:'));
console.log(chalk.gray(`  • Total Allocated: ${formatBytes(totalAllocated)}`));
console.log(chalk.gray(`  • Total Freed: ${formatBytes(totalFreed)}`));
console.log(chalk.gray(`  • Cleanup Efficiency: ${efficiency.toFixed(1)}%`));

if (efficiency > 90) {
  console.log(chalk.green('  • ✅ Excellent memory cleanup'));
} else if (efficiency > 70) {
  console.log(chalk.yellow('  • ⚠️  Good memory cleanup'));
} else {
  console.log(chalk.red('  • ❌ Poor memory cleanup - potential leaks'));
}

// Demo 7: Best practices
console.log(chalk.blue('\n📋 Demo 7: Garbage Collection Best Practices'));
console.log(chalk.yellow('Guidelines for efficient memory management\n'));

console.log(chalk.cyan('✅ Do:'));
console.log(chalk.gray('  • Use weak references (WeakMap, WeakSet) for caches'));
console.log(chalk.gray('  • Clear arrays and objects when done'));
console.log(chalk.gray('  • Avoid circular references'));
console.log(chalk.gray('  • Use object pooling for frequently created objects'));
console.log(chalk.gray('  • Monitor memory usage in production'));

console.log(chalk.cyan("\n❌ Don't:"));
console.log(chalk.gray('  • Create objects in tight loops without cleanup'));
console.log(chalk.gray('  • Store large objects in global scope'));
console.log(chalk.gray('  • Ignore memory leaks'));
console.log(chalk.gray('  • Use synchronous I/O in production'));
console.log(chalk.gray('  • Forget to clear event listeners'));

console.log(chalk.green('\n✅ Garbage Collection demonstration completed!'));

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
