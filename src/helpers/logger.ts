export const print = (...args: unknown[]) => {
  console.log(`\u001b[38;5;84m[${new Date().toISOString()}]`, '\u001b[33m[nowscbot]\u001b[38;5;111m', ...args, '\u001b[0m');
  return print;
};

print.create = (...args: unknown[]) => {
  return print.bind(this, ...args);
};