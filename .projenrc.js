const { typescript } = require('projen');

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'GH-Metrics',
  deps: [
    '@octokit/rest',
    '@octokit/types',
    'd3',
  ],
  devDeps: [],
});
project.synth();