import { CdkRfcMetrics } from './projects/rfc-metrics';

if (!process.env.OWNER) {
  throw new Error('OWNER is not defined!');
}

if (!process.env.REPO) {
  throw new Error('REPO is not defined!');
}

if (!process.env.TOKEN) {
  throw new Error('TOKEN is not defined!');
}

const owner = process.env.OWNER;
const repo = process.env.REPO;
const token = process.env.TOKEN;

const metrics = new CdkRfcMetrics(owner, repo, token);

async () => {
  await metrics.init();
};