import chalk from 'chalk';
import { EventEmitter } from 'events';

export class MemoryProfiler {
  constructor(rl) {
    this.rl = rl;
    this.monitoring = false;
    this.memoryHistory = [];
    this.leakTests = [];
  }

  async demonstrateLeak() {
    while (true) {
      console.log(chalk.blue('\n💾 Memory Leak Demonstration'));
      console.log(chalk.yellow('This will show common memory leak patterns and how to detect them'));

      const choice = await this.question(
        chalk.green(
          '\nSelect leak type:\n1. Event listener leak\n2. Closure leak\n3. Array/object accumulation\n4. Timer leak\n5. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.eventListenerLeak();
          break;
        case '2':
          await this.closureLeak();
          break;
        case '3':
          await this.accumulationLeak();
          break;
        case '4':
          await this.timerLeak();
          break;
        case '5':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }

      // Wait for user to continue
      await this.question(chalk.gray('\nPress Enter to continue...'));
    }
  }

  async eventListenerLeak() {
    console.log(chalk.blue('\n🎧 Event Listener Memory Leak'));
    console.log(chalk.yellow('This demonstrates how event listeners can cause memory leaks'));

    const iterations = 10000;
    console.log(chalk.cyan(`\n🔄 Creating ${iterations.toLocaleString()} event listeners...`));

    const before = process.memoryUsage();
    const listeners = [];

    // Create event emitters with listeners
    for (let i = 0; i < iterations; i++) {
      const emitter = new EventEmitter();
      const listener = data => {
        // This listener captures the emitter in its closure
        console.log(`Listener ${i} received: ${data}`);
      };

      emitter.on('data', listener);
      listeners.push({ emitter, listener });

      // Emit some events
      emitter.emit('data', `Event ${i}`);
    }

    const afterCreation = process.memoryUsage();
    console.log(chalk.green(`✅ Created ${iterations.toLocaleString()} event listeners`));
    console.log(chalk.cyan(`📊 Memory used: ${this.formatBytes(afterCreation.heapUsed - before.heapUsed)}`));

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
    console.log(chalk.yellow('\n🧹 Cleaning up properly...'));
    listeners.forEach(({ emitter, listener }) => {
      emitter.removeListener('data', listener);
    });

    listeners.length = 0;

    if (global.gc) {
      console.log(chalk.yellow('🔄 Running garbage collection...'));
      global.gc();
      const afterGC = process.memoryUsage();
      const freed = afterCreation.heapUsed - afterGC.heapUsed;
      console.log(chalk.green(`✅ Memory freed: ${this.formatBytes(freed)}`));
    }
  }

  async closureLeak() {
    console.log(chalk.blue('\n🔒 Closure Memory Leak'));
    console.log(chalk.yellow('This demonstrates how closures can capture large objects in memory'));

    const iterations = 1000;
    console.log(chalk.cyan(`\n🔄 Creating ${iterations.toLocaleString()} closures with large data...`));

    const before = process.memoryUsage();
    const closures = [];

    // Create closures that capture large data
    for (let i = 0; i < iterations; i++) {
      const largeData = new Array(10000).fill(`Data for closure ${i}`);
      const closure = () => {
        // This closure captures largeData in its scope
        return largeData.length;
      };

      closures.push(closure);
    }

    const afterCreation = process.memoryUsage();
    console.log(chalk.green(`✅ Created ${iterations.toLocaleString()} closures`));
    console.log(chalk.cyan(`📊 Memory used: ${this.formatBytes(afterCreation.heapUsed - before.heapUsed)}`));

    // Demonstrate the leak
    console.log(chalk.yellow('\n⚠️  Memory Leak Detected!'));
    console.log(chalk.gray('• Each closure captures largeData in its lexical scope'));
    console.log(chalk.gray('• Even though we only need the function, the data stays in memory'));
    console.log(chalk.gray('• This is a common pattern in event handlers and callbacks'));

    // Show how to fix it
    console.log(chalk.cyan('\n🔧 How to Fix:'));
    console.log(chalk.gray('• Pass only necessary data to closures'));
    console.log(chalk.gray('• Use weak references (WeakMap, WeakSet)'));
    console.log(chalk.gray('• Restructure code to avoid capturing large objects'));

    // Clean up
    console.log(chalk.yellow('\n🧹 Cleaning up...'));
    closures.length = 0;

    if (global.gc) {
      console.log(chalk.yellow('🔄 Running garbage collection...'));
      global.gc();
      const afterGC = process.memoryUsage();
      const freed = afterCreation.heapUsed - afterGC.heapUsed;
      console.log(chalk.green(`✅ Memory freed: ${this.formatBytes(freed)}`));
    }
  }

  async accumulationLeak() {
    console.log(chalk.blue('\n📦 Array/Object Accumulation Leak'));
    console.log(chalk.yellow('This demonstrates how accumulating data can cause memory leaks'));

    const iterations = 100000;
    console.log(chalk.cyan(`\n🔄 Accumulating ${iterations.toLocaleString()} objects...`));

    const before = process.memoryUsage();
    const dataStore = [];

    // Simulate data accumulation (common in caches, logs, etc.)
    for (let i = 0; i < iterations; i++) {
      dataStore.push({
        id: i,
        timestamp: Date.now(),
        data: `Data point ${i}`,
        metadata: {
          source: 'sensor',
          value: Math.random() * 1000,
          tags: Array.from({ length: 10 }, (_, j) => `tag${j}`),
        },
      });

      // Simulate some processing
      if (i % 10000 === 0) {
        console.log(chalk.gray(`  • Processed ${i.toLocaleString()} items...`));
      }
    }

    const afterCreation = process.memoryUsage();
    console.log(chalk.green(`✅ Accumulated ${iterations.toLocaleString()} objects`));
    console.log(chalk.cyan(`📊 Memory used: ${this.formatBytes(afterCreation.heapUsed - before.heapUsed)}`));

    // Demonstrate the leak
    console.log(chalk.yellow('\n⚠️  Memory Leak Detected!'));
    console.log(chalk.gray('• Data is continuously accumulating without cleanup'));
    console.log(chalk.gray('• Old data is never removed or expired'));
    console.log(chalk.gray('• This is common in logging systems, caches, and data collectors'));

    // Show how to fix it
    console.log(chalk.cyan('\n🔧 How to Fix:'));
    console.log(chalk.gray('• Implement data expiration (TTL)'));
    console.log(chalk.gray('• Use circular buffers or size limits'));
    console.log(chalk.gray('• Implement LRU (Least Recently Used) eviction'));
    console.log(chalk.gray('• Regular cleanup of old data'));

    // Demonstrate cleanup strategies
    console.log(chalk.yellow('\n🧹 Demonstrating cleanup strategies...'));

    // Strategy 1: Keep only recent data
    const cutoffTime = Date.now() - 60000; // 1 minute ago
    const recentData = dataStore.filter(item => item.timestamp > cutoffTime);
    console.log(chalk.cyan(`  • Recent data only: ${recentData.length.toLocaleString()} items`));

    // Strategy 2: Keep only first N items
    const firstN = dataStore.slice(0, 10000);
    console.log(chalk.cyan(`  • First 10K items: ${firstN.length.toLocaleString()} items`));

    // Strategy 3: Clear everything
    dataStore.length = 0;
    console.log(chalk.cyan(`  • Cleared all data: ${dataStore.length} items`));

    if (global.gc) {
      console.log(chalk.yellow('🔄 Running garbage collection...'));
      global.gc();
      const afterGC = process.memoryUsage();
      const freed = afterCreation.heapUsed - afterGC.heapUsed;
      console.log(chalk.green(`✅ Memory freed: ${this.formatBytes(freed)}`));
    }
  }

  async timerLeak() {
    console.log(chalk.blue('\n⏰ Timer Memory Leak'));
    console.log(chalk.yellow('This demonstrates how timers can cause memory leaks'));

    const iterations = 1000;
    console.log(chalk.cyan(`\n🔄 Creating ${iterations.toLocaleString()} timers...`));

    const before = process.memoryUsage();
    const timers = [];

    // Create various types of timers
    for (let i = 0; i < iterations; i++) {
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

    const afterCreation = process.memoryUsage();
    console.log(chalk.green(`✅ Created ${iterations.toLocaleString()} timers`));
    console.log(chalk.cyan(`📊 Memory used: ${this.formatBytes(afterCreation.heapUsed - before.heapUsed)}`));

    // Demonstrate the leak
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

    if (global.gc) {
      console.log(chalk.yellow('🔄 Running garbage collection...'));
      global.gc();
      const afterGC = process.memoryUsage();
      const freed = afterCreation.heapUsed - afterGC.heapUsed;
      console.log(chalk.green(`✅ Memory freed: ${this.formatBytes(freed)}`));
    }
  }

  async monitorUsage() {
    console.log(chalk.blue('\n📊 Memory Usage Monitoring'));
    console.log(chalk.yellow('This will continuously monitor memory usage and detect patterns'));

    console.log(chalk.cyan('\n📋 Monitoring Options:'));
    console.log(chalk.gray('• Press Enter to stop monitoring'));
    console.log(chalk.gray('• Monitoring will continue until you stop it'));

    this.monitoring = true;
    const startTime = Date.now();
    let interval;

    // Start monitoring
    interval = setInterval(() => {
      if (!this.monitoring) {
        clearInterval(interval);
        return;
      }

      const memUsage = process.memoryUsage();
      const timestamp = Date.now();

      this.memoryHistory.push({
        timestamp,
        ...memUsage,
      });

      // Keep only last 1000 snapshots
      if (this.memoryHistory.length > 1000) {
        this.memoryHistory.shift();
      }

      // Display current status
      const elapsed = (timestamp - startTime) / 1000;
      const heapUtilization = (memUsage.heapUsed / memUsage.heapTotal) * 100;

      console.clear();
      console.log(chalk.blue.bold('📊 Memory Usage Monitor'));
      console.log(chalk.cyan('═'.repeat(60)));
      console.log(chalk.yellow(`⏱️  Elapsed: ${elapsed.toFixed(1)}s`));
      console.log(chalk.yellow(`📊 Heap Used: ${this.formatBytes(memUsage.heapUsed)}`));
      console.log(chalk.yellow(`🏗️  Heap Total: ${this.formatBytes(memUsage.heapTotal)}`));
      console.log(chalk.yellow(`💾 External: ${this.formatBytes(memUsage.external)}`));
      console.log(chalk.yellow(`📦 Array Buffers: ${this.formatBytes(memUsage.arrayBuffers)}`));
      console.log(chalk.yellow(`📈 Utilization: ${heapUtilization.toFixed(2)}%`));

      // Memory trend
      if (this.memoryHistory.length > 1) {
        this.showMemoryTrend();
      }

      // Memory pressure indicators
      this.showMemoryPressureIndicators(memUsage);

      // Show stop instruction
      console.log(chalk.cyan('\n💡 Press Enter to stop monitoring'));
    }, 1000);

    // Wait for user to press Enter to stop
    await this.question(chalk.yellow('\n🛑 Press Enter to stop monitoring...'));

    this.monitoring = false;
    clearInterval(interval);

    // Final analysis
    await this.analyzeMemoryHistory();
  }

  showMemoryTrend() {
    if (this.memoryHistory.length < 2) return;

    const recent = this.memoryHistory.slice(-10);
    const values = recent.map(s => s.heapUsed / (1024 * 1024)); // Convert to MB

    console.log(chalk.cyan('\n📈 Memory Trend (Last 10 snapshots):'));

    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const chartHeight = 8;

    for (let i = chartHeight; i >= 0; i--) {
      const threshold = minValue + (maxValue - minValue) * (i / chartHeight);
      const line = recent
        .map((_, j) => {
          return values[j] >= threshold ? '█' : '░';
        })
        .join(' ');

      const yLabel = i === chartHeight ? `${maxValue.toFixed(1)}MB` : i === 0 ? `${minValue.toFixed(1)}MB` : '';

      console.log(chalk.gray(`${yLabel.padStart(8)} ${line}`));
    }

    const labels = recent.map((_, i) => `T${i + 1}`);
    console.log(chalk.gray('         ' + labels.join(' ')));
  }

  showMemoryPressureIndicators(memUsage) {
    const heapUtilization = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    console.log(chalk.yellow('\n⚠️  Memory Pressure Indicators:'));

    if (heapUtilization > 90) {
      console.log(chalk.red('  • 🔴 Critical: Heap utilization > 90%'));
    } else if (heapUtilization > 80) {
      console.log(chalk.red('  • 🔴 High: Heap utilization > 80%'));
    } else if (heapUtilization > 70) {
      console.log(chalk.yellow('  • 🟡 Moderate: Heap utilization > 70%'));
    } else {
      console.log(chalk.green('  • 🟢 Healthy: Heap utilization < 70%'));
    }

    // Check for rapid growth
    if (this.memoryHistory.length > 5) {
      const recent = this.memoryHistory.slice(-5);
      const growth = recent[recent.length - 1].heapUsed - recent[0].heapUsed;
      const growthRate = growth / 5; // MB per second

      if (growthRate > 10) {
        console.log(chalk.red(`  • 🔴 Rapid growth: ${growthRate.toFixed(1)}MB/s`));
      } else if (growthRate > 1) {
        console.log(chalk.yellow(`  • 🟡 Steady growth: ${growthRate.toFixed(1)}MB/s`));
      } else if (growthRate < -1) {
        console.log(chalk.green(`  • 🟢 Memory decreasing: ${Math.abs(growthRate).toFixed(1)}MB/s`));
      } else {
        console.log(chalk.green('  • 🟢 Memory stable'));
      }
    }
  }

  async analyzeMemoryHistory() {
    if (this.memoryHistory.length < 2) {
      console.log(chalk.yellow('Not enough data for analysis'));
      return;
    }

    console.log(chalk.blue('\n📊 Memory Usage Analysis'));
    console.log(chalk.cyan('═'.repeat(60)));

    const heapUsed = this.memoryHistory.map(s => s.heapUsed);
    const heapTotal = this.memoryHistory.map(s => s.heapTotal);
    const external = this.memoryHistory.map(s => s.external);

    // Calculate statistics
    const stats = {
      heapUsed: {
        min: Math.min(...heapUsed),
        max: Math.max(...heapUsed),
        avg: heapUsed.reduce((sum, val) => sum + val, 0) / heapUsed.length,
        growth: heapUsed[heapUsed.length - 1] - heapUsed[0],
      },
      heapTotal: {
        min: Math.min(...heapTotal),
        max: Math.max(...heapTotal),
        avg: heapTotal.reduce((sum, val) => sum + val, 0) / heapTotal.length,
      },
      external: {
        min: Math.min(...external),
        max: Math.max(...external),
        avg: external.reduce((sum, val) => sum + val, 0) / external.length,
      },
    };

    console.log(chalk.yellow('📈 Heap Used:'));
    console.log(chalk.gray(`  • Min: ${this.formatBytes(stats.heapUsed.min)}`));
    console.log(chalk.gray(`  • Max: ${this.formatBytes(stats.heapUsed.max)}`));
    console.log(chalk.gray(`  • Average: ${this.formatBytes(stats.heapUsed.avg)}`));
    console.log(chalk.gray(`  • Growth: ${this.formatBytes(stats.heapUsed.growth)}`));

    console.log(chalk.yellow('\n🏗️  Heap Total:'));
    console.log(chalk.gray(`  • Min: ${this.formatBytes(stats.heapTotal.min)}`));
    console.log(chalk.gray(`  • Max: ${this.formatBytes(stats.heapTotal.max)}`));
    console.log(chalk.gray(`  • Average: ${this.formatBytes(stats.heapTotal.avg)}`));

    console.log(chalk.yellow('\n💾 External Memory:'));
    console.log(chalk.gray(`  • Min: ${this.formatBytes(stats.external.min)}`));
    console.log(chalk.gray(`  • Max: ${this.formatBytes(stats.external.max)}`));
    console.log(chalk.gray(`  • Average: ${this.formatBytes(stats.external.avg)}`));

    // Memory leak detection
    if (stats.heapUsed.growth > 10 * 1024 * 1024) {
      // 10MB growth
      console.log(chalk.red('\n⚠️  Potential Memory Leak Detected!'));
      console.log(chalk.gray(`  • Memory grew by ${this.formatBytes(stats.heapUsed.growth)} during monitoring`));
      console.log(chalk.gray('  • Consider investigating for memory leaks'));
    } else if (stats.heapUsed.growth > 0) {
      console.log(chalk.yellow('\n⚠️  Memory Growth Observed'));
      console.log(chalk.gray(`  • Memory grew by ${this.formatBytes(stats.heapUsed.growth)} during monitoring`));
      console.log(chalk.gray('  • Monitor for continued growth'));
    } else {
      console.log(chalk.green('\n✅ Memory Stable'));
      console.log(chalk.gray('  • No significant memory growth detected'));
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  question(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, resolve);
    });
  }
}
