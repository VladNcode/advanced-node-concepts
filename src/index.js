#!/usr/bin/env node

import chalk from 'chalk';
import { createInterface } from 'readline';
import { performance } from 'perf_hooks';
import { EventLoopMonitor } from './core/event-loop-monitor.js';
import { MemoryProfiler } from './core/memory-profiler.js';
import { WorkerThreadManager } from './core/worker-thread-manager.js';
import { PerformanceAnalyzer } from './core/performance-analyzer.js';
import { V8InternalsExplorer } from './core/v8-internals-explorer.js';

class NodeJSInternalsLab {
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.eventLoopMonitor = new EventLoopMonitor(this.rl);
    this.memoryProfiler = new MemoryProfiler(this.rl);
    this.workerManager = new WorkerThreadManager(this.rl);
    this.performanceAnalyzer = new PerformanceAnalyzer(this.rl);
    this.v8Explorer = new V8InternalsExplorer(this.rl);
  }

  async start() {
    console.clear();
    this.displayBanner();

    try {
      while (true) {
        await this.showMainMenu();
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error occurred:', error.message));

      // Try to recover gracefully
      try {
        console.log(chalk.yellow('\n🔄 Attempting to recover...'));
        await this.showMainMenu();
      } catch (recoveryError) {
        console.error(chalk.red('\n❌ Recovery failed:', recoveryError.message));
        console.log(chalk.yellow('\n🔄 Restarting application...'));
        await this.start(); // Restart the main loop
      }
    }
  }

  displayBanner() {
    console.log(
      chalk.blue.bold(`
╔══════════════════════════════════════════════════════════════╗
║                     Node.js Internals Lab                    ║
║                                                              ║
║  Master Advanced Node.js Concepts:                           ║
║  • Event Loop & libuv                                        ║
║  • V8 Internals & Garbage Collection                         ║
║  • Worker Threads & Performance                              ║
║  • Memory Management & Profiling                             ║
╚══════════════════════════════════════════════════════════════╝
    `),
    );
  }

  async showMainMenu() {
    console.log(chalk.yellow('\n📚 Available Experiments:'));
    console.log(chalk.cyan('1.  🔄 Event Loop & libuv Experiments'));
    console.log(chalk.cyan('2.  🧠 V8 Internals & Garbage Collection'));
    console.log(chalk.cyan('3.  🧵 Worker Threads & Concurrency'));
    console.log(chalk.cyan('4.  📊 Performance Profiling & Optimization'));
    console.log(chalk.cyan('5.  💾 Memory Management & Leaks'));
    console.log(chalk.cyan('6.  🔍 Interactive Debugging & Inspection'));
    console.log(chalk.cyan('7.  📈 Performance Benchmarks & Stress Testing'));
    console.log(chalk.cyan('8.  🚪 Exit'));

    const choice = await this.question(chalk.green('\n🎯 Select an experiment (1-8): '));

    switch (choice.trim()) {
      case '1':
        await this.eventLoopExperiments();
        break;
      case '2':
        await this.v8InternalsExperiments();
        break;
      case '3':
        await this.workerThreadExperiments();
        break;
      case '4':
        await this.performanceExperiments();
        break;
      case '5':
        await this.memoryExperiments();
        break;
      case '6':
        await this.debuggingExperiments();
        break;
      case '7':
        await this.benchmarkExperiments();
        break;
      case '8':
        console.log(chalk.yellow('\n👋 Thanks for exploring Node.js internals!'));
        process.exit(0);
      default:
        console.log(chalk.red('❌ Invalid choice. Please select 1-9.'));
    }
  }

  async eventLoopExperiments() {
    while (true) {
      console.log(chalk.blue('\n🔄 Event Loop & libuv Experiments'));
      console.log(chalk.cyan('1. Monitor event loop lag'));
      console.log(chalk.cyan('2. Demonstrate blocking operations'));
      console.log(chalk.cyan('3. Show async vs sync performance'));
      console.log(chalk.cyan('4. Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-4): '));

      switch (choice.trim()) {
        case '1':
          await this.eventLoopMonitor.startMonitoring();
          break;
        case '2':
          await this.eventLoopMonitor.demonstrateBlocking();
          break;
        case '3':
          await this.eventLoopMonitor.asyncVsSync();
          break;
        case '4':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async v8InternalsExperiments() {
    while (true) {
      console.log(chalk.blue('\n🧠 V8 Internals & Garbage Collection'));
      console.log(chalk.cyan('1. Explore V8 heap statistics'));
      console.log(chalk.cyan('2. Demonstrate garbage collection'));
      console.log(chalk.cyan('3. Show memory allocation patterns'));
      console.log(chalk.cyan('4. Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-4): '));

      switch (choice.trim()) {
        case '1':
          await this.v8Explorer.showHeapStats();
          break;
        case '2':
          await this.v8Explorer.demonstrateGC();
          break;
        case '3':
          await this.v8Explorer.showMemoryPatterns();
          break;
        case '4':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async workerThreadExperiments() {
    while (true) {
      console.log(chalk.blue('\n🧵 Worker Threads & Concurrency'));
      console.log(chalk.cyan('1. CPU-intensive task with workers'));
      console.log(chalk.cyan('2. Shared memory demonstration'));
      console.log(chalk.cyan('3. Worker pool management'));
      console.log(chalk.cyan('4. Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-4): '));

      switch (choice.trim()) {
        case '1':
          await this.workerManager.cpuIntensiveTask();
          break;
        case '2':
          await this.workerManager.sharedMemoryDemo();
          break;
        case '3':
          await this.workerManager.workerPoolTask();
          break;
        case '4':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async performanceExperiments() {
    while (true) {
      console.log(chalk.blue('\n📊 Performance Profiling & Optimization'));
      console.log(chalk.cyan('1. CPU profiling'));
      console.log(chalk.cyan('2. Memory profiling'));
      console.log(chalk.cyan('3. Flamegraph generation'));
      console.log(chalk.cyan('4. Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-4): '));

      switch (choice.trim()) {
        case '1':
          await this.performanceAnalyzer.cpuProfile();
          break;
        case '2':
          await this.performanceAnalyzer.memoryProfile();
          break;
        case '3':
          await this.performanceAnalyzer.generateFlamegraph();
          break;
        case '4':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async memoryExperiments() {
    while (true) {
      console.log(chalk.blue('\n💾 Memory Management & Leaks'));
      console.log(chalk.cyan('1. Memory leak demonstration'));
      console.log(chalk.cyan('2. Memory usage monitoring'));
      console.log(chalk.cyan('3. Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-3): '));

      switch (choice.trim()) {
        case '1':
          await this.memoryProfiler.demonstrateLeak();
          break;
        case '2':
          await this.memoryProfiler.monitorUsage();
          break;
        case '3':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async debuggingExperiments() {
    while (true) {
      console.log(chalk.blue('\n🔍 Interactive Debugging & Inspection'));
      console.log(chalk.cyan('1. Start debugging server'));
      console.log(chalk.cyan('2. Show process information'));
      console.log(chalk.cyan('3. Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-3): '));

      switch (choice.trim()) {
        case '1':
          await this.startDebugServer();
          break;
        case '2':
          await this.showProcessInfo();
          break;
        case '3':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async benchmarkExperiments() {
    while (true) {
      console.log(chalk.blue('\n📈 Performance Benchmarks & Stress Testing'));
      console.log(chalk.cyan('1. 🏃‍♂️ Run comprehensive performance benchmarks'));
      console.log(chalk.cyan('2. 🔥 Stress test with high CPU/memory load'));
      console.log(chalk.cyan('3. 🔙 Back to main menu'));

      const choice = await this.question(chalk.green('\nSelect experiment (1-3): '));

      switch (choice.trim()) {
        case '1':
          await this.runBenchmarks();
          break;
        case '2':
          await this.stressTest();
          break;
        case '3':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }
    }
  }

  async startDebugServer() {
    console.log(chalk.blue('\n🔍 Starting Debug Server...'));
    console.log(chalk.yellow('Debug server will be available at: http://localhost:9229'));
    console.log(chalk.yellow('Use Chrome DevTools or VS Code to connect'));

    // In a real implementation, you'd start the debug server
    console.log(chalk.green('✅ Debug server started (simulated)'));
    console.log(chalk.cyan('Press Enter to continue...'));
    await this.question('');
  }

  async showProcessInfo() {
    console.log(chalk.blue('\n📊 Process Information:'));
    console.log(chalk.cyan(`Node.js version: ${process.version}`));
    console.log(chalk.cyan(`Platform: ${process.platform}`));
    console.log(chalk.cyan(`Architecture: ${process.arch}`));
    console.log(chalk.cyan(`PID: ${process.pid}`));
    console.log(chalk.cyan(`Memory usage: ${JSON.stringify(process.memoryUsage(), null, 2)}`));
    console.log(chalk.cyan('Press Enter to continue...'));
    await this.question('');
  }

  async runBenchmarks() {
    console.log(chalk.blue('\n📈 Running Performance Benchmarks...'));
    console.log(
      chalk.yellow('This will run comprehensive benchmarks for arrays, strings, objects, and async operations.\n'),
    );

    try {
      // Import and run the benchmarks
      const { runAllBenchmarks } = await import('./benchmarks/index.js');
      await runAllBenchmarks();

      console.log(chalk.green('\n✅ All benchmarks completed successfully!'));
      console.log(chalk.cyan('Press Enter to continue...'));
      await this.question('');
    } catch (error) {
      console.error(chalk.red(`❌ Benchmark error: ${error.message}`));
      console.log(chalk.yellow('Press Enter to continue...'));
      await this.question('');
    }
  }

  async stressTest() {
    console.log(chalk.blue('\n🔥 Running Stress Test...'));
    console.log(chalk.yellow('This will test system performance under high load.\n'));

    try {
      const startTime = performance.now();

      // Simulate high CPU load
      console.log(chalk.cyan('🔄 Simulating high CPU load...'));
      let result = 0;
      for (let i = 0; i < 10000000; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      }

      // Simulate memory pressure
      console.log(chalk.cyan('🔄 Simulating memory pressure...'));
      const largeArrays = [];
      for (let i = 0; i < 100; i++) {
        largeArrays.push(new Array(10000).fill(i));
      }

      // Simulate event loop blocking
      console.log(chalk.cyan('🔄 Simulating event loop blocking...'));
      const blockingStart = performance.now();
      while (performance.now() - blockingStart < 1000) {
        // Block for 1 second
      }

      const totalTime = performance.now() - startTime;

      console.log(chalk.green(`\n✅ Stress test completed in ${totalTime.toFixed(2)}ms`));
      console.log(chalk.cyan(`📊 Final result: ${result.toFixed(2)}`));
      console.log(chalk.cyan(`📊 Memory usage: ${JSON.stringify(process.memoryUsage(), null, 2)}`));

      // Clean up
      largeArrays.length = 0;

      console.log(chalk.yellow('\nPress Enter to continue...'));
      await this.question('');
    } catch (error) {
      console.error(chalk.red(`❌ Stress test error: ${error.message}`));
      console.log(chalk.yellow('Press Enter to continue...'));
      await this.question('');
    }
  }

  question(prompt) {
    return new Promise((resolve, reject) => {
      try {
        if (this.rl && !this.rl.closed) {
          this.rl.question(prompt, resolve);
        } else {
          reject(new Error('Readline interface is closed'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

// Start the application
const lab = new NodeJSInternalsLab();
lab.start().catch(console.error);
