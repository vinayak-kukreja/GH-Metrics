import { CdkRfcMetrics } from './projects/rfc-metrics';

const owner = '';
const repo = '';
const token = '';

const metrics = new CdkRfcMetrics(owner, repo, token);

async () => {
  await metrics.init();
};