import { Octokit } from '@octokit/rest';
import { ListIssuesForRepoDataType, ListTimelineForIssueDataType, Metrics } from '../metrics';

const STATUS_DONE_LABEL = 'status/done';
const STATUS_CLOSED = 'closed';
const STATUS_OPEN = 'open';
const REVIEW_REQUESTED = 'review_requested';
const REVIEWED = 'reviewed';

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
}

type BarRaiserTimeline = {
  prNumber: number;
  title: string;
  numberOfDays: number;
};

export class CdkRfcMetrics extends Metrics {
  client: Octokit;
  allPrs!: ListIssuesForRepoDataType;
  allIssues!: ListIssuesForRepoDataType;

  constructor(owner: string, repo: string, token: string) {
    super(owner, repo, token);

    this.client = super.getClient();
  }

  /**
   * This needs to be done to get all issues and prs for the repo
   * Unfortunately the constructor cannot be async
   */
  public async init() {
    [this.allPrs, this.allIssues] = await super.getAllPrsAndIssues();
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

      console.log(`Issue: '${issue.title}',\tUrl: ${issue.url},\tLast Updated At: ${issue.updated_at},\tNumber of Days Since Last Updated: ${daysSinceUpdated}\n\n`);

      if (daysSinceUpdated >= 100 && issue.state === STATUS_OPEN) {
        abandonedRfcs.push({
          title: issue.title,
          url: issue.url,
          lastUpdatedAt: issue.updated_at,
          daysSinceUpdated: daysSinceUpdated,
        });
      }
    }

    return abandonedRfcs;
  }

  /**
   * Average time between authors requesting reviews or adding comments on PRs?
   */
  public async avgIterationTime() {
    let totalTime: number = 0;
    let totalInstances = 0;

    for (const pr of this.allPrs) {
      const prTimeline: ListTimelineForIssueDataType = await super.getIssueTimeline(pr.number);

      let pastEventTime = undefined;

      // https://docs.github.com/en/webhooks-and-events/events/issue-event-types#review_requested
      for (const timeline of prTimeline) {
        if (timeline.event === REVIEW_REQUESTED && timeline.created_at !== undefined) {
          if (pastEventTime === undefined) {
            pastEventTime = new Date(timeline.created_at);
          } else {
            totalTime += new Date(timeline.created_at).getTime() - pastEventTime.getTime();
            ++totalInstances;
          }
        }
      }
    }

    const milliToMins = 60 * 1000;
    const avgTimeline = totalTime/(totalInstances * milliToMins);

    return avgTimeline;
  }

  /**
   * Average response time of bar raisers during reviews
   */
  public async avgResponseTime() {
    let totalTime: number = 0;
    let totalInstances = 0;

    for (const pr of this.allPrs) {
      const prTimeline: ListTimelineForIssueDataType = await super.getIssueTimeline(pr.number);

      let pastEventTime = undefined;

      https://docs.github.com/en/webhooks-and-events/events/issue-event-types#reviewed
      for (const timeline of prTimeline) {
        if (timeline.event === REVIEWED && timeline.created_at !== undefined) {
          if (pastEventTime === undefined) {
            pastEventTime = new Date(timeline.created_at);
          } else {
            totalTime += new Date(timeline.created_at).getTime() - pastEventTime.getTime();
            ++totalInstances;
          }
        }
      }
    }

    const milliToMins = 60 * 1000;
    const avgTimeline = totalTime/(totalInstances * milliToMins);

    return avgTimeline;
  }

  /**
   * Number of Rfcs over a period of time
   */
  public numberOfRfcsReceived(startDate: Date, endDate: Date): number {
    let counter: number = 0;

    for (const issue of this.allIssues) {
      const createdDate = new Date(issue.created_at);

      if (createdDate >= startDate && createdDate <= endDate) {
        ++counter;
      }
    }

    return counter;
  }

  /**
   * Number of Rfcs over a period of time
   */
  public numberOfRfcsCompleted(startDate: Date, endDate: Date): number {
    let counter: number = 0;

    for (const issue of this.allIssues) {
      const createdDate = new Date(issue.created_at);

      if (createdDate >= startDate &&
        createdDate <= endDate &&
        issue.labels.includes(STATUS_DONE_LABEL) &&
        issue.state === STATUS_CLOSED) {
        ++counter;
      }
    }

    return counter;
  }

  /**
   * Rate of closing RFCs
   *
   * (Closed/Incoming)
   */
  public rateOfClosure() {
    let numberOfRfcsCompleted: number = 0;
    let numberOfRfcs: number = this.allIssues.length;

    for (const issue of this.allIssues) {
      if (issue.labels.includes(STATUS_DONE_LABEL)) {
        ++numberOfRfcsCompleted;
      }
    }

    const rate = (numberOfRfcsCompleted/numberOfRfcs);

    return rate;
  }

  /**
   * Timeline for assigning a bar raiser
   */
  public async barRaiserAssignTimeline() {
    const data: BarRaiserTimeline[] = [];

    for (const pr of this.allPrs) {
      const prCreatedDate = pr.created_at;
      const timeline = await this.getIssueTimeline(pr.number);

      for (const event of timeline) {
        if (event.event === 'review_requested' && event.created_at !== undefined) {
          const diff = dateDiff(prCreatedDate, event.created_at);

          data.push({
            prNumber: pr.number,
            title: pr.title,
            numberOfDays: diff,
          });
        }
      }
    }

    return data;
  }
}

export function dateDiff(startDate: string, endDate: string): number {
  const startsOn = new Date(startDate).getTime();
  const endsOn = new Date(endDate).getTime();

  const diff = Math.abs(endsOn - startsOn);
  const diffInDays = Math.floor(diff/(24 * 60 * 60 * 1000));

  return diffInDays;
}