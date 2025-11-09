import { autoRefreshInboundTracking, autoVoidExpiredLabels, autoAcceptOffers, autoCancelDormantOrders } from '@/jobs/scheduled';

const jobs = {
  autoRefreshInboundTracking,
  autoVoidExpiredLabels,
  autoAcceptOffers,
  autoCancelDormantOrders
};

const name = process.argv[2] as keyof typeof jobs;

if (!name || !jobs[name]) {
  console.error(`Usage: pnpm tsx scripts/run-job.ts <${Object.keys(jobs).join('|')}>`);
  process.exit(1);
}

jobs[name]().then(() => {
  console.log(`${name} completed`);
});
