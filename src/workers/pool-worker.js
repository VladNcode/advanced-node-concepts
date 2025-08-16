import { parentPort, workerData } from 'worker_threads';

// Pool worker for handling tasks from the worker pool
if (parentPort) {
  const { workerId } = workerData;

  console.log(`Worker ${workerId} initialized and ready for tasks`);

  // Listen for tasks from the main thread
  parentPort.on('message', async message => {
    if (message.type === 'task') {
      try {
        const { task } = message;
        const result = await processTask(task);
        parentPort.postMessage(result);
      } catch (error) {
        parentPort.postMessage({ error: error.message });
      }
    }
  });
}

async function processTask(task) {
  const { id, complexity, type } = task;

  if (type === 'cpu-intensive') {
    return performCPUIntensiveWork(complexity);
  }

  // Add more task types here as needed
  throw new Error(`Unknown task type: ${type}`);
}

function performCPUIntensiveWork(complexity) {
  let result = 0;

  // Perform CPU-intensive work based on complexity
  for (let i = 0; i < complexity; i++) {
    result += Math.sqrt(i) + Math.sin(i) + Math.cos(i);

    // Add some variation to make it more realistic
    if (i % 100000 === 0) {
      result += Math.random();
    }
  }

  return result;
}
