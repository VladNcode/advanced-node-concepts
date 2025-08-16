import chalk from 'chalk';
import { cpus } from 'os';
import path from 'path';
import { performance } from 'perf_hooks';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WorkerThreadManager {
  constructor(rl) {
    this.rl = rl;
    this.workers = new Map();
    this.workerPool = [];
    this.maxPoolSize = cpus().length;
  }

  async cpuIntensiveTask() {
    while (true) {
      console.log(chalk.blue('\n🧵 CPU-Intensive Task with Worker Threads'));
      console.log(chalk.yellow('This will demonstrate how worker threads can handle CPU-intensive work'));

      const choice = await this.question(
        chalk.green('\nSelect task type:\n1. Single worker\n2. Multiple workers\n3. Worker pool\n4. Back\n'),
      );

      switch (choice.trim()) {
        case '1':
          await this.singleWorkerTask();
          break;
        case '2':
          await this.multipleWorkersTask();
          break;
        case '3':
          await this.workerPoolTask();
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

  async singleWorkerTask() {
    console.log(chalk.blue('\n🧵 Single Worker Thread Task'));

    const iterations = 100000000; // 100 million iterations
    console.log(chalk.yellow(`\n🔄 Running ${iterations.toLocaleString()} iterations...`));

    // Run in main thread first
    console.log(chalk.cyan('⏱️  Running in main thread...'));
    const mainStart = performance.now();
    let mainResult = 0;

    for (let i = 0; i < iterations; i++) {
      mainResult += Math.sqrt(i) + Math.sin(i) + Math.cos(i);
    }

    const mainDuration = performance.now() - mainStart;
    console.log(chalk.green(`✅ Main thread completed in ${mainDuration.toFixed(2)}ms`));
    console.log(chalk.gray(`Result: ${mainResult.toFixed(2)}`));

    // Now run in worker thread
    console.log(chalk.cyan('\n🧵 Running in worker thread...'));
    const workerStart = performance.now();

    try {
      const result = await this.runInWorker({
        type: 'cpu-intensive',
        iterations: iterations,
      });

      const workerDuration = performance.now() - workerStart;
      console.log(chalk.green(`✅ Worker thread completed in ${workerDuration.toFixed(2)}ms`));
      console.log(chalk.gray(`Result: ${result.toFixed(2)}`));

      // Compare performance
      const speedup = mainDuration / workerDuration;
      console.log(chalk.yellow(`\n📊 Performance Comparison:`));
      console.log(chalk.gray(`  • Main thread: ${mainDuration.toFixed(2)}ms`));
      console.log(chalk.gray(`  • Worker thread: ${workerDuration.toFixed(2)}ms`));
      console.log(chalk.blue(`  • Speedup: ${speedup.toFixed(2)}x`));

      // Verify results are similar
      const difference = Math.abs(mainResult - result);
      if (difference < 0.01) {
        console.log(chalk.green(`  • ✅ Results match (difference: ${difference.toFixed(6)})`));
      } else {
        console.log(chalk.red(`  • ❌ Results differ (difference: ${difference.toFixed(6)})`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Worker thread error: ${error.message}`));
    }
  }

  async multipleWorkersTask() {
    console.log(chalk.blue('\n🧵 Multiple Worker Threads Task'));

    const totalIterations = 100000000;
    const workerCount = 4;
    const iterationsPerWorker = Math.floor(totalIterations / workerCount);

    console.log(
      chalk.yellow(`\n🔄 Running ${totalIterations.toLocaleString()} iterations across ${workerCount} workers...`),
    );
    console.log(chalk.gray(`Each worker handles ${iterationsPerWorker.toLocaleString()} iterations`));

    const start = performance.now();
    const promises = [];

    // Create workers
    for (let i = 0; i < workerCount; i++) {
      const promise = this.runInWorker({
        type: 'cpu-intensive',
        iterations: iterationsPerWorker,
        workerId: i,
      });
      promises.push(promise);
    }

    try {
      const results = await Promise.all(promises);
      const duration = performance.now() - start;

      const totalResult = results.reduce((sum, result) => sum + result, 0);

      console.log(chalk.green(`\n✅ All workers completed in ${duration.toFixed(2)}ms`));
      console.log(chalk.gray(`Total result: ${totalResult.toFixed(2)}`));

      // Show individual worker results
      console.log(chalk.cyan('\n📊 Worker Results:'));
      results.forEach((result, i) => {
        console.log(chalk.gray(`  • Worker ${i}: ${result.toFixed(2)}`));
      });

      // Compare with single worker
      const singleWorkerStart = performance.now();
      let singleResult = 0;
      for (let i = 0; i < totalIterations; i++) {
        singleResult += Math.sqrt(i) + Math.sin(i) + Math.cos(i);
      }
      const singleDuration = performance.now() - singleWorkerStart;

      console.log(chalk.yellow('\n📈 Performance Analysis:'));
      console.log(chalk.gray(`  • Single worker: ${singleDuration.toFixed(2)}ms`));
      console.log(chalk.gray(`  • Multiple workers: ${duration.toFixed(2)}ms`));
      console.log(chalk.blue(`  • Speedup: ${(singleDuration / duration).toFixed(2)}x`));
    } catch (error) {
      console.log(chalk.red(`❌ Multiple workers error: ${error.message}`));
    }
  }

  async workerPoolTask() {
    console.log(chalk.blue('\n🧵 Worker Pool Management'));
    console.log(chalk.yellow('This demonstrates efficient worker pool usage for multiple tasks'));

    const taskCount = 20;
    const poolSize = Math.min(4, cpus().length);

    console.log(chalk.cyan(`\n🏊 Creating worker pool with ${poolSize} workers...`));
    console.log(chalk.yellow(`🔄 Processing ${taskCount} tasks...`));

    // Initialize worker pool
    await this.initializeWorkerPool(poolSize);

    const start = performance.now();
    const tasks = [];

    // Create tasks with different complexities
    for (let i = 0; i < taskCount; i++) {
      const complexity = 1000000 + i * 500000; // Varying complexity
      tasks.push({
        id: i,
        complexity: complexity,
        type: 'cpu-intensive',
      });
    }

    try {
      const results = await this.processTasksWithPool(tasks);
      const duration = performance.now() - start;

      console.log(chalk.green(`\n✅ All tasks completed in ${duration.toFixed(2)}ms`));

      // Show task results
      console.log(chalk.cyan('\n📊 Task Results:'));
      results.forEach((result, i) => {
        const task = tasks[i];
        console.log(
          chalk.gray(`  • Task ${task.id}: ${result.toFixed(2)} (complexity: ${task.complexity.toLocaleString()})`),
        );
      });

      // Pool statistics
      console.log(chalk.yellow('\n🏊 Pool Statistics:'));
      console.log(chalk.gray(`  • Pool size: ${poolSize}`));
      console.log(chalk.gray(`  • Tasks processed: ${taskCount}`));
      console.log(chalk.gray(`  • Average time per task: ${(duration / taskCount).toFixed(2)}ms`));
      console.log(
        chalk.gray(`  • Pool utilization: ${((taskCount / poolSize) * (duration / taskCount)).toFixed(2)}ms`),
      );
    } catch (error) {
      console.log(chalk.red(`❌ Worker pool error: ${error.message}`));
    } finally {
      // Clean up pool
      await this.cleanupWorkerPool();
    }
  }

  async sharedMemoryDemo() {
    while (true) {
      console.log(chalk.blue('\n🧠 Shared Memory Demonstration'));
      console.log(chalk.yellow('This shows how worker threads can share memory using SharedArrayBuffer'));

      const bufferSize = 1000000; // 1 million integers
      console.log(chalk.cyan(`\n🔄 Creating shared buffer with ${bufferSize.toLocaleString()} integers...`));

      // Create shared buffer
      const sharedBuffer = new SharedArrayBuffer(bufferSize * 4); // 4 bytes per int32
      const sharedArray = new Int32Array(sharedBuffer);

      // Initialize with some data
      for (let i = 0; i < bufferSize; i++) {
        sharedArray[i] = i;
      }

      console.log(chalk.green(`✅ Shared buffer created and initialized`));
      console.log(chalk.gray(`Buffer size: ${this.formatBytes(sharedBuffer.byteLength)}`));

      // Verify initialization worked
      console.log(chalk.cyan(`🔍 Initialization check:`));
      console.log(chalk.gray(`  • sharedArray[0]: ${sharedArray[0]}`));
      console.log(chalk.gray(`  • sharedArray[1]: ${sharedArray[1]}`));
      console.log(chalk.gray(`  • sharedArray[99]: ${sharedArray[99]}`));

      const choice = await this.question(
        chalk.green('\nSelect operation:\n1. Parallel processing\n2. Concurrent updates\n3. Back\n'),
      );

      switch (choice.trim()) {
        case '1':
          await this.parallelProcessing(sharedArray, bufferSize);
          break;
        case '2':
          await this.concurrentUpdates(sharedArray, bufferSize);
          break;
        case '3':
          return;
        default:
          console.log(chalk.red('❌ Invalid choice.'));
      }

      // Wait for user to continue
      await this.question(chalk.gray('\nPress Enter to continue...'));
    }
  }

  async parallelProcessing(sharedArray, bufferSize) {
    console.log(chalk.blue('\n🔄 Parallel Processing with Shared Memory'));

    const workerCount = 4;
    const chunkSize = Math.floor(bufferSize / workerCount);

    console.log(chalk.yellow(`\n🔄 Processing ${bufferSize.toLocaleString()} elements with ${workerCount} workers...`));
    console.log(chalk.cyan(`📊 Each worker processes ~${chunkSize.toLocaleString()} elements`));
    console.log(chalk.cyan(`🔧 Operation: Square each element (x → x²)`));

    const start = performance.now();
    const promises = [];

    // Create workers for parallel processing
    for (let i = 0; i < workerCount; i++) {
      const startIndex = i * chunkSize;
      const endIndex = i === workerCount - 1 ? bufferSize : (i + 1) * chunkSize;

      const promise = this.runInWorker({
        type: 'shared-memory-process',
        sharedArray: sharedArray,
        startIndex: startIndex,
        endIndex: endIndex,
        operation: 'square',
      });
      promises.push(promise);
    }

    try {
      await Promise.all(promises);

      // Small delay to ensure shared memory is fully synchronized
      await new Promise(resolve => setTimeout(resolve, 10));

      const duration = performance.now() - start;

      console.log(chalk.green(`\n✅ Parallel processing completed in ${duration.toFixed(2)}ms`));

      // Calculate performance metrics
      const elementsPerSecond = (bufferSize / (duration / 1000)).toLocaleString();
      const elementsPerWorker = (bufferSize / workerCount).toLocaleString();
      const timePerWorker = (duration / workerCount).toFixed(2);

      console.log(chalk.cyan(`📊 Performance Metrics:`));
      console.log(chalk.gray(`  • Throughput: ${elementsPerSecond} elements/second`));
      console.log(chalk.gray(`  • Elements per worker: ${elementsPerWorker}`));
      console.log(chalk.gray(`  • Average time per worker: ${timePerWorker}ms`));

      // Show sample values before and after
      console.log(chalk.cyan(`\n📊 Sample Values (first 10 elements):`));
      console.log(chalk.gray(`  • Before: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9`));

      // Read values directly from the shared array with better error handling
      const afterValues = [];
      for (let i = 0; i < 10; i++) {
        try {
          const value = sharedArray[i];
          afterValues.push(typeof value === 'number' ? value : 'undefined');
        } catch (error) {
          afterValues.push(`error:${error.message}`);
        }
      }
      console.log(chalk.gray(`  • After:  ${afterValues.join(', ')}`));

      // Also show a few more values to verify the pattern
      console.log(chalk.cyan(`📊 More sample values:`));
      const index0to4 = [0, 1, 2, 3, 4].map(i => {
        const value = sharedArray[i];
        return typeof value === 'number' ? value : 'undefined';
      });
      console.log(chalk.gray(`  • Index 0-4: ${index0to4.join(', ')}`));

      const index95to99 = [95, 96, 97, 98, 99].map(i => {
        const value = sharedArray[i];
        return typeof value === 'number' ? value : 'undefined';
      });
      console.log(chalk.gray(`  • Index 95-99: ${index95to99.join(', ')}`));

      // Debug: Check if the array is actually accessible
      console.log(chalk.yellow(`🔍 Debug Info:`));
      console.log(chalk.gray(`  • sharedArray type: ${typeof sharedArray}`));
      console.log(chalk.gray(`  • sharedArray length: ${sharedArray.length}`));
      console.log(chalk.gray(`  • sharedArray[0]: ${sharedArray[0]}`));
      console.log(chalk.gray(`  • sharedArray[1]: ${sharedArray[1]}`));

      // Test direct access to a few more indices
      console.log(chalk.gray(`  • sharedArray[2]: ${sharedArray[2]}`));
      console.log(chalk.gray(`  • sharedArray[3]: ${sharedArray[3]}`));
      console.log(chalk.gray(`  • sharedArray[4]: ${sharedArray[4]}`));

      // Check if this is the same array we initialized
      console.log(chalk.gray(`  • First 5 values: ${Array.from({ length: 5 }, (_, i) => sharedArray[i]).join(', ')}`));

      // Verify results
      let sum = 0;
      for (let i = 0; i < Math.min(100, bufferSize); i++) {
        sum += sharedArray[i];
      }

      // Calculate expected sum of squared values (0² + 1² + 2² + ... + 99²)
      const expectedSum = Array.from({ length: 100 }, (_, i) => i * i).reduce((a, b) => a + b, 0);

      console.log(chalk.cyan(`\n📊 Verification (first 100 elements):`));
      console.log(chalk.gray(`  • Sum: ${sum.toLocaleString()}`));
      console.log(chalk.gray(`  • Expected: ${expectedSum.toLocaleString()}`));
      console.log(chalk.gray(`  • Operation: Square (x²)`));
      console.log(chalk.gray(`  • Formula: 0² + 1² + 2² + ... + 99²`));

      if (sum === expectedSum) {
        console.log(chalk.green(`  • ✅ Processing successful`));
      } else {
        console.log(chalk.red(`  • ❌ Processing failed`));
        console.log(chalk.yellow(`  • Difference: ${Math.abs(sum - expectedSum).toLocaleString()}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Parallel processing error: ${error.message}`));
    }
  }

  async concurrentUpdates(sharedArray, bufferSize) {
    console.log(chalk.blue('\n🔄 Concurrent Updates with Shared Memory'));

    const updateCount = 100000;
    console.log(chalk.yellow(`\n🔄 Performing ${updateCount.toLocaleString()} concurrent updates...`));

    const start = performance.now();
    const promises = [];

    // Create multiple workers for concurrent updates
    for (let i = 0; i < 4; i++) {
      const promise = this.runInWorker({
        type: 'shared-memory-update',
        sharedArray: sharedArray,
        updateCount: Math.floor(updateCount / 4),
        workerId: i,
      });
      promises.push(promise);
    }

    try {
      await Promise.all(promises);
      const duration = performance.now() - start;

      console.log(chalk.green(`\n✅ Concurrent updates completed in ${duration.toFixed(2)}ms`));

      // Show some sample values
      console.log(chalk.cyan(`\n📊 Sample Values:`));
      for (let i = 0; i < 10; i++) {
        console.log(chalk.gray(`  • Index ${i}: ${sharedArray[i]}`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Concurrent updates error: ${error.message}`));
    }
  }

  async runInWorker(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, '..', 'workers', 'cpu-worker.js'), {
        workerData: data,
      });

      worker.on('message', result => {
        resolve(result);
        worker.terminate();
      });

      worker.on('error', error => {
        reject(error);
        worker.terminate();
      });

      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  async initializeWorkerPool(size) {
    console.log(chalk.cyan(`\n🏊 Initializing worker pool with ${size} workers...`));

    for (let i = 0; i < size; i++) {
      const worker = new Worker(path.join(__dirname, '..', 'workers', 'pool-worker.js'), {
        workerData: { workerId: i },
      });

      this.workerPool.push({
        worker: worker,
        busy: false,
        id: i,
      });
    }

    console.log(chalk.green(`✅ Worker pool initialized`));
  }

  async processTasksWithPool(tasks) {
    const results = new Array(tasks.length);
    const pendingTasks = [...tasks];

    return new Promise((resolve, reject) => {
      const processNextTask = () => {
        if (pendingTasks.length === 0) {
          // All tasks completed
          resolve(results);
          return;
        }

        const availableWorker = this.workerPool.find(w => !w.busy);
        if (!availableWorker) {
          // No available workers, wait
          setTimeout(processNextTask, 10);
          return;
        }

        const task = pendingTasks.shift();
        availableWorker.busy = true;

        availableWorker.worker.postMessage({
          type: 'task',
          task: task,
        });

        availableWorker.worker.once('message', result => {
          results[task.id] = result;
          availableWorker.busy = false;
          processNextTask();
        });
      };

      // Start processing
      processNextTask();
    });
  }

  async cleanupWorkerPool() {
    console.log(chalk.cyan('\n🧹 Cleaning up worker pool...'));

    for (const poolWorker of this.workerPool) {
      poolWorker.worker.terminate();
    }

    this.workerPool = [];
    console.log(chalk.green('✅ Worker pool cleaned up'));
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
