const { javascript } = require("projen");
const project = new javascript.NodeProject({
  defaultReleaseBranch: "main",
  name: "GH-Metrics",
  deps: [
    '@octokit/rest',
  ],
  devDeps: [],
});
project.synth();