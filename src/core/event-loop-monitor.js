import chalk from 'chalk';
import { performance } from 'perf_hooks';
import fs from 'fs';

export class EventLoopMonitor {
  constructor(rl) {
    this.rl = rl;
    this.monitoring = false;
    this.startTime = 0;
    this.lastCheck = 0;
    this.lagHistory = [];
  }

  async startMonitoring() {
    console.log(chalk.blue('\n🔄 Starting Event Loop Monitoring...'));
    console.log(chalk.yellow('This will monitor event loop lag and show real-time metrics'));
    console.log(chalk.yellow('Monitoring will auto-stop after 30 seconds'));
    console.log(chalk.yellow('Or type "stop" to stop early'));

    this.monitoring = true;
    this.startTime = performance.now();
    this.lastCheck = this.startTime;

    // Start monitoring
    this.monitorEventLoop();

    // Start some background tasks to create event loop activity
    this.startBackgroundTasks();

    // Wait for user to stop
    await this.waitForStop();

    // Clean up monitoring
    this.monitoring = false;
    console.log(chalk.green('\n✅ Event loop monitoring stopped. Returning to main menu...'));
  }

  monitorEventLoop() {
    if (!this.monitoring) return;

    const now = performance.now();
    const expectedTime = this.lastCheck + 16; // 16ms = ~60fps
    const actualLag = now - expectedTime;

    this.lagHistory.push(actualLag);
    if (this.lagHistory.length > 100) {
      this.lagHistory.shift();
    }

    // Calculate statistics
    const avgLag = this.lagHistory.reduce((a, b) => a + b, 0) / this.lagHistory.length;
    const maxLag = Math.max(...this.lagHistory);
    const minLag = Math.min(...this.lagHistory);

    // Simple display without interfering with readline
    console.log(
      chalk.blue(
        `🔄 Lag: ${actualLag.toFixed(2)}ms | Avg: ${avgLag.toFixed(2)}ms | Min: ${minLag.toFixed(
          2,
        )}ms | Max: ${maxLag.toFixed(2)}ms | Uptime: ${((now - this.startTime) / 1000).toFixed(1)}s`,
      ),
    );

    this.lastCheck = now;

    // Continue monitoring (less frequent to avoid interfering with user input)
    setTimeout(() => this.monitorEventLoop(), 1000);
  }

  createLagBar(lag) {
    const maxBarLength = 40;
    const normalizedLag = Math.max(0, Math.min(lag / 100, 1)); // Normalize to 0-1, ensure non-negative
    const barLength = Math.floor(normalizedLag * maxBarLength);

    let color;
    if (lag < 16) color = chalk.green;
    else if (lag < 50) color = chalk.yellow;
    else color = chalk.red;

    const bar = '█'.repeat(barLength) + '░'.repeat(maxBarLength - barLength);
    return color(`${bar} ${lag.toFixed(1)}ms`);
  }

  showEventLoopPhases() {
    console.log(chalk.cyan('\n🔄 Event Loop Phases:'));
    console.log(chalk.gray('• Timers: setTimeout, setInterval'));
    console.log(chalk.gray('• Pending callbacks: I/O callbacks deferred to next loop'));
    console.log(chalk.gray('• Idle, prepare: internal use'));
    console.log(chalk.gray('• Poll: new I/O events, I/O callbacks'));
    console.log(chalk.gray('• Check: setImmediate callbacks'));
    console.log(chalk.gray('• Close callbacks: close event callbacks'));
  }

  startBackgroundTasks() {
    // Simulate various types of async operations (less frequent)
    setInterval(() => {
      // Timer phase
      process.nextTick(() => {
        // Next tick queue
      });
    }, 2000);

    setImmediate(() => {
      // Check phase
      setImmediate(() => {
        // Nested setImmediate
      });
    });

    // Simulate I/O operations
    setInterval(() => {
      Promise.resolve().then(() => {
        // Microtask queue
      });
    }, 2000);
  }

