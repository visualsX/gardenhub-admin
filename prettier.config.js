/** @type {import("prettier").Config} */
module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],

  // core formatting
  semi: true,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',

  // JSX & React
  jsxSingleQuote: false,
  bracketSameLine: false,

  // tailwind plugin options
  tailwindFunctions: ['clsx', 'cva', 'twMerge'],
};
