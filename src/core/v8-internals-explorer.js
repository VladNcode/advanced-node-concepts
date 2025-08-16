import chalk from 'chalk';

export class V8InternalsExplorer {
  constructor(rl) {
    this.rl = rl;
    this.monitoring = false;
    this.heapSnapshots = [];
    this.gcHistory = [];
  }

  async showHeapStats() {
    while (true) {
      console.log(chalk.blue('\n🧠 V8 Heap Statistics'));
      console.log(chalk.yellow('Exploring V8 memory management and heap structure'));

      const choice = await this.question(
        chalk.green(
          '\nSelect analysis:\n1. Current heap stats\n2. Monitor heap growth\n3. Analyze heap structure\n4. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.displayCurrentHeapStats();
          break;
        case '2':
          await this.monitorHeapGrowth();
          break;
        case '3':
          await this.analyzeHeapStructure();
          break;
        case '4':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }

      // Wait for user to continue
      await this.question(chalk.gray('\nPress Enter to continue...'));
    }
  }

  async displayCurrentHeapStats() {
    console.log(chalk.blue('\n📊 Current V8 Heap Statistics'));
    console.log(chalk.cyan('═'.repeat(60)));

    const memUsage = process.memoryUsage();

    // V8 heap statistics
    console.log(chalk.yellow('🏗️  V8 Heap:'));
    console.log(chalk.gray(`  • Total Heap Size: ${this.formatBytes(memUsage.heapTotal)}`));
    console.log(chalk.gray(`  • Used Heap Size: ${this.formatBytes(memUsage.heapUsed)}`));
    console.log(chalk.gray(`  • External Memory: ${this.formatBytes(memUsage.external)}`));
    console.log(chalk.gray(`  • Array Buffers: ${this.formatBytes(memUsage.arrayBuffers)}`));

    // Calculate heap utilization
    const heapUtilization = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    console.log(chalk.cyan(`  • Heap Utilization: ${heapUtilization.toFixed(2)}%`));

    // Memory pressure indicators
    this.showMemoryPressureIndicators(memUsage);

    // Show memory allocation over time
    this.showMemoryTrend();
  }

  showMemoryPressureIndicators(memUsage) {
    console.log(chalk.yellow('\n⚠️  Memory Pressure Indicators:'));

    const heapUtilization = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    if (heapUtilization > 90) {
      console.log(chalk.red('  • 🔴 High heap utilization (>90%)'));
    } else if (heapUtilization > 70) {
      console.log(chalk.yellow('  • 🟡 Moderate heap utilization (>70%)'));
    } else {
      console.log(chalk.green('  • 🟢 Healthy heap utilization'));
    }

    // Check for memory leaks (simplified)
    if (this.heapSnapshots.length > 1) {
      const recent = this.heapSnapshots[this.heapSnapshots.length - 1];
      const previous = this.heapSnapshots[this.heapSnapshots.length - 2];
      const growth = recent.heapUsed - previous.heapUsed;

      if (growth > 10 * 1024 * 1024) {
        // 10MB growth
        console.log(chalk.red('  • 🔴 Rapid memory growth detected'));
      } else if (growth > 0) {
        console.log(chalk.yellow('  • 🟡 Steady memory growth'));
      } else {
        console.log(chalk.green('  • 🟢 Memory stable or decreasing'));
      }
    }
  }

  showMemoryTrend() {
    if (this.heapSnapshots.length < 2) return;

    console.log(chalk.yellow('\n📈 Memory Trend (Last 10 snapshots):'));

    const recent = this.heapSnapshots.slice(-10);
    const labels = recent.map((_, i) => `T${i + 1}`);
    const values = recent.map(s => s.heapUsed / (1024 * 1024)); // Convert to MB

    // Simple ASCII chart
    const maxValue = Math.max(...values);
    const chartHeight = 10;

    for (let i = chartHeight; i >= 0; i--) {
      const threshold = (maxValue / chartHeight) * i;
      const line = labels
        .map((label, j) => {
          return values[j] >= threshold ? '█' : '░';
        })
        .join(' ');

      const yLabel = i === chartHeight ? `${maxValue.toFixed(1)}MB` : i === 0 ? '0MB' : '';

      console.log(chalk.gray(`${yLabel.padStart(8)} ${line}`));
    }

    console.log(chalk.gray('         ' + labels.join(' ')));
  }

  async monitorHeapGrowth() {
    console.log(chalk.blue('\n📊 Monitoring Heap Growth'));
    console.log(chalk.yellow('Taking snapshots every 2 seconds. Press Enter to stop.'));

    this.monitoring = true;
    let snapshotCount = 0;

    const interval = setInterval(() => {
      if (!this.monitoring) {
        clearInterval(interval);
        return;
      }

      const memUsage = process.memoryUsage();
      this.heapSnapshots.push({
        timestamp: Date.now(),
        ...memUsage,
      });

      snapshotCount++;
      console.log(chalk.cyan(`📸 Snapshot ${snapshotCount}: ${this.formatBytes(memUsage.heapUsed)}`));

      // Keep only last 50 snapshots
      if (this.heapSnapshots.length > 50) {
        this.heapSnapshots.shift();
      }
    }, 2000);

    // Wait for user to stop
    await this.question(chalk.green('\nPress Enter to stop monitoring...'));
    this.monitoring = false;
    clearInterval(interval);

    console.log(chalk.green(`✅ Monitoring stopped. Collected ${snapshotCount} snapshots.`));
  }

  async analyzeHeapStructure() {
    console.log(chalk.blue('\n🔍 Analyzing Heap Structure'));
    console.log(chalk.yellow('This simulates V8 heap analysis'));

    // Simulate heap analysis
    console.log(chalk.cyan('\n📊 Heap Space Analysis:'));
    console.log(chalk.gray('• New Space (Scavenger): Young objects, fast allocation'));
    console.log(chalk.gray('• Old Space (Mark-Sweep): Surviving objects, slower GC'));
    console.log(chalk.gray('• Large Object Space: Objects > 1MB'));
    console.log(chalk.gray('• Code Space: JIT compiled code'));
    console.log(chalk.gray('• Map Space: Hidden classes and maps'));

    // Simulate object allocation patterns
    console.log(chalk.cyan('\n🎯 Object Allocation Patterns:'));
    console.log(chalk.gray('• Small objects (< 1KB): Allocated in New Space'));
    console.log(chalk.gray('• Medium objects (1KB - 1MB): Allocated in Old Space'));
    console.log(chalk.gray('• Large objects (> 1MB): Allocated in Large Object Space'));

    // Show current allocation
    const memUsage = process.memoryUsage();
    const newSpaceEstimate = memUsage.heapUsed * 0.3; // Rough estimate
    const oldSpaceEstimate = memUsage.heapUsed * 0.6;
    const largeObjectEstimate = memUsage.heapUsed * 0.1;

    console.log(chalk.yellow('\n📈 Estimated Space Distribution:'));
    console.log(chalk.green(`  • New Space: ${this.formatBytes(newSpaceEstimate)}`));
    console.log(chalk.blue(`  • Old Space: ${this.formatBytes(oldSpaceEstimate)}`));
    console.log(chalk.red(`  • Large Object Space: ${this.formatBytes(largeObjectEstimate)}`));
  }

  async demonstrateGC() {
    while (true) {
      console.log(chalk.blue('\n🗑️  Garbage Collection Demonstration'));
      console.log(chalk.yellow('This will show how V8 manages memory and performs GC'));

      const choice = await this.question(
        chalk.green(
          '\nSelect GC demonstration:\n1. Force garbage collection\n2. Create and release objects\n3. Show GC statistics\n4. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.forceGarbageCollection();
          break;
        case '2':
          await this.createAndReleaseObjects();
          break;
        case '3':
          await this.showGCStatistics();
          break;
        case '4':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }

      // Wait for user to continue
      await this.question(chalk.gray('\nPress Enter to continue...'));
    }
  }

  async forceGarbageCollection() {
    console.log(chalk.blue('\n🗑️  Forcing Garbage Collection'));

    if (global.gc) {
      console.log(chalk.yellow('Running garbage collection...'));

      const before = process.memoryUsage();
      global.gc();
      const after = process.memoryUsage();

      const freed = before.heapUsed - after.heapUsed;

      console.log(chalk.green(`✅ Garbage collection completed!`));
      console.log(chalk.cyan(`📊 Memory freed: ${this.formatBytes(freed)}`));
      console.log(chalk.cyan(`📊 Before: ${this.formatBytes(before.heapUsed)}`));
      console.log(chalk.cyan(`📊 After: ${this.formatBytes(after.heapUsed)}`));

      // Record GC event
      this.gcHistory.push({
        timestamp: Date.now(),
        memoryFreed: freed,
        before: before.heapUsed,
        after: after.heapUsed,
      });
    } else {
      console.log(chalk.red('❌ Garbage collection not available'));
      console.log(chalk.yellow('Run with --expose-gc flag to enable'));
      console.log(chalk.gray('Example: node --expose-gc src/index.js'));
    }
  }

  async createAndReleaseObjects() {
    console.log(chalk.blue('\n🔨 Creating and Releasing Objects'));
    console.log(chalk.yellow('This will demonstrate object lifecycle and memory management'));

    const iterations = 100000;
    console.log(chalk.cyan(`\n🔄 Creating ${iterations.toLocaleString()} objects...`));

    const before = process.memoryUsage();
    const objects = [];

    // Create objects
    for (let i = 0; i < iterations; i++) {
      objects.push({
        id: i,
        data: `Object ${i}`,
        timestamp: Date.now(),
        metadata: {
          created: new Date(),
          tags: [`tag${i % 10}`],
          properties: Array.from({ length: 5 }, (_, j) => `prop${j}`),
        },
      });
    }

    const afterCreation = process.memoryUsage();
    console.log(chalk.green(`✅ Created ${iterations.toLocaleString()} objects`));
    console.log(chalk.cyan(`📊 Memory used: ${this.formatBytes(afterCreation.heapUsed - before.heapUsed)}`));

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Release objects
    console.log(chalk.yellow('\n🗑️  Releasing objects...'));
    objects.length = 0; // Clear array

    const afterRelease = process.memoryUsage();
    console.log(chalk.green(`✅ Released ${iterations.toLocaleString()} objects`));

    // Force GC if available
    if (global.gc) {
      console.log(chalk.yellow('🔄 Running garbage collection...'));
      global.gc();
      const afterGC = process.memoryUsage();

      const totalFreed = before.heapUsed - afterGC.heapUsed;
      const immediateFreed = afterCreation.heapUsed - afterRelease.heapUsed;
      const gcFreed = afterRelease.heapUsed - afterGC.heapUsed;

      console.log(chalk.cyan('\n📊 Memory Analysis:'));
      console.log(chalk.gray(`  • Immediate release: ${this.formatBytes(immediateFreed)}`));
      console.log(chalk.gray(`  • GC cleanup: ${this.formatBytes(gcFreed)}`));
      console.log(chalk.gray(`  • Total freed: ${this.formatBytes(totalFreed)}`));
    }
  }

  async showGCStatistics() {
    console.log(chalk.blue('\n📊 Garbage Collection Statistics'));

    if (this.gcHistory.length === 0) {
      console.log(chalk.yellow('No GC events recorded yet. Run some GC demonstrations first.'));
      return;
    }

    console.log(chalk.cyan(`\n📈 GC Events: ${this.gcHistory.length}`));

    const totalFreed = this.gcHistory.reduce((sum, event) => sum + event.memoryFreed, 0);
    const avgFreed = totalFreed / this.gcHistory.length;
    const maxFreed = Math.max(...this.gcHistory.map(e => e.memoryFreed));

    console.log(chalk.yellow('📊 Summary:'));
    console.log(chalk.gray(`  • Total memory freed: ${this.formatBytes(totalFreed)}`));
    console.log(chalk.gray(`  • Average per GC: ${this.formatBytes(avgFreed)}`));
    console.log(chalk.gray(`  • Maximum freed: ${this.formatBytes(maxFreed)}`));

    // Show recent events
    console.log(chalk.yellow('\n🕐 Recent GC Events:'));
    const recent = this.gcHistory.slice(-5);
    recent.forEach((event, i) => {
      const timeAgo = Date.now() - event.timestamp;
      const timeStr = timeAgo < 60000 ? `${Math.floor(timeAgo / 1000)}s ago` : `${Math.floor(timeAgo / 60000)}m ago`;

      console.log(chalk.gray(`  ${i + 1}. ${this.formatBytes(event.memoryFreed)} freed (${timeStr})`));
    });
  }

  async showMemoryPatterns() {
    console.log(chalk.blue('\n🎯 Memory Allocation Patterns'));
    console.log(chalk.yellow('Understanding how V8 allocates and manages memory'));

    console.log(chalk.cyan('\n🏗️  V8 Memory Management:'));
    console.log(chalk.gray('• V8 uses a generational garbage collector'));
    console.log(chalk.gray('• New objects start in the "New Space" (scavenger)'));
    console.log(chalk.gray('• Objects that survive multiple GCs move to "Old Space"'));
    console.log(chalk.gray('• Large objects go directly to "Large Object Space"'));

    console.log(chalk.cyan('\n⚡ Allocation Strategies:'));
    console.log(chalk.gray('• Fast allocation in New Space (bump pointer)'));
    console.log(chalk.gray('• Slower allocation in Old Space (free list)'));
    console.log(chalk.gray('• Special handling for arrays and typed arrays'));

    // Demonstrate different allocation patterns
    console.log(chalk.yellow('\n🔬 Allocation Pattern Examples:'));

    // Small objects (New Space)
    const smallObjects = [];
    for (let i = 0; i < 1000; i++) {
      smallObjects.push({ id: i, value: i * 2 });
    }
    console.log(chalk.green(`  • Small objects: ${smallObjects.length} created (New Space)`));

    // Medium objects (Old Space simulation)
    const mediumObjects = [];
    for (let i = 0; i < 100; i++) {
      mediumObjects.push({
        id: i,
        data: Array.from({ length: 1000 }, (_, j) => `value${j}`),
        metadata: {
          created: Date.now(),
          tags: Array.from({ length: 50 }, (_, j) => `tag${j}`),
        },
      });
    }
    console.log(chalk.blue(`  • Medium objects: ${mediumObjects.length} created (Old Space)`));

    // Large objects (Large Object Space)
    const largeObject = new Array(1000000).fill('x').join('');
    console.log(chalk.red(`  • Large object: ${this.formatBytes(largeObject.length)} (Large Object Space)`));

    const memUsage = process.memoryUsage();
    console.log(chalk.cyan(`\n📊 Current memory: ${this.formatBytes(memUsage.heapUsed)}`));

    // Clean up
    smallObjects.length = 0;
    mediumObjects.length = 0;

    if (global.gc) {
      console.log(chalk.yellow('\n🔄 Running GC to clean up...'));
      global.gc();
      const afterGC = process.memoryUsage();
      const freed = memUsage.heapUsed - afterGC.heapUsed;
      console.log(chalk.green(`✅ Freed: ${this.formatBytes(freed)}`));
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
