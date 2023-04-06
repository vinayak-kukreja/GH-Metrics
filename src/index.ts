import { Metrics, ListIssuesForRepoDataType } from './metrics';
import { CdkRfcMetrics } from './projects/rfc-metrics';

const owner = '';
const repo = '';
const token = '';

const metrics = new Metrics(owner, repo, token);

let prs: ListIssuesForRepoDataType;
let issues: ListIssuesForRepoDataType;

async () => {
  [prs, issues] = await metrics.getAllPrsAndIssues();

  const client = metrics.getClient();

  new CdkRfcMetrics(client, prs, issues);
};