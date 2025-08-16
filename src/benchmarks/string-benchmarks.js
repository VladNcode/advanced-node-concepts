import chalk from 'chalk';
import { performance } from 'perf_hooks';

export async function runStringBenchmarks() {
  console.log(chalk.cyan('🔄 String Performance Benchmarks\n'));

  const iterations = 100000;
  const results = [];

  // Benchmark 1: String concatenation methods
  console.log(chalk.yellow('📊 String Concatenation Methods:'));

  // String concatenation (+)
  const concatStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let str = '';
    for (let j = 0; j < 100; j++) {
      str += j.toString();
    }
  }
  const concatTime = performance.now() - concatStart;
  results.push({ name: 'String +', time: concatTime });

  // Array join
  const joinStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const parts = [];
    for (let j = 0; j < 100; j++) {
      parts.push(j.toString());
    }
    parts.join('');
  }
  const joinTime = performance.now() - joinStart;
  results.push({ name: 'Array.join', time: joinTime });

  // Template literals
  const templateStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    let str = '';
    for (let j = 0; j < 100; j++) {
      str += `${j}`;
    }
  }
  const templateTime = performance.now() - templateStart;
  results.push({ name: 'Template literals', time: templateTime });

  // Benchmark 2: String search methods
  console.log(chalk.yellow('\n📊 String Search Methods:'));

  const testString = 'a'.repeat(1000) + 'b' + 'a'.repeat(1000);

  // indexOf
  const indexOfStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testString.indexOf('b');
  }
  const indexOfTime = performance.now() - indexOfStart;
  results.push({ name: 'indexOf', time: indexOfTime });

  // includes
  const includesStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testString.includes('b');
  }
  const includesTime = performance.now() - includesStart;
  results.push({ name: 'includes', time: includesTime });

  // search with regex
  const searchStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testString.search(/b/);
  }
  const searchTime = performance.now() - searchStart;
  results.push({ name: 'search(regex)', time: searchTime });

  // Benchmark 3: String replacement methods
  console.log(chalk.yellow('\n📊 String Replacement Methods:'));

  // replace with string
  const replaceStringStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testString.replace('b', 'x');
  }
  const replaceStringTime = performance.now() - replaceStringStart;
  results.push({ name: 'replace(string)', time: replaceStringTime });

  // replace with regex
  const replaceRegexStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testString.replace(/b/g, 'x');
  }
  const replaceRegexTime = performance.now() - replaceRegexStart;
  results.push({ name: 'replace(regex)', time: replaceRegexTime });

  // replaceAll
  const replaceAllStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    testString.replaceAll('b', 'x');
  }
  const replaceAllTime = performance.now() - replaceAllStart;
  results.push({ name: 'replaceAll', time: replaceAllTime });

  // Benchmark 4: String splitting methods
  console.log(chalk.yellow('\n📊 String Splitting Methods:'));

  const splitString = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';

  // split with string delimiter
  const splitStringStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    splitString.split(',');
  }
  const splitStringTime = performance.now() - splitStringStart;
  results.push({ name: 'split(string)', time: splitStringTime });

  // split with regex delimiter
  const splitRegexStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    splitString.split(/,/);
  }
  const splitRegexTime = performance.now() - splitRegexStart;
  results.push({ name: 'split(regex)', time: splitRegexTime });

  // Benchmark 5: String case methods
  console.log(chalk.yellow('\n📊 String Case Methods:'));

  const caseString = 'Hello World JavaScript Node.js Performance Testing';

  // toLowerCase
  const toLowerCaseStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    caseString.toLowerCase();
  }
  const toLowerCaseTime = performance.now() - toLowerCaseStart;
  results.push({ name: 'toLowerCase', time: toLowerCaseTime });

  // toUpperCase
  const toUpperCaseStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    caseString.toUpperCase();
  }
  const toUpperCaseTime = performance.now() - toUpperCaseStart;
  results.push({ name: 'toUpperCase', time: toUpperCaseTime });

  // Display results
  console.log(chalk.cyan('\n📈 Benchmark Results:'));
  console.log(chalk.gray('═'.repeat(80)));
  console.log(chalk.gray('Method'.padEnd(25) + 'Time (ms)'.padEnd(15) + 'Performance'));
  console.log(chalk.gray('═'.repeat(80)));

  // Sort by performance (fastest first)
  results.sort((a, b) => a.time - b.time);

  results.forEach((result, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
    const color = index < 3 ? chalk.green : chalk.gray;
    const performance = index < 3 ? 'Excellent' : index < 6 ? 'Good' : 'Fair';

    console.log(color(`${medal} ${result.name.padEnd(22)} ${result.time.toFixed(2).padEnd(15)} ${performance}`));
  });

  console.log(chalk.gray('═'.repeat(80)));

  // Performance insights
  const fastest = results[0];
  const slowest = results[results.length - 1];
  const speedup = slowest.time / fastest.time;

  console.log(chalk.yellow('\n💡 Performance Insights:'));
  console.log(chalk.gray(`  • Fastest: ${fastest.name} (${fastest.time.toFixed(2)}ms)`));
  console.log(chalk.gray(`  • Slowest: ${slowest.name} (${slowest.time.toFixed(2)}ms)`));
  console.log(chalk.blue(`  • Speed difference: ${speedup.toFixed(2)}x`));

  if (speedup > 10) {
    console.log(chalk.red('  • ⚠️  Significant performance differences detected'));
  } else if (speedup > 5) {
    console.log(chalk.yellow('  • ⚠️  Moderate performance differences detected'));
  } else {
    console.log(chalk.green('  • ✅ Performance differences are reasonable'));
  }
}

// Run directly if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runStringBenchmarks();
}
