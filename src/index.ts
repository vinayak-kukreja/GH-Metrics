import { Metrics } from './metrics';
import { CdkRfcMetrics } from './projects/rfc-metrics';

const owner = '';
const repo = '';
const token = '';

const metrics = new Metrics(owner, repo, token);
const allIssues = async () => {
  await metrics.getAllIssues();
};
const client = metrics.getClient();

new CdkRfcMetrics(client, allIssues);