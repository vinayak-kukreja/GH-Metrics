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
  await metrics.avgIterationTime();
  await metrics.avgResponseTime();
  await metrics.barRaiserAssignTimeline();
};

metrics.completionTimelines();
metrics.abandonedRfcs();

const startDate = new Date('2022-01-01');
const endDate = new Date('2023-01-01');
metrics.numberOfRfcsReceived(startDate, endDate);
metrics.numberOfRfcsCompleted(startDate, endDate);

metrics.rateOfClosure();
