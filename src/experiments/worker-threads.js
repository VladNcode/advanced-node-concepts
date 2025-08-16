import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import chalk from 'chalk';
import { performance } from 'perf_hooks';
import os from 'os';

// Main thread code
if (isMainThread) {
  console.log(chalk.blue.bold('🧵 Worker Threads Demonstration'));
  console.log(chalk.yellow('This demonstrates Node.js worker threads for CPU-intensive tasks\n'));

  const numCPUs = os.cpus().length;
  console.log(chalk.cyan(`💻 System Information:`));
  console.log(chalk.gray(`  • CPU Cores: ${numCPUs}`));
  console.log(chalk.gray(`  • Platform: ${os.platform()}`));
  console.log(chalk.gray(`  • Node.js Version: ${process.version}`));

  // Demo 1: Simple worker
  console.log(chalk.blue('\n📋 Demo 1: Simple Worker Thread'));
  await demonstrateSimpleWorker();

  // Demo 2: CPU-intensive task comparison
  console.log(chalk.blue('\n📋 Demo 2: CPU-Intensive Task Comparison'));
  await demonstrateCPUComparison();

  // Demo 3: Worker pool
  console.log(chalk.blue('\n📋 Demo 3: Worker Thread Pool'));
  await demonstrateWorkerPool();

  // Demo 4: Communication patterns
  console.log(chalk.blue('\n📋 Demo 4: Communication Patterns'));
  await demonstrateCommunication();

  console.log(chalk.green('\n✅ Worker Threads demonstration completed!'));
  process.exit(0);
}

// Worker thread code
else {
  const { type } = workerData;

  // Set up message listener for pool workers
  if (type === 'pool') {
    parentPort.on('message', message => {
      handlePoolTask(message);
    });
  } else {
    // Handle other types immediately
    switch (type) {
      case 'simple':
        handleSimpleTask();
        break;
      case 'cpu-intensive':
        handleCPUIntensiveTask(workerData.data);
        break;
      case 'communication':
        handleCommunicationTask(workerData.data);
        break;
      default:
        parentPort.postMessage({ error: 'Unknown task type' });
    }
  }
}

// Demo 1: Simple worker
async function demonstrateSimpleWorker() {
  return new Promise(resolve => {
    const worker = new Worker(new URL(import.meta.url), {
      workerData: { type: 'simple' },
    });

    worker.on('message', message => {
      console.log(chalk.green(`  ✅ Worker completed: ${message.result}`));
      resolve();
    });

    worker.on('error', error => {
      console.log(chalk.red(`  ❌ Worker error: ${error.message}`));
      resolve();
    });

    worker.on('exit', code => {
      if (code !== 0) {
        console.log(chalk.red(`  ❌ Worker stopped with exit code ${code}`));
      }
      resolve();
    });
  });
}

// Demo 2: CPU-intensive task comparison
async function demonstrateCPUComparison() {
  const iterations = 10000000; // 10 million iterations

  console.log(chalk.yellow(`  🔄 Running CPU-intensive task (${iterations.toLocaleString()} iterations)`));

  // Run on main thread
  const mainStart = performance.now();
  const mainResult = runCPUIntensiveTask(iterations);
  const mainDuration = performance.now() - mainStart;

  console.log(chalk.gray(`  • Main thread: ${mainDuration.toFixed(2)}ms`));

  // Run on worker thread
  const workerStart = performance.now();
  const workerResult = await runCPUIntensiveTaskInWorker(iterations);
  const workerDuration = performance.now() - workerStart;

  console.log(chalk.gray(`  • Worker thread: ${workerDuration.toFixed(2)}ms`));

  // Performance comparison
  const speedup = mainDuration / workerDuration;
  console.log(chalk.cyan(`  📊 Speedup: ${speedup.toFixed(2)}x`));

  if (speedup > 1.5) {
    console.log(chalk.green(`  ✅ Worker thread significantly faster`));
  } else if (speedup > 1.1) {
    console.log(chalk.yellow(`  ⚠️  Worker thread slightly faster`));
  } else {
    console.log(chalk.red(`  ❌ Worker thread not faster (overhead > benefit)`));
  }
}