  async demonstrateBlocking() {
    while (true) {
      console.log(chalk.blue('\n🚫 Demonstrating Blocking Operations'));
      console.log(chalk.yellow('This will show how blocking operations affect the event loop'));

      const choice = await this.question(
        chalk.green(
          '\nSelect blocking operation:\n' +
            '1. CPU-intensive loop\n' +
            '2. Synchronous file read\n' +
            '3. Asynchronous file read\n' +
            '4. Async vs Sync file read comparison\n' +
            '5. Infinite loop\n' +
            '6. Back\n',
        ),
      );

      switch (choice.trim()) {
        case '1':
          await this.cpuIntensiveLoop();
          break;
        case '2':
          await this.syncFileRead();
          break;
        case '3':
          await this.asyncFileRead();
          break;
        case '4':
          await this.asyncVsSync();
          break;
        case '5':
          await this.infiniteLoop();
          break;
        case '6':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }

      // Wait for user to continue
      await this.question(chalk.gray('\nPress Enter to continue...'));
    }
  }

  async cpuIntensiveLoop() {
    console.log(chalk.red('\n🚫 Starting CPU-intensive operation...'));
    console.log(chalk.yellow('This will block the event loop for 5 seconds'));

    const start = performance.now();

    // Simulate CPU-intensive work
    let result = 0;
    for (let i = 0; i < 1e10; i++) {
      result += Math.sqrt(i);
    }

    const duration = performance.now() - start;
    console.log(chalk.green(`✅ CPU-intensive operation completed in ${duration.toFixed(2)}ms`));
    console.log(chalk.gray(`Result: ${result.toFixed(2)}`));
  }

  async syncFileRead() {
    console.log(chalk.red('\n🚫 Reading large file synchronously...'));
    console.log(chalk.yellow('This will actually block the event loop!'));

    try {
      console.log(chalk.cyan('\n📁 Reading large-file.txt (10MB)...'));
      console.log(chalk.yellow('⏱️  Starting synchronous read...'));

      const startTime = performance.now();

      // Actually read the file synchronously - this will block the event loop
      const data = fs.readFileSync('large-file.txt', 'utf8');

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(chalk.green(`✅ File read completed in ${duration.toFixed(2)}ms`));
      console.log(chalk.cyan(`📊 File size: ${(data.length / 1024 / 1024).toFixed(2)} MB`));
      console.log(chalk.cyan(`📊 Characters read: ${data.length.toLocaleString()}`));
      console.log(chalk.cyan(`📊 First 100 chars: "${data.substring(0, 100)}..."`));

      // Show how this affected the event loop
      console.log(chalk.yellow('\n⚠️  Event loop was blocked during this operation!'));
      console.log(chalk.gray('• No other operations could be processed'));
      console.log(chalk.gray('• Timers were delayed'));
      console.log(chalk.gray('• I/O operations were queued'));
    } catch (error) {
      console.log(chalk.red(`❌ Error reading file: ${error.message}`));
      console.log(chalk.yellow('Make sure large-file.txt exists in the current directory'));
    }
  }

  async infiniteLoop() {
    console.log(chalk.red('\n🚫 WARNING: This will create an infinite loop!'));
    console.log(chalk.yellow('This will simulate blocking the event loop for 10 seconds'));
    console.log(chalk.yellow('Type "stop" to exit early, or wait for auto-exit'));

    const choice = await this.question(chalk.green('Are you sure? (y/N): '));

    if (choice.toLowerCase() === 'y') {
      console.log(chalk.red('🚫 Starting simulated infinite loop...'));
      console.log(chalk.yellow('Event loop will appear blocked!'));
      console.log(chalk.cyan('⏰ Will auto-exit in 10 seconds...'));

      const startTime = Date.now();
      const maxDuration = 10000; // 10 seconds

      // Simulate blocking behavior with intensive CPU work in chunks
      // This allows us to check for user input while still demonstrating blocking
      let shouldStop = false;
      let iterations = 0;

      // Set up auto-exit timer
      const autoExitTimer = setTimeout(() => {
        shouldStop = true;
      }, maxDuration);

      // Set up user input checker
      const checkUserInput = async () => {
        try {
          const input = await this.question(chalk.green('Type "stop" to exit: '));
          if (input.trim().toLowerCase() === 'stop') {
            shouldStop = true;
          } else {
            // Continue checking input
            checkUserInput();
          }
        } catch (error) {
          // If readline is closed, just continue
        }
      };

      // Start checking for user input
      checkUserInput();

      // Simulate blocking with intensive work
      while (!shouldStop) {
        // Do intensive work in small chunks to allow checking shouldStop
        for (let i = 0; i < 1000000; i++) {
          iterations += Math.sqrt(i);
        }

        // Small delay to allow checking shouldStop
        await new Promise(resolve => setImmediate(resolve));
      }

      clearTimeout(autoExitTimer);

      const duration = Date.now() - startTime;
      console.log(chalk.green('✅ Infinite loop stopped'));
      console.log(chalk.cyan(`⏱️  Loop ran for ${duration}ms`));
      console.log(chalk.cyan(`🔄 Completed ${iterations.toFixed(0)} iterations`));
      console.log(chalk.gray('💡 Note: This simulated blocking behavior'));
    }
  }

