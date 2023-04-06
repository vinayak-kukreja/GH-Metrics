import { Octokit } from '@octokit/rest';
import { ListIssuesForRepoDataType } from '../metrics';

const STATUS_DONE_LABEL = 'status/done';
type Timelines = {
  title: string;
  url: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
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
      if (issue.labels.includes(STATUS_DONE_LABEL) && issue.state === 'closed') {
        const title = issue.title;
        const url = issue.html_url;
        const startDate = issue.created_at;
        const endDate = issue.closed_at!;
        const diff = dateDiff(startDate, endDate);

        console.log(`Issue: '${title}',\tUrl: ${url},\tStart Date: ${startDate},\tEnd Date: ${endDate},\tNumber Of Days To Complete: ${diff}\n\n`);

        results.push({
          title: title,
          url: url,
          startDate: startDate,
          endDate: endDate,
          numberOfDays: diff,
        });
      }
    }

    return results;
  }

  /**
   * List and count of all PRs that were closed. This filters on RFC PRs.
   */
  public abandonedRfcs() {

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