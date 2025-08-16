import chalk from 'chalk';
import { performance } from 'perf_hooks';

export class PerformanceAnalyzer {
  constructor(rl) {
    this.rl = rl;
    this.profiles = [];
    this.benchmarks = [];
  }

  async cpuProfile() {
    while (true) {
      console.log(chalk.blue('\n📊 CPU Profiling'));
      console.log(chalk.yellow('This will demonstrate CPU profiling techniques and analysis'));

      const choice = await this.question(
        chalk.green(
          '\nSelect profiling method:\n1. Built-in profiler\n2. Custom performance measurement\n3. Function-level profiling\n4. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.builtInProfiler();
          break;
        case '2':
          await this.customPerformanceMeasurement();
          break;
        case '3':
          await this.functionLevelProfiling();
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

  async builtInProfiler() {
    console.log(chalk.blue('\n🔧 Built-in Node.js Profiler'));
    console.log(chalk.yellow('This demonstrates Node.js built-in profiling capabilities'));

    console.log(chalk.cyan('\n📋 Available profiling methods:'));
    console.log(chalk.gray('• --prof: V8 profiler output'));
    console.log(chalk.gray('• --prof-process: Process profiler output'));
    console.log(chalk.gray('• --inspect: Chrome DevTools profiler'));
    console.log(chalk.gray('• --trace-gc: Garbage collection tracing'));

    console.log(chalk.yellow('\n💡 To use built-in profiler:'));
    console.log(chalk.gray('  node --prof src/experiments/performance-test.js'));
    console.log(chalk.gray('  node --prof-process isolate-*.log > profile.txt'));

    // Simulate some profiling data
    console.log(chalk.cyan('\n📊 Simulated Profile Data:'));
    this.displaySimulatedProfile();
  }

  displaySimulatedProfile() {
    const profileData = [
      { function: 'processRequest', time: 45.2, calls: 1250, percentage: 23.4 },
      { function: 'databaseQuery', time: 38.7, calls: 890, percentage: 19.8 },
      { function: 'jsonParse', time: 25.1, calls: 2100, percentage: 12.9 },
      { function: 'httpResponse', time: 18.3, calls: 1250, percentage: 9.4 },
      { function: 'validation', time: 15.8, calls: 1250, percentage: 8.1 },
      { function: 'other', time: 52.1, calls: 0, percentage: 26.4 },
    ];

    console.log(chalk.cyan('Function Profile (Top 5):'));
    console.log(chalk.gray('═'.repeat(80)));
    console.log(chalk.gray('Function'.padEnd(20) + 'Time(ms)'.padEnd(12) + 'Calls'.padEnd(10) + 'Percentage'));
    console.log(chalk.gray('═'.repeat(80)));

    profileData.forEach((item, index) => {
      const color = index < 3 ? chalk.yellow : chalk.gray;
      console.log(
        color(
          item.function.padEnd(20) +
            item.time.toFixed(1).padEnd(12) +
            item.calls.toString().padEnd(10) +
            item.percentage.toFixed(1) +
            '%',
        ),
      );
    });

    console.log(chalk.gray('═'.repeat(80)));
    const totalTime = profileData.reduce((sum, item) => sum + item.time, 0);
    console.log(chalk.cyan(`Total Profile Time: ${totalTime.toFixed(1)}ms`));
  }

  async customPerformanceMeasurement() {
    while (true) {
      console.log(chalk.blue('\n⏱️  Custom Performance Measurement'));
      console.log(chalk.yellow('This demonstrates custom performance measurement techniques'));

      const choice = await this.question(
        chalk.green(
          '\nSelect measurement type:\n1. Function timing\n2. Memory usage tracking\n3. Event loop monitoring\n4. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.functionTiming();
          break;
        case '2':
          await this.memoryUsageTracking();
          break;
        case '3':
          await this.eventLoopMonitoring();
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

  async functionTiming() {
    console.log(chalk.blue('\n⏱️  Function Timing Analysis'));

    const iterations = 100000; // Reduced from 1M to 100K for better performance
    console.log(chalk.yellow(`\n🔄 Running ${iterations.toLocaleString()} iterations for each function...`));

    // Define test functions inline to avoid undefined function errors
    const arrayPushTest = iterations => {
      const arr = new Array(iterations); // Pre-allocate array for better performance
      for (let i = 0; i < iterations; i++) {
        arr[i] = i; // Direct assignment instead of push
      }
      return arr.length;
    };

    const arrayConcatTest = iterations => {
      let arr = [];
      for (let i = 0; i < iterations; i++) {
        arr = arr.concat([i]);
        if (i % 10000 === 0) {
          // Progress feedback every 10K iterations
          process.stdout.write('.');
        }
      }
      return arr.length;
    };

    const stringConcatTest = iterations => {
      let str = '';
      for (let i = 0; i < iterations; i++) {
        str += i.toString();
      }
      return str.length;
    };

    const templateLiteralTest = iterations => {
      let str = '';
      for (let i = 0; i < iterations; i++) {
        str += `${i}`;
      }
      return str.length;
    };

    const objectSpreadTest = iterations => {
      let obj = {};
      for (let i = 0; i < iterations; i++) {
        obj = { ...obj, [`key${i}`]: i };
        if (i % 1000 === 0) {
          // Progress feedback every 1K iterations
          process.stdout.write('.');
        }
        if (i > 10000) {
          // Limit to 10K iterations to prevent hanging
          console.log(chalk.yellow(`\n⚠️  Object spread limited to 10K iterations for performance`));
          break;
        }
      }
      return Object.keys(obj).length;
    };

    const objectAssignTest = iterations => {
      let obj = {};
      for (let i = 0; i < iterations; i++) {
        obj = Object.assign({}, obj, { [`key${i}`]: i });
        if (i % 1000 === 0) {
          // Progress feedback every 1K iterations
          process.stdout.write('.');
        }
        if (i > 10000) {
          // Limit to 10K iterations to prevent hanging
          console.log(chalk.yellow(`\n⚠️  Object.assign limited to 10K iterations for performance`));
          break;
        }
      }
      return Object.keys(obj).length;
    };

    // Add a fast alternative for comparison
    const directPropertyTest = iterations => {
      const obj = {};
      for (let i = 0; i < iterations; i++) {
        obj[`key${i}`] = i; // Direct property assignment - much faster!
      }
      return Object.keys(obj).length;
    };

    // Test different function implementations
    const functions = [
      { name: 'Array.push()', fn: () => arrayPushTest(iterations) },
      { name: 'Array.concat()', fn: () => arrayConcatTest(iterations) },
      { name: 'String concatenation', fn: () => stringConcatTest(iterations) },
      { name: 'Template literals', fn: () => templateLiteralTest(iterations) },
      { name: 'Object spread', fn: () => objectSpreadTest(iterations) },
      { name: 'Object.assign()', fn: () => objectAssignTest(iterations) },
      { name: 'Direct property', fn: () => directPropertyTest(iterations) },
    ];

    const results = [];

    for (const func of functions) {
      console.log(chalk.yellow(`  🔄 Testing ${func.name}...`));

      try {
        const start = performance.now();

        // Add timeout protection (30 seconds max)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Function timed out after 30 seconds')), 30000);
        });

        const resultPromise = Promise.resolve(func.fn());
        const result = await Promise.race([resultPromise, timeoutPromise]);

        const duration = performance.now() - start;

        results.push({
          name: func.name,
          duration: duration,
          result: result,
        });

        console.log(chalk.green(`  ✅ ${func.name}: ${duration.toFixed(2)}ms`));
      } catch (error) {
        console.log(chalk.red(`  ❌ ${func.name}: Error - ${error.message}`));
        results.push({
          name: func.name,
          duration: Infinity,
          result: 'Error',
        });
      }
    }

    // Sort by performance
    results.sort((a, b) => a.duration - b.duration);

    console.log(chalk.yellow('\n📊 Performance Ranking:'));
    results.forEach((result, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      const color = index < 3 ? chalk.green : chalk.gray;
      console.log(color(`${medal} ${result.name}: ${result.duration.toFixed(2)}ms`));
    });

    // Performance analysis
    const fastest = results[0];
    const slowest = results[results.length - 1];
    const speedup = slowest.duration / fastest.duration;

    console.log(chalk.cyan('\n📈 Analysis:'));
    console.log(chalk.gray(`  • Fastest: ${fastest.name} (${fastest.duration.toFixed(2)}ms)`));
    console.log(chalk.gray(`  • Slowest: ${slowest.name} (${slowest.duration.toFixed(2)}ms)`));
    console.log(chalk.blue(`  • Speed difference: ${speedup.toFixed(2)}x`));
  }

  async memoryUsageTracking() {
    console.log(chalk.blue('\n💾 Memory Usage Tracking'));
    console.log(chalk.yellow('This demonstrates memory usage monitoring and analysis'));

    const iterations = 100000;
    console.log(chalk.yellow(`\n🔄 Creating ${iterations.toLocaleString()} objects and tracking memory...`));

    const memorySnapshots = [];

    // Take initial snapshot
    memorySnapshots.push({
      phase: 'Initial',
      memory: process.memoryUsage(),
      timestamp: performance.now(),
    });

    // Create objects in batches
    const batchSize = 10000;
    const objects = [];

    for (let i = 0; i < iterations; i += batchSize) {
      const batch = [];
      for (let j = 0; j < batchSize && i + j < iterations; j++) {
        batch.push({
          id: i + j,
          data: `Object ${i + j}`,
          metadata: Array.from({ length: 10 }, (_, k) => `prop${k}`),
          timestamp: Date.now(),
        });
      }
      objects.push(...batch);

      // Take snapshot every 5 batches
      if ((i / batchSize) % 5 === 0) {
        memorySnapshots.push({
          phase: `Batch ${Math.floor(i / batchSize)}`,
          memory: process.memoryUsage(),
          timestamp: performance.now(),
        });
      }
    }

    // Final snapshot
    memorySnapshots.push({
      phase: 'Final',
      memory: process.memoryUsage(),
      timestamp: performance.now(),
    });

    // Display memory analysis
    console.log(chalk.cyan('\n📊 Memory Usage Analysis:'));
    console.log(chalk.gray('═'.repeat(80)));
    console.log(
      chalk.gray('Phase'.padEnd(15) + 'Heap Used'.padEnd(15) + 'Heap Total'.padEnd(15) + 'External'.padEnd(15)),
    );
    console.log(chalk.gray('═'.repeat(80)));

    memorySnapshots.forEach((snapshot, index) => {
      const color = index === 0 ? chalk.green : index === memorySnapshots.length - 1 ? chalk.red : chalk.gray;
      console.log(
        color(
          snapshot.phase.padEnd(15) +
            this.formatBytes(snapshot.memory.heapUsed).padEnd(15) +
            this.formatBytes(snapshot.memory.heapTotal).padEnd(15) +
            this.formatBytes(snapshot.memory.external).padEnd(15),
        ),
      );
    });

    console.log(chalk.gray('═'.repeat(80)));

    // Calculate memory growth
    const initial = memorySnapshots[0].memory.heapUsed;
    const final = memorySnapshots[memorySnapshots.length - 1].memory.heapUsed;
    const growth = final - initial;

    console.log(chalk.yellow('\n📈 Memory Growth:'));
    console.log(chalk.gray(`  • Initial: ${this.formatBytes(initial)}`));
    console.log(chalk.gray(`  • Final: ${this.formatBytes(final)}`));
    console.log(chalk.blue(`  • Growth: ${this.formatBytes(growth)}`));
    console.log(chalk.blue(`  • Growth rate: ${((growth / initial) * 100).toFixed(2)}%`));

    // Clean up
    objects.length = 0;
    if (global.gc) {
      console.log(chalk.yellow('\n🔄 Running garbage collection...'));
      global.gc();
      const afterGC = process.memoryUsage();
      const freed = final - afterGC.heapUsed;
      console.log(chalk.green(`✅ Freed: ${this.formatBytes(freed)}`));
    }
  }

  async eventLoopMonitoring() {
    console.log(chalk.blue('\n🔄 Event Loop Monitoring'));
    console.log(chalk.yellow('This demonstrates event loop performance monitoring'));

    const duration = 5000; // 5 seconds
    console.log(chalk.yellow(`\n🔄 Monitoring event loop for ${duration / 1000} seconds...`));

    const measurements = [];
    const startTime = performance.now();

    // Monitor event loop lag
    const monitor = setInterval(() => {
      const now = performance.now();
      const expectedTime = startTime + measurements.length * 16; // 16ms intervals
      const actualLag = now - expectedTime;

      measurements.push(actualLag);
    }, 16);

    // Wait for monitoring to complete
    await new Promise(resolve => setTimeout(resolve, duration));
    clearInterval(monitor);

    // Analyze results
    const avgLag = measurements.reduce((sum, lag) => sum + lag, 0) / measurements.length;
    const maxLag = Math.max(...measurements);
    const minLag = Math.min(...measurements);
    const lagOver16ms = measurements.filter(lag => lag > 16).length;
    const lagPercentage = (lagOver16ms / measurements.length) * 100;

    console.log(chalk.cyan('\n📊 Event Loop Performance:'));
    console.log(chalk.gray(`  • Total measurements: ${measurements.length}`));
    console.log(chalk.gray(`  • Average lag: ${avgLag.toFixed(2)}ms`));
    console.log(chalk.gray(`  • Maximum lag: ${maxLag.toFixed(2)}ms`));
    console.log(chalk.gray(`  • Minimum lag: ${minLag.toFixed(2)}ms`));
    console.log(chalk.gray(`  • Lag > 16ms: ${lagOver16ms} (${lagPercentage.toFixed(2)}%)`));

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
  }

  async functionLevelProfiling() {
    console.log(chalk.blue('\n🔍 Function-Level Profiling'));
    console.log(chalk.yellow('This demonstrates detailed function performance analysis'));

    // Create a complex function to profile
    const complexFunction = this.createComplexFunction();

    console.log(chalk.yellow('\n🔄 Profiling complex function execution...'));

    const iterations = 1000;
    const measurements = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const result = complexFunction(i);
      const duration = performance.now() - start;

      measurements.push({
        iteration: i,
        duration: duration,
        result: result,
      });
    }

    // Analyze performance
    const durations = measurements.map(m => m.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const stdDev = this.calculateStandardDeviation(durations);

    console.log(chalk.cyan('\n📊 Function Performance Statistics:'));
    console.log(chalk.gray(`  • Iterations: ${iterations}`));
    console.log(chalk.gray(`  • Average time: ${avgDuration.toFixed(4)}ms`));
    console.log(chalk.gray(`  • Minimum time: ${minDuration.toFixed(4)}ms`));
    console.log(chalk.gray(`  • Maximum time: ${maxDuration.toFixed(4)}ms`));
    console.log(chalk.gray(`  • Standard deviation: ${stdDev.toFixed(4)}ms`));

    // Performance distribution
    const buckets = this.createPerformanceBuckets(durations);
    console.log(chalk.yellow('\n📈 Performance Distribution:'));
    buckets.forEach((bucket, index) => {
      const percentage = (bucket.count / durations.length) * 100;
      const bar = '█'.repeat(Math.floor(percentage / 2));
      console.log(chalk.gray(`${bucket.range.padEnd(15)} ${bar} ${percentage.toFixed(1)}%`));
    });

    // Identify outliers
    const outlierThreshold = avgDuration + 2 * stdDev;
    const outliers = durations.filter(d => d > outlierThreshold);

    if (outliers.length > 0) {
      console.log(chalk.yellow('\n⚠️  Performance Outliers:'));
      console.log(
        chalk.gray(
          `  • Outliers detected: ${outliers.length} (${((outliers.length / durations.length) * 100).toFixed(2)}%)`,
        ),
      );
      console.log(chalk.gray(`  • Threshold: ${outlierThreshold.toFixed(4)}ms`));
      console.log(chalk.gray(`  • Max outlier: ${Math.max(...outliers).toFixed(4)}ms`));
    }
  }

  async memoryProfile() {
    while (true) {
      console.log(chalk.blue('\n💾 Memory Profiling'));
      console.log(chalk.yellow('This demonstrates memory profiling and leak detection'));

      const choice = await this.question(
        chalk.green(
          '\nSelect profiling method:\n1. Heap snapshot analysis\n2. Memory leak detection\n3. Allocation tracking\n4. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.heapSnapshotAnalysis();
          break;
        case '2':
          await this.memoryLeakDetection();
          break;
        case '3':
          await this.allocationTracking();
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

  async heapSnapshotAnalysis() {
    console.log(chalk.blue('\n📸 Heap Snapshot Analysis'));
    console.log(chalk.yellow('This demonstrates heap snapshot analysis for memory profiling'));

    console.log(chalk.cyan('\n📋 Heap Snapshot Methods:'));
    console.log(chalk.gray('• V8 heap profiler: --inspect --inspect-brk'));
    console.log(chalk.gray('• Chrome DevTools: Memory tab'));
    console.log(chalk.gray('• Node.js heapdump: require("heapdump")'));
    console.log(chalk.gray('• Clinic.js heap: clinic heap -- node app.js'));

    // Simulate heap snapshot data
    console.log(chalk.cyan('\n📊 Simulated Heap Snapshot Data:'));
    this.displaySimulatedHeapSnapshot();
  }

  displaySimulatedHeapSnapshot() {
    console.log(chalk.cyan('Heap Snapshot Summary:'));
    console.log(chalk.gray('═'.repeat(80)));
    console.log(chalk.gray('Object Type'.padEnd(25) + 'Count'.padEnd(15) + 'Size'.padEnd(15) + 'Retainers'));
    console.log(chalk.gray('═'.repeat(80)));

    const heapData = [
      { type: 'String', count: 15420, size: '2.3 MB', retainers: 8 },
      { type: 'Array', count: 8920, size: '1.8 MB', retainers: 12 },
      { type: 'Object', count: 6540, size: '1.2 MB', retainers: 15 },
      { type: 'Function', count: 1230, size: '456 KB', retainers: 3 },
      { type: 'RegExp', count: 890, size: '234 KB', retainers: 5 },
      { type: 'Date', count: 456, size: '123 KB', retainers: 2 },
      { type: 'Error', count: 234, size: '89 KB', retainers: 1 },
    ];

    heapData.forEach((item, index) => {
      const color = index < 3 ? chalk.yellow : chalk.gray;
      console.log(
        color(
          item.type.padEnd(25) +
            item.count.toLocaleString().padEnd(15) +
            item.size.padEnd(15) +
            item.retainers.toString(),
        ),
      );
    });

    console.log(chalk.gray('═'.repeat(80)));

    const totalObjects = heapData.reduce((sum, item) => sum + item.count, 0);
    const totalSize = '6.2 MB';

    console.log(chalk.cyan(`Total Objects: ${totalObjects.toLocaleString()}`));
    console.log(chalk.cyan(`Total Size: ${totalSize}`));

    // Memory distribution chart
    console.log(chalk.yellow('\n📊 Memory Distribution:'));

    // Helper function to convert size strings to bytes
    const parseSize = sizeStr => {
      const match = sizeStr.match(/^([\d.]+)\s*(KB|MB|GB)$/);
      if (!match) return 0;

      const value = parseFloat(match[1]);
      const unit = match[2];

      switch (unit) {
        case 'KB':
          return value * 1024;
        case 'MB':
          return value * 1024 * 1024;
        case 'GB':
          return value * 1024 * 1024 * 1024;
        default:
          return value;
      }
    };

    const totalSizeBytes = parseSize(totalSize);

    heapData.forEach(item => {
      const sizeInBytes = parseSize(item.size);
      const percentage = totalSizeBytes > 0 ? (sizeInBytes / totalSizeBytes) * 100 : 0;
      const barLength = Math.floor((percentage / 100) * 30);
      const bar = '█'.repeat(barLength);
      console.log(chalk.gray(`${item.type.padEnd(15)} ${bar} ${percentage.toFixed(1)}%`));
    });
  }

  async memoryLeakDetection() {
    console.log(chalk.blue('\n🔍 Memory Leak Detection'));
    console.log(chalk.yellow('This demonstrates memory leak detection techniques'));

    console.log(chalk.cyan('\n📋 Leak Detection Methods:'));
    console.log(chalk.gray('• Memory usage monitoring over time'));
    console.log(chalk.gray('• Heap snapshot comparison'));
    console.log(chalk.gray('• Reference counting analysis'));
    console.log(chalk.gray('• Garbage collection monitoring'));

    // Simulate leak detection
    console.log(chalk.yellow('\n🔄 Simulating memory leak detection...'));

    const memorySnapshots = [];
    const testObjects = [];

    // Take initial snapshot
    memorySnapshots.push({
      phase: 'Initial',
      heapUsed: process.memoryUsage().heapUsed,
      objectCount: 0,
    });

    // Simulate object creation (potential leak)
    for (let i = 0; i < 5; i++) {
      // Create objects that might not be properly cleaned up
      for (let j = 0; j < 10000; j++) {
        testObjects.push({
          id: `${i}-${j}`,
          data: new Array(100).fill(`data-${i}-${j}`),
          timestamp: Date.now(),
        });
      }

      // Take snapshot
      memorySnapshots.push({
        phase: `Phase ${i + 1}`,
        heapUsed: process.memoryUsage().heapUsed,
        objectCount: testObjects.length,
      });

      // Simulate some cleanup (but not all)
      if (i % 2 === 0) {
        testObjects.splice(0, 1000);
      }
    }

    // Display leak analysis
    console.log(chalk.cyan('\n📊 Memory Leak Analysis:'));
    console.log(chalk.gray('═'.repeat(60)));
    console.log(chalk.gray('Phase'.padEnd(15) + 'Heap Used'.padEnd(20) + 'Objects'.padEnd(15)));
    console.log(chalk.gray('═'.repeat(60)));

    memorySnapshots.forEach((snapshot, index) => {
      const color = index === 0 ? chalk.green : chalk.gray;
      console.log(
        color(
          snapshot.phase.padEnd(15) +
            this.formatBytes(snapshot.heapUsed).padEnd(20) +
            snapshot.objectCount.toString().padEnd(15),
        ),
      );
    });

    console.log(chalk.gray('═'.repeat(60)));

    // Analyze for potential leaks
    const initialMemory = memorySnapshots[0].heapUsed;
    const finalMemory = memorySnapshots[memorySnapshots.length - 1].heapUsed;
    const memoryGrowth = finalMemory - initialMemory;
    const growthPercentage = (memoryGrowth / initialMemory) * 100;

    console.log(chalk.yellow('\n📈 Leak Detection Results:'));
    console.log(chalk.gray(`  • Memory growth: ${this.formatBytes(memoryGrowth)}`));
    console.log(chalk.gray(`  • Growth percentage: ${growthPercentage.toFixed(2)}%`));

    if (growthPercentage > 50) {
      console.log(chalk.red('  • ⚠️  Potential memory leak detected!'));
      console.log(chalk.red('  • High memory growth suggests objects not being cleaned up'));
    } else if (growthPercentage > 20) {
      console.log(chalk.yellow('  • ⚠️  Moderate memory growth - monitor closely'));
    } else {
      console.log(chalk.green('  • ✅ Memory usage appears stable'));
    }

    // Clean up test objects
    testObjects.length = 0;
    if (global.gc) {
      global.gc();
      const afterGC = process.memoryUsage().heapUsed;
      const freed = finalMemory - afterGC;
      console.log(chalk.green(`  • Memory freed after GC: ${this.formatBytes(freed)}`));
    }
  }

  async allocationTracking() {
    console.log(chalk.blue('\n📊 Allocation Tracking'));
    console.log(chalk.yellow('This demonstrates memory allocation tracking and analysis'));

    console.log(chalk.cyan('\n📋 Allocation Tracking Methods:'));
    console.log(chalk.gray('• V8 allocation profiler: --prof-process'));
    console.log(chalk.gray('• Custom allocation hooks'));
    console.log(chalk.gray('• Memory usage sampling'));
    console.log(chalk.gray('• Allocation pattern analysis'));

    // Simulate allocation tracking
    console.log(chalk.yellow('\n🔄 Simulating allocation tracking...'));

    const allocationPatterns = [];
    const startMemory = process.memoryUsage().heapUsed;

    // Simulate different allocation patterns
    const patterns = [
      { name: 'Small objects', size: 100, count: 1000 },
      { name: 'Medium objects', size: 1000, count: 100 },
      { name: 'Large objects', size: 10000, count: 10 },
      { name: 'Arrays', size: 5000, count: 50 },
      { name: 'Strings', size: 2000, count: 200 },
    ];

    for (const pattern of patterns) {
      const beforeMemory = process.memoryUsage().heapUsed;

      // Simulate allocations
      const objects = [];
      for (let i = 0; i < pattern.count; i++) {
        if (pattern.name === 'Arrays') {
          objects.push(new Array(pattern.size).fill(i));
        } else if (pattern.name === 'Strings') {
          objects.push('x'.repeat(pattern.size));
        } else {
          objects.push(new Array(pattern.size).fill(i));
        }
      }

      const afterMemory = process.memoryUsage().heapUsed;
      const allocated = afterMemory - beforeMemory;

      allocationPatterns.push({
        name: pattern.name,
        count: pattern.count,
        totalSize: pattern.size * pattern.count,
        actualAllocated: allocated,
        efficiency: ((pattern.size * pattern.count) / allocated) * 100,
      });

      // Clean up to prevent memory buildup
      objects.length = 0;
    }

    // Display allocation analysis
    console.log(chalk.cyan('\n📊 Allocation Pattern Analysis:'));
    console.log(chalk.gray('═'.repeat(90)));
    console.log(
      chalk.gray(
        'Pattern'.padEnd(20) +
          'Count'.padEnd(10) +
          'Expected'.padEnd(15) +
          'Actual'.padEnd(15) +
          'Efficiency'.padEnd(15),
      ),
    );
    console.log(chalk.gray('═'.repeat(90)));

    allocationPatterns.forEach((pattern, index) => {
      const color = pattern.efficiency > 80 ? chalk.green : pattern.efficiency > 60 ? chalk.yellow : chalk.red;
      console.log(
        color(
          pattern.name.padEnd(20) +
            pattern.count.toString().padEnd(10) +
            this.formatBytes(pattern.totalSize).padEnd(15) +
            this.formatBytes(pattern.actualAllocated).padEnd(15) +
            pattern.efficiency.toFixed(1) +
            '%'.padEnd(15),
        ),
      );
    });

    console.log(chalk.gray('═'.repeat(90)));

    // Overall allocation summary
    const totalExpected = allocationPatterns.reduce((sum, p) => sum + p.totalSize, 0);
    const totalActual = allocationPatterns.reduce((sum, p) => sum + p.actualAllocated, 0);
    const overallEfficiency = (totalExpected / totalActual) * 100;
    const finalMemory = process.memoryUsage().heapUsed;
    const totalAllocated = finalMemory - startMemory;

    console.log(chalk.yellow('\n📈 Overall Allocation Summary:'));
    console.log(chalk.gray(`  • Total expected: ${this.formatBytes(totalExpected)}`));
    console.log(chalk.gray(`  • Total actual: ${this.formatBytes(totalActual)}`));
    console.log(chalk.gray(`  • Overall efficiency: ${overallEfficiency.toFixed(1)}%`));
    console.log(chalk.gray(`  • Total memory change: ${this.formatBytes(totalAllocated)}`));

    // Performance insights
    console.log(chalk.cyan('\n💡 Allocation Insights:'));
    const mostEfficient = allocationPatterns.reduce((best, current) =>
      current.efficiency > best.efficiency ? current : best,
    );
    const leastEfficient = allocationPatterns.reduce((worst, current) =>
      current.efficiency < worst.efficiency ? current : worst,
    );

    console.log(chalk.green(`  • Most efficient: ${mostEfficient.name} (${mostEfficient.efficiency.toFixed(1)}%)`));
    console.log(chalk.red(`  • Least efficient: ${leastEfficient.name} (${leastEfficient.efficiency.toFixed(1)}%)`));

    if (overallEfficiency < 70) {
      console.log(chalk.yellow('  • ⚠️  Consider optimizing allocation patterns'));
    }
  }

  displaySimulatedFlamegraph() {
    console.log(chalk.cyan('Flamegraph Call Stack:'));
    console.log(chalk.gray('═'.repeat(80)));

    const flamegraphData = [
      { function: 'main()', time: 100, depth: 0, calls: 1 },
      { function: '  processRequest()', time: 85, depth: 1, calls: 1250 },
      { function: '    validateInput()', time: 15, depth: 2, calls: 1250 },
      { function: '    databaseQuery()', time: 45, depth: 2, calls: 890 },
      { function: '      executeSQL()', time: 35, depth: 3, calls: 890 },
      { function: '      parseResults()', time: 10, depth: 3, calls: 890 },
      { function: '    processData()', time: 20, depth: 2, calls: 1250 },
      { function: '      transformData()', time: 12, depth: 3, calls: 1250 },
      { function: '      formatResponse()', time: 8, depth: 3, calls: 1250 },
      { function: '  backgroundTasks()', time: 15, depth: 1, calls: 50 },
    ];

    flamegraphData.forEach((item, index) => {
      const indent = '  '.repeat(item.depth);
      const barLength = Math.floor((item.time / 100) * 40);
      const bar = '█'.repeat(barLength);
      const color =
        item.depth === 0 ? chalk.blue : item.depth === 1 ? chalk.yellow : item.depth === 2 ? chalk.green : chalk.gray;

      console.log(color(`${indent}${item.function.padEnd(30)} ${bar} ${item.time}ms (${item.calls} calls)`));
    });

    console.log(chalk.gray('═'.repeat(80)));

    const totalTime = flamegraphData.reduce((sum, item) => sum + item.time, 0);
    const totalCalls = flamegraphData.reduce((sum, item) => sum + item.calls, 0);

    console.log(chalk.cyan(`Total Time: ${totalTime}ms`));
    console.log(chalk.cyan(`Total Calls: ${totalCalls.toLocaleString()}`));

    // Performance hotspots
    console.log(chalk.yellow('\n🔥 Performance Hotspots:'));
    const hotspots = flamegraphData.filter(item => item.time > 20).sort((a, b) => b.time - a.time);

    hotspots.forEach((hotspot, index) => {
      const percentage = ((hotspot.time / totalTime) * 100).toFixed(1);
      console.log(chalk.red(`  • ${hotspot.function}: ${hotspot.time}ms (${percentage}%)`));
    });
  }

  async generateFlamegraph() {
    console.log(chalk.blue('\n🔥 Flamegraph Generation'));
    console.log(chalk.yellow('This demonstrates flamegraph generation for performance analysis'));

    console.log(chalk.cyan('\n📋 Flamegraph Generation Methods:'));
    console.log(chalk.gray('• Clinic.js flamegraph: clinic flamegraph -- node app.js'));
    console.log(chalk.gray('• 0x: 0x app.js'));
    console.log(chalk.gray('• V8 profiler: --prof + --prof-process'));

    // Simulate flamegraph data
    console.log(chalk.cyan('\n📊 Simulated Flamegraph Data:'));
    this.displaySimulatedFlamegraph();
  }

  // Helper functions
  createComplexFunction() {
    return function complexFunction(input) {
      let result = 0;

      // Simulate complex computation
      for (let i = 0; i < 1000; i++) {
        result += Math.sqrt(input + i) * Math.sin(i) + Math.cos(input - i);

        // Add some conditional complexity
        if (i % 100 === 0) {
          result += Math.random() * 10;
        }

        // Simulate memory allocation
        if (i % 200 === 0) {
          const temp = new Array(100).fill(i);
          result += temp.reduce((sum, val) => sum + val, 0);
        }
      }

      return result;
    };
  }

  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    return Math.sqrt(avgSquaredDiff);
  }

  createPerformanceBuckets(durations) {
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    const bucketCount = 10;
    const bucketSize = (max - min) / bucketCount;

    const buckets = Array.from({ length: bucketCount }, (_, i) => ({
      range: `${(min + i * bucketSize).toFixed(4)}-${(min + (i + 1) * bucketSize).toFixed(4)}`,
      count: 0,
    }));

    durations.forEach(duration => {
      const bucketIndex = Math.min(Math.floor((duration - min) / bucketSize), bucketCount - 1);
      buckets[bucketIndex].count++;
    });

    return buckets;
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
