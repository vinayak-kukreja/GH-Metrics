import { Octokit } from '@octokit/rest';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

const octokit = new Octokit();
// type CreateLabelResponseType = GetResponseTypeFromEndpointMethod<
//   typeof octokit.issues.createLabel
// >;
export type ListIssuesForRepoDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.issues.listForRepo
>;

export type ListTimelineForIssueDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.issues.listEventsForTimeline
>;

export class Metrics {
  owner: string;
  repo: string;
  token: string;
  client: Octokit;

  constructor(owner: string, repo: string, token: string) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;

    this.client = new Octokit({
      auth: this.token,
    });
  }

  public async getAllPrsAndIssues(): Promise<[ListIssuesForRepoDataType, ListIssuesForRepoDataType]> {
    const allItems = await this.client.paginate(
      this.client.rest.issues.listForRepo, {
        owner: this.owner,
        repo: this.repo,
        per_page: 100,
      });

    const prs = this.getAllPrs(allItems);
    const issues = this.getAllIssues(allItems);

    return [prs, issues];
  }

  private getAllIssues(allIssues: ListIssuesForRepoDataType): ListIssuesForRepoDataType {
    return allIssues.filter((issue) => !issue.pull_request);
  }

  // All PRs are Issues but not all Issues are PRs
  private getAllPrs(allIssues: ListIssuesForRepoDataType): ListIssuesForRepoDataType {
    return allIssues.filter((issue) => issue.pull_request);
  }

  public async getIssueTimeline(issueNumber: number): Promise<ListTimelineForIssueDataType> {
    const timeline = await this.client.paginate(
      this.client.rest.issues.listEventsForTimeline, {
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        per_page: 100,
      });

    return timeline;
  }

  public getClient() {
    return this.client;
  }
}