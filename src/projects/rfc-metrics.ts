import { Octokit } from '@octokit/rest';
import { ListIssuesForRepoDataType } from '../metrics';

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
   * Timelines for all PRs that were opened and merged and not closed
   */
  public completionTimelines() {

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
