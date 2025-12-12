const esbuild = require('esbuild');

const handlers = [
  'handlers/auth',
  'handlers/expenses', 
  'handlers/categories',
  'handlers/reports',
  'handlers/authorizer'
];

// Bundle each handler
Promise.all(
  handlers.map(handler => 
    esbuild.build({
      entryPoints: [`src/${handler}.ts`],
      bundle: true,
      platform: 'node',
      target: 'node20',
      outfile: `dist/${handler}.js`,
      external: ['aws-sdk'],  // excludes aws-sdk, include everything else
      format: 'cjs',
      minify: false
    }).then(() => {
      console.log(`Bundled ${handler}`);
    }).catch((err) => {
      console.error(`Failed to bundle ${handler}:`, err);
      throw err;
    })
  )
).then(() => {
  console.log('All handlers bundled successfully!');
}).catch(() => {
  process.exit(1);
});