import { Octokit } from '@octokit/rest';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';

/**
 *      * Timelines to completion for RFC
        * Abandoned RFCs
        * Average time between iterations from users
        * Average time between responses from us
        * Number of RFC received overtime
        * Rate of closure
        * Timeline of assigning bar raisers
        * Percentage of implementation for accepted RFCs
 */

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

  public async getAllIssues(): Promise<GetResponseDataTypeFromEndpointMethod<typeof this.client.issues.listForRepo>> {
    return this.client.paginate(this.client.rest.issues.listForRepo, {
      owner: this.owner,
      repo: this.repo,
      per_page: 100,
    });
  }

  public getClient() {
    return this.client;
  }
}