// Demo 3: Worker pool
async function demonstrateWorkerPool() {
  const numWorkers = Math.min(4, os.cpus().length);
  const tasks = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    iterations: 1000000 + i * 100000, // 1M to 1.8M iterations
  }));

  console.log(chalk.yellow(`  🔄 Running ${tasks.length} CPU-intensive tasks with ${numWorkers} workers`));
  console.log(chalk.gray(`  • Each task: 1M-1.8M mathematical iterations`));

  // Run sequentially first for comparison
  console.log(chalk.cyan(`  🔄 Running tasks sequentially for comparison...`));
  const sequentialStart = performance.now();
  for (const task of tasks) {
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < task.iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i) + Math.cos(i);
    }
    const duration = performance.now() - start;
    console.log(chalk.gray(`    Sequential Task ${task.id}: ${result.toFixed(2)} (${duration.toFixed(2)}ms)`));
  }
  const sequentialDuration = performance.now() - sequentialStart;
  console.log(chalk.yellow(`  📊 Sequential execution: ${sequentialDuration.toFixed(2)}ms`));

  // Run with worker pool
  console.log(chalk.cyan(`  🔄 Running tasks with worker pool...`));
  const start = performance.now();
  const results = await runWithWorkerPool(tasks, numWorkers);
  const duration = performance.now() - start;

  console.log(chalk.green(`  ✅ Worker pool execution: ${duration.toFixed(2)}ms`));
  console.log(chalk.gray(`  • Tasks: ${tasks.length}`));
  console.log(chalk.gray(`  • Workers: ${numWorkers}`));
  console.log(chalk.gray(`  • Average time per task: ${(duration / tasks.length).toFixed(2)}ms`));

  // Performance comparison
  const speedup = sequentialDuration / duration;
  console.log(chalk.cyan(`  📊 Speedup: ${speedup.toFixed(2)}x`));

  if (speedup > 1.5) {
    console.log(chalk.green(`  ✅ Worker pool significantly faster`));
  } else if (speedup > 1.1) {
    console.log(chalk.yellow(`  ⚠️  Worker pool slightly faster`));
  } else {
    console.log(chalk.red(`  ❌ Worker pool not faster (overhead > benefit)`));
  }

  // Show worker results
  console.log(chalk.cyan(`  📋 Worker pool results:`));
  results.forEach(result => {
    console.log(chalk.gray(`    Task ${result.id}: ${result.result.toFixed(2)} (${result.duration.toFixed(2)}ms)`));
  });
}

// Demo 4: Communication patterns
async function demonstrateCommunication() {
  console.log(chalk.yellow('  🔄 Demonstrating worker communication patterns'));

  const worker = new Worker(new URL(import.meta.url), {
    workerData: { type: 'communication', data: { message: 'Hello from main thread!' } },
  });

  return new Promise(resolve => {
    let messageCount = 0;

    worker.on('message', message => {
      messageCount++;
      console.log(chalk.gray(`  📨 Message ${messageCount}: ${message.data}`));

      if (messageCount >= 3) {
        worker.terminate();
        resolve();
      }
    });

    worker.on('error', error => {
      console.log(chalk.red(`  ❌ Communication error: ${error.message}`));
      resolve();
    });
  });
}

// Helper functions
function runCPUIntensiveTask(iterations) {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) + Math.cos(i);
  }
  return result;
}

async function runCPUIntensiveTaskInWorker(iterations) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), {
      workerData: { type: 'cpu-intensive', data: { iterations } },
    });

    worker.on('message', message => {
      resolve(message.result);
    });

    worker.on('error', reject);
  });
}

async function runWithWorkerPool(tasks, numWorkers) {
  const workers = [];
  const results = [];
  let taskIndex = 0;

  // Create worker pool
  for (let i = 0; i < numWorkers; i++) {
    workers.push(createPoolWorker());
  }

  // Distribute tasks
  const promises = workers.map(worker => {
    return new Promise(resolve => {
      worker.on('message', message => {
        results.push(message);

        // Assign next task if available
        if (taskIndex < tasks.length) {
          const task = tasks[taskIndex++];
          worker.postMessage({ type: 'pool', data: task });
        } else {
          worker.terminate();
          resolve();
        }
      });

      // Assign initial task
      if (taskIndex < tasks.length) {
        const task = tasks[taskIndex++];
        worker.postMessage({ type: 'pool', data: task });
      }
    });
  });

  await Promise.all(promises);
  return results.sort((a, b) => a.id - b.id);
}

function createPoolWorker() {
  return new Worker(new URL(import.meta.url), {
    workerData: { type: 'pool' },
  });
}

// Worker task handlers
function handleSimpleTask() {
  const result = 'Hello from worker thread!';
  parentPort.postMessage({ result });
}

function handleCPUIntensiveTask(data) {
  const { iterations } = data;
  let result = 0;

  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) + Math.cos(i);
  }

  parentPort.postMessage({ result });
}

function handlePoolTask(message) {
  // The message contains the task data
  const { data } = message;
  const { id, iterations } = data;

  const start = performance.now();

  // CPU-intensive task similar to Demo 2
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) + Math.cos(i);
  }

  const duration = performance.now() - start;

  parentPort.postMessage({ id, result, duration });
}

function handleCommunicationTask(data) {
  const { message } = data;

  // Send response
  parentPort.postMessage({ data: `Worker received: ${message}` });

  // Send additional messages
  setTimeout(() => {
    parentPort.postMessage({ data: 'Worker processing...' });
  }, 100);

  setTimeout(() => {
    parentPort.postMessage({ data: 'Worker completed!' });
  }, 200);
}
