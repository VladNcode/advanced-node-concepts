import { parentPort, workerData } from 'worker_threads';

// CPU-intensive worker for demonstrating worker thread performance
if (parentPort) {
  const { type, iterations, workerId, sharedArray, startIndex, endIndex, operation, updateCount } = workerData;

  try {
    let result;

    switch (type) {
      case 'cpu-intensive':
        result = performCPUIntensiveWork(iterations);
        break;

      case 'shared-memory-process':
        result = processSharedMemory(sharedArray, startIndex, endIndex, operation);
        break;

      case 'shared-memory-update':
        result = updateSharedMemory(sharedArray, updateCount, workerId);
        break;

      default:
        throw new Error(`Unknown task type: ${type}`);
    }

    parentPort.postMessage(result);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
}

function performCPUIntensiveWork(iterations) {
  let result = 0;

  // Perform CPU-intensive mathematical operations
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) + Math.sin(i) + Math.cos(i);
  }

  return result;
}

function processSharedMemory(sharedArray, startIndex, endIndex, operation) {
  let processedCount = 0;

  switch (operation) {
    case 'square':
      for (let i = startIndex; i < endIndex; i++) {
        sharedArray[i] = sharedArray[i] * sharedArray[i];
        processedCount++;
      }
      break;

    case 'sqrt':
      for (let i = startIndex; i < endIndex; i++) {
        sharedArray[i] = Math.sqrt(sharedArray[i]);
        processedCount++;
      }
      break;

    case 'increment':
      for (let i = startIndex; i < endIndex; i++) {
        sharedArray[i] += 1;
        processedCount++;
      }
      break;

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return processedCount;
}

function updateSharedMemory(sharedArray, updateCount, workerId) {
  let updatesPerformed = 0;

  // Perform random updates to demonstrate concurrent access
  for (let i = 0; i < updateCount; i++) {
    const randomIndex = Math.floor(Math.random() * sharedArray.length);
    const randomValue = Math.floor(Math.random() * 1000);

    // Use atomic operations for thread-safe updates
    Atomics.store(sharedArray, randomIndex, randomValue);
    updatesPerformed++;
  }

  return updatesPerformed;
}
