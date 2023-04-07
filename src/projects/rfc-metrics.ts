import { Octokit } from '@octokit/rest';
import { ListIssuesForRepoDataType } from '../metrics';

const STATUS_DONE_LABEL = 'status/done';
const STATUS_CLOSED = 'closed';

type Timelines = {
  title: string;
  url: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
}

type AbandonedRfcs = {
  title: string;
  url: string;
  lastUpdatedAt: string;
  daysSinceUpdated: number;
  status: string;
}

export class CdkRfcMetrics {
  client: Octokit;
  allPrs: ListIssuesForRepoDataType;
  allIssues: ListIssuesForRepoDataType;


  constructor(client: Octokit, allPrs: ListIssuesForRepoDataType, allIssues: ListIssuesForRepoDataType) {
    this.client = client;
    this.allPrs = allPrs;
    this.allIssues = allIssues;
  }

  /**
   * Timelines for Issues that were successfully entirely completed
   * Start Period, End Period for Issues with label 'status/done'
   */
  public completionTimelines(): Timelines[] {
    const results: Timelines[] = [];

    for (const issue of this.allIssues) {
      if (issue.labels.includes(STATUS_DONE_LABEL) && issue.state === STATUS_CLOSED) {
        const diff = dateDiff(issue.created_at, issue.closed_at!);

        console.log(`Issue: '${issue.title}',\tUrl: ${issue.html_url},\tStart Date: ${issue.created_at},\tEnd Date: ${issue.closed_at!},\tNumber Of Days To Complete: ${diff}\n\n`);

        results.push({
          title: issue.title,
          url: issue.html_url,
          startDate: issue.created_at,
          endDate: issue.closed_at!,
          numberOfDays: diff,
        });
      }
    }

    return results;
  }

  /**
   * All RFCs that were abandoned after opening
   * Considering if there have been no updates in last 100 days that it is abandoned
   */
  public abandonedRfcs(): AbandonedRfcs[] {
    const abandonedRfcs: AbandonedRfcs[] = [];

    for (const issue of this.allIssues) {
      const lastUpdatedDate = issue.updated_at;
      const currentDate = new Date().toISOString();
      const daysSinceUpdated = dateDiff(lastUpdatedDate, currentDate);

      console.log(`Issue: '${issue.title}',\tUrl: ${issue.url},\tLast Updated At: ${issue.updated_at},\tNumber of Days Since Last Updated: ${daysSinceUpdated},\tCurrent Status: ${issue.state}\n\n`);

      if (daysSinceUpdated >= 100) {
        abandonedRfcs.push({
          title: issue.title,
          url: issue.url,
          lastUpdatedAt: issue.updated_at,
          daysSinceUpdated: daysSinceUpdated,
          status: issue.state,
        });
      }
    }

    return abandonedRfcs;
  }

  /**
   * Average time between authors requesting reviews or adding comments on PRs?
   */
  public avgIterationTime() {

  }

  /**
   * Average response time of bar raisers during reviews
   */
  public avgResponseTime() {

  }

  /**
   * Number of Rfcs over a period of time
   */
  public numberOfRfcsReceived() {

  }

  /**
   * ?????
   */
  public rateOfClosure() {

  }

  /**
   * Timeline for assigning a bar raiser
   */
  public barRaiserAssignTimeline() {

  }

  /**
   * Rate of RFCs that are implemented
   */
  public rateOfImplementation() {

  }
}

export function dateDiff(startDate: string, endDate: string): number {
  const startsOn = new Date(startDate).getTime();
  const endsOn = new Date(endDate).getTime();

  const diff = Math.abs(endsOn - startsOn);
  const diffInDays = Math.floor(diff/(24 * 60 * 60 * 1000));

  return diffInDays;
}