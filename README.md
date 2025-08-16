# 🚀 Node.js Internals Lab

> **Master Advanced Node.js Concepts: Event Loop, V8 Internals, Worker Threads, Performance Profiling, Memory Management, and More!**

A comprehensive, interactive laboratory for exploring Node.js internals, performance characteristics, and advanced concepts. Perfect for developers who want to understand what happens under the hood of Node.js applications.

## 📚 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Experiments Overview](#-experiments-overview)
- [Detailed Experiments](#-detailed-experiments)
- [Performance Benchmarks](#-performance-benchmarks)
- [Individual Experiment Files](#-individual-experiment-files)
- [Configuration](#-configuration)
- [Contributing](#-contributing)

## ✨ Features

### 🔄 **Event Loop & libuv Experiments**

- Event loop phase visualization
- Execution order demonstrations
- Event loop blocking detection
- Microtask vs macrotask analysis
- Performance monitoring and lag detection

### 🧠 **V8 Internals & Garbage Collection**

- Memory allocation tracking
- Garbage collection analysis
- Heap snapshot analysis
- Memory leak detection
- V8 engine insights

### 🧵 **Worker Threads & Concurrency**

- Simple worker thread examples
- CPU-intensive task comparison
- Worker thread pools
- Inter-thread communication
- Performance benchmarking

### 📊 **Performance Profiling & Optimization**

- CPU profiling
- Memory profiling
- Function-level performance analysis
- Heap snapshot analysis
- Memory leak detection

### 💾 **Memory Management & Leaks**

- Event listener leak detection
- Closure leak analysis
- Array/object accumulation monitoring
- Timer leak identification
- Memory cleanup strategies

### 🔍 **Interactive Debugging & Inspection**

- Process information display
- Debug server simulation
- Real-time monitoring

### 📈 **Performance Benchmarks & Stress Testing**

- Array performance benchmarks
- String operation benchmarks
- Object manipulation benchmarks
- Async operation benchmarks
- High-load stress testing

## 🛠️ Installation

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd node

# Install dependencies
npm install

# Verify installation
npm start
```

## 🚀 Quick Start

### 1. Start the Application

```bash
npm start
```

### 2. Navigate the Menu

```
╔══════════════════════════════════════════════════════════════╗
║                     Node.js Internals Lab                    ║
║                                                              ║
║  Master Advanced Node.js Concepts:                           ║
║  • Event Loop & libuv                                        ║
║  • V8 Internals & Garbage Collection                         ║
║  • Worker Threads & Performance                              ║
║  • Memory Management & Profiling                             ║
╚══════════════════════════════════════════════════════════════╝

📚 Available Experiments:
1.  🔄 Event Loop & libuv Experiments
2.  🧠 V8 Internals & Garbage Collection
3.  🧵 Worker Threads & Concurrency
4.  📊 Performance Profiling & Optimization
5.  💾 Memory Management & Leaks
6.  🔍 Interactive Debugging & Inspection
7.  📈 Performance Benchmarks & Stress Testing
8.  🚪 Exit
```

### 3. Select an Experiment

Choose from 1-8 to explore different aspects of Node.js internals.

## 🧪 Experiments Overview

| #   | Experiment            | Description                                            | Key Features                                    |
| --- | --------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| 1   | Event Loop & libuv    | Event loop phases, execution order, blocking detection | 6 phases, microtasks, performance monitoring    |
| 2   | V8 Internals & GC     | Memory management, garbage collection, heap analysis   | Memory tracking, GC analysis, leak detection    |
| 3   | Worker Threads        | Multi-threading, CPU tasks, thread pools               | Performance comparison, communication patterns  |
| 4   | Performance Profiling | CPU/memory profiling, function analysis                | Heap snapshots, memory leaks, optimization tips |
| 5   | Memory Management     | Leak detection, cleanup strategies                     | Event listeners, closures, timers, arrays       |
| 6   | Debugging             | Process info, debug server                             | System information, debugging tools             |
| 7   | Benchmarks            | Performance testing, stress testing                    | Arrays, strings, objects, async operations      |

## 🔄 Detailed Experiments

### 1. Event Loop & libuv Experiments

**What You'll Learn:**

- The 6 phases of the Node.js event loop
- Execution order: sync → microtasks → timers → setImmediate
- How CPU-intensive tasks block the event loop
- Microtask priority over macrotasks
- Event loop performance monitoring

**Key Demonstrations:**

- Event loop phase visualization
- Execution order timing
- Blocking task simulation
- Performance lag detection
- Best practices and optimization tips

### 2. V8 Internals & Garbage Collection

**What You'll Learn:**

- V8's generational garbage collection
- Memory allocation patterns
- Heap growth and cleanup
- Manual garbage collection triggers
- Memory leak identification

**Key Demonstrations:**

- Memory allocation tracking
- Garbage collection performance
- Heap snapshot analysis
- Memory leak simulation
- Cleanup strategies

### 3. Worker Threads & Concurrency

**What You'll Learn:**

- Main thread vs worker thread performance
- CPU-intensive task distribution
- Worker thread pools
- Inter-thread communication
- Performance overhead analysis

**Key Demonstrations:**

- Simple worker thread creation
- CPU task performance comparison
- Worker pool management
- Message passing patterns
- Performance benchmarking

### 4. Performance Profiling & Optimization

**What You'll Learn:**

- CPU profiling techniques
- Memory usage analysis
- Function-level performance
- Heap snapshot interpretation
- Memory leak detection

**Key Demonstrations:**

- CPU profiling with different workloads
- Memory usage monitoring
- Function performance analysis
- Heap snapshot analysis
- Memory leak detection

### 5. Memory Management & Leaks

**What You'll Learn:**

- Common memory leak patterns
- Event listener management
- Closure memory implications
- Array/object accumulation
- Timer cleanup strategies

**Key Demonstrations:**

- Event listener leak simulation
- Closure memory leak analysis
- Data accumulation monitoring
- Timer leak detection
- Cleanup and prevention

### 6. Interactive Debugging & Inspection

**What You'll Learn:**

- Process information display
- Debug server setup
- Real-time monitoring
- System resource usage

**Key Demonstrations:**

- Process details (version, platform, architecture)
- Memory usage statistics
- Debug server simulation
- System information display

## 📈 Performance Benchmarks

### Comprehensive Benchmark Suite

The application includes a sophisticated benchmarking system that tests:

#### **Array Performance Benchmarks**

- **Creation Methods**: Array constructor, literal, Array.from
- **Modification Methods**: push vs unshift performance
- **Iteration Methods**: for loop, forEach, for...of comparison
- **Transformation Methods**: map vs manual transformation
- **Filtering Methods**: filter vs manual filtering

#### **String Performance Benchmarks**

- **Concatenation**: String +, Array.join, template literals
- **Search Methods**: indexOf, includes, regex search
- **Replacement**: replace, replaceAll, regex replacement
- **Splitting**: String vs regex delimiters
- **Case Methods**: toLowerCase, toUpperCase

#### **Object Performance Benchmarks**

- **Creation**: Object literal, constructor, Object.create
- **Property Access**: Direct, bracket notation, Object.values
- **Assignment**: Direct, Object.assign, spread operator
- **Iteration**: for...in, Object.keys, Object.entries
- **Cloning**: Spread, Object.assign, JSON, structuredClone, lodash.cloneDeep

#### **Async Performance Benchmarks**

- **Promise Creation**: Constructor, Promise.resolve, async functions
- **Promise Chaining**: .then() vs async/await vs Promise.all
- **Async Operations**: setTimeout, setImmediate, process.nextTick
- **Error Handling**: .catch() vs try/catch
- **Memory Usage**: Async operation memory implications

### Running Benchmarks

```bash
# Run all benchmarks
npm run benchmark

# Run specific benchmark categories
node src/benchmarks/array-benchmarks.js
node src/benchmarks/string-benchmarks.js
node src/benchmarks/object-benchmarks.js
node src/benchmarks/async-benchmarks.js
```

### Benchmark Results

Each benchmark provides:

- **Performance Rankings**: 🥇🥈🥉 medals for top performers
- **Timing Data**: Precise millisecond measurements
- **Performance Insights**: Speed differences and recommendations
- **Method-Specific Insights**: When to use each approach

## 🧪 Individual Experiment Files

### Direct Execution

You can run individual experiments directly:

```bash
# Worker threads demonstration
npm run worker:demo

# Event loop demonstration
npm run eventloop:demo

# Garbage collection demonstration
npm run gc:demo

# Memory leak demonstration
npm run memory:leak
```

### Experiment Files Structure

```
src/
├── experiments/
│   ├── worker-threads.js      # Worker thread examples
│   ├── event-loop-demo.js     # Event loop demonstrations
│   ├── garbage-collection.js  # GC and memory analysis
│   └── memory-leak-demo.js    # Memory leak patterns
├── benchmarks/
│   ├── index.js               # Main benchmark runner
│   ├── array-benchmarks.js    # Array performance tests
│   ├── string-benchmarks.js   # String performance tests
│   ├── object-benchmarks.js   # Object performance tests
│   └── async-benchmarks.js    # Async performance tests
└── core/
    ├── performance-analyzer.js # Performance profiling
    ├── memory-profiler.js      # Memory analysis
    ├── worker-thread-manager.js # Worker thread management
    ├── event-loop-monitor.js   # Event loop monitoring
    └── v8-internals-explorer.js # V8 engine exploration
```

## 🔧 Configuration

### Environment Variables

```bash
# Enable garbage collection exposure
NODE_OPTIONS="--expose-gc"

# Set performance monitoring intervals
PERFORMANCE_INTERVAL=1000
MEMORY_MONITORING_INTERVAL=500
```

### Performance Tuning

```bash
# Run with optimized V8 settings
node --max-old-space-size=4096 --optimize-for-size src/index.js

# Enable V8 profiling
node --prof src/index.js
```

## 🤝 Contributing

### Adding New Experiments

1. Create experiment file in `src/experiments/`
2. Add to main menu in `src/index.js`
3. Update README documentation
4. Test thoroughly

### Adding New Benchmarks

1. Create benchmark file in `src/benchmarks/`
2. Export benchmark function
3. Import in `src/benchmarks/index.js`
4. Update documentation

---

**Happy Exploring! 🚀**

_Master Node.js internals and become a performance optimization expert!_
