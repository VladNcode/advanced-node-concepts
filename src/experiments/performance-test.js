#!/usr/bin/env node

/**
 * Performance Test Suite for Node.js Internals Lab
 *
 * This file contains various performance tests that can be run with:
 * - node --prof src/experiments/performance-test.js
 * - clinic doctor -- node src/experiments/performance-test.js
 * - clinic flamegraph -- node src/experiments/performance-test.js
 */

import { performance } from 'perf_hooks';

class PerformanceTestSuite {
  constructor() {
    this.results = [];
    this.testData = [];
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Test Suite...\n');

    const tests = [
      { name: 'CPU Intensive Operations', fn: () => this.cpuIntensiveTests() },
      {
        name: 'Memory Allocation Tests',
        fn: () => this.memoryAllocationTests(),
      },
      { name: 'Event Loop Tests', fn: () => this.eventLoopTests() },
      { name: 'Async Operation Tests', fn: () => this.asyncOperationTests() },
      { name: 'Data Structure Tests', fn: () => this.dataStructureTests() },
    ];

    for (const test of tests) {
      console.log(`📊 Running: ${test.name}`);
      const start = performance.now();

      try {
        await test.fn();
        const duration = performance.now() - start;
        console.log(`✅ ${test.name} completed in ${duration.toFixed(2)}ms\n`);
      } catch (error) {
        console.log(`❌ ${test.name} failed: ${error.message}\n`);
      }
    }

    console.log('🎉 Performance Test Suite completed!');
    this.printSummary();
  }

  async cpuIntensiveTests() {
    const iterations = 1000000;

    // Mathematical operations
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) + Math.sin(i) + Math.cos(i);
    }

    // String operations
    let stringResult = '';
    for (let i = 0; i < 10000; i++) {
      stringResult += `item${i}`;
    }

    // Array operations
    const array = [];
    for (let i = 0; i < 100000; i++) {
      array.push(i * 2);
    }

    // Object operations
    const object = {};
    for (let i = 0; i < 10000; i++) {
      object[`key${i}`] = `value${i}`;
    }

    this.results.push({
      test: 'CPU Intensive',
      result: result,
      stringLength: stringResult.length,
      arrayLength: array.length,
      objectKeys: Object.keys(object).length,
    });
  }

  async memoryAllocationTests() {
    const objects = [];
    const arrays = [];
    const strings = [];

    // Create various types of objects
    for (let i = 0; i < 10000; i++) {
      objects.push({
        id: i,
        data: new Array(100).fill(`data${i}`),
        metadata: {
          created: Date.now(),
          tags: Array.from({ length: 20 }, (_, j) => `tag${j}`),
          properties: Array.from({ length: 50 }, (_, j) => `prop${j}`),
        },
      });

      arrays.push(new Array(1000).fill(i));
      strings.push(`String ${i} with some content that is longer than necessary`);
    }

    // Simulate some processing
    const processed = objects.map(obj => ({
      ...obj,
      processed: true,
      result: obj.data.length + obj.metadata.tags.length,
    }));

    this.results.push({
      test: 'Memory Allocation',
      objectsCreated: objects.length,
      arraysCreated: arrays.length,
      stringsCreated: strings.length,
      processedCount: processed.length,
    });

    // Clean up some references to test GC
    objects.length = 0;
    arrays.length = 0;
    strings.length = 0;
  }

  async eventLoopTests() {
    const promises = [];
    const timeouts = [];
    const intervals = [];

    // Create various async operations
    for (let i = 0; i < 1000; i++) {
      promises.push(
        new Promise(resolve => {
          setTimeout(() => resolve(i), Math.random() * 100);
        }),
      );

      timeouts.push(setTimeout(() => {}, 1000 + i));

      intervals.push(setInterval(() => {}, 2000 + i));
    }

    // Wait for promises to resolve
    await Promise.all(promises);

    // Clean up timers
    timeouts.forEach(clearTimeout);
    intervals.forEach(clearInterval);

    this.results.push({
      test: 'Event Loop',
      promisesResolved: promises.length,
      timeoutsCleared: timeouts.length,
      intervalsCleared: intervals.length,
    });
  }

  async asyncOperationTests() {
    const operations = [];

    // Simulate various async operations
    for (let i = 0; i < 100; i++) {
      operations.push(this.simulateAsyncOperation(i));
    }

    // Wait for all operations
    const results = await Promise.all(operations);

    this.results.push({
      test: 'Async Operations',
      operationsCompleted: results.length,
      totalTime: results.reduce((sum, r) => sum + r.duration, 0),
    });
  }

  async simulateAsyncOperation(id) {
    const start = performance.now();

    // Simulate some async work
    await new Promise(resolve => {
      setTimeout(() => {
        // Do some work
        let result = 0;
        for (let i = 0; i < 10000; i++) {
          result += Math.sqrt(id + i);
        }
        resolve(result);
      }, Math.random() * 100);
    });

    const duration = performance.now() - start;
    return { id, duration };
  }

  async dataStructureTests() {
    const map = new Map();
    const set = new Set();
    const weakMap = new WeakMap();
    const weakSet = new WeakSet();

    // Test Map operations
    for (let i = 0; i < 10000; i++) {
      map.set(`key${i}`, `value${i}`);
    }

    // Test Set operations
    for (let i = 0; i < 10000; i++) {
      set.add(`item${i}`);
    }

    // Test WeakMap and WeakSet (with objects)
    const objects = [];
    for (let i = 0; i < 1000; i++) {
      const obj = { id: i, data: `data${i}` };
      objects.push(obj);
      weakMap.set(obj, `weakValue${i}`);
      weakSet.add(obj);
    }

    // Test array operations
    const array = new Array(10000);
    for (let i = 0; i < 10000; i++) {
      array[i] = i * 2;
    }

    // Test object operations
    const object = {};
    for (let i = 0; i < 10000; i++) {
      object[`prop${i}`] = i * 3;
    }

    this.results.push({
      test: 'Data Structures',
      mapSize: map.size,
      setSize: set.size,
      weakMapSize: objects.length,
      weakSetSize: objects.length,
      arrayLength: array.length,
      objectKeys: Object.keys(object).length,
    });
  }

  printSummary() {
    console.log('📊 Test Results Summary:');
    console.log('═'.repeat(60));

    this.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.test}:`);
      Object.entries(result).forEach(([key, value]) => {
        if (key !== 'test') {
          console.log(`   • ${key}: ${value}`);
        }
      });
    });
  }
}

// Run the test suite
const testSuite = new PerformanceTestSuite();
testSuite.runAllTests().catch(console.error);