  async asyncVsSync() {
    console.log(chalk.blue('\n⚡ Async vs Sync Performance Comparison'));

    const iterations = 1000000;

    console.log(chalk.yellow(`\n🔄 Running ${iterations.toLocaleString()} iterations...`));

    // Synchronous operation
    const syncStart = performance.now();
    let syncResult = 0;
    for (let i = 0; i < iterations; i++) {
      syncResult += i;
    }
    const syncDuration = performance.now() - syncStart;

    // Asynchronous operation (simulated)
    const asyncStart = performance.now();
    let asyncResult = 0;

    // Break into chunks to allow event loop to process
    const chunkSize = 10000;
    for (let i = 0; i < iterations; i += chunkSize) {
      await new Promise(resolve => {
        setImmediate(() => {
          for (let j = i; j < Math.min(i + chunkSize, iterations); j++) {
            asyncResult += j;
          }
          resolve();
        });
      });
    }

    const asyncDuration = performance.now() - asyncStart;

    console.log(chalk.cyan('\n📊 Results:'));
    console.log(chalk.green(`✅ Synchronous: ${syncDuration.toFixed(2)}ms`));
    console.log(chalk.yellow(`🔄 Asynchronous: ${asyncDuration.toFixed(2)}ms`));
    console.log(chalk.blue(`📈 Speed difference: ${(asyncDuration / syncDuration).toFixed(2)}x slower`));
    console.log(chalk.gray(`💡 Note: Async allows other operations during execution`));

    // Verify results
    if (syncResult === asyncResult) {
      console.log(chalk.green('✅ Results match!'));
    } else {
      console.log(chalk.red('❌ Results mismatch!'));
    }
  }

  async waitForStop() {
    return new Promise(resolve => {
      // Use a timeout-based approach to avoid interfering with main application
      setTimeout(() => {
        if (this.monitoring) {
          console.log(chalk.yellow('\n⏰ Auto-stopping monitoring after 30 seconds...'));
          this.monitoring = false;
          resolve();
        }
      }, 30000);

      // Don't use SIGINT as it interferes with main application readline
    });
  }

  async asyncFileRead() {
    console.log(chalk.blue('\n🔄 Reading large file asynchronously...'));
    console.log(chalk.yellow('This will NOT block the event loop!'));

    try {
      console.log(chalk.cyan('\n📁 Reading large-file.txt (10MB) asynchronously...'));
      console.log(chalk.yellow('⏱️  Starting asynchronous read...'));

      const startTime = performance.now();

      // Read the file asynchronously - this will NOT block the event loop
      const data = await fs.promises.readFile('large-file.txt', 'utf8');

      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(chalk.green(`✅ Async file read completed in ${duration.toFixed(2)}ms`));
      console.log(chalk.cyan(`📊 File size: ${(data.length / 1024 / 1024).toFixed(2)} MB`));
      console.log(chalk.cyan(`📊 Characters read: ${data.length.toLocaleString()}`));
      console.log(chalk.cyan(`📊 First 100 chars: "${data.substring(0, 100)}..."`));

      // Show the benefits of async operations
      console.log(chalk.green('\n✅ Event loop remained responsive during this operation!'));
      console.log(chalk.gray('• Other operations could continue processing'));
      console.log(chalk.gray('• Timers were not delayed'));
      console.log(chalk.gray('• I/O operations were not blocked'));
    } catch (error) {
      console.log(chalk.red(`❌ Error reading file: ${error.message}`));
      console.log(chalk.yellow('Make sure large-file.txt exists in the current directory'));
    }
  }

  question(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, resolve);
    });
  }
}
