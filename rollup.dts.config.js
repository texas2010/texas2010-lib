import dts from 'rollup-plugin-dts';

const entries = [
  'shared',
  'frontend',
  'frontend/react',
  'backend',
  'backend/comms-protocol',
];

export default entries.map((name) => ({
  input: `build/${name}/index.d.ts`,
  output: {
    file: `build/${name}/index.d.ts`,
    format: 'es',
  },
  plugins: [dts({})],
}));
