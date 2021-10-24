import { getLastCursor } from './helpers';
import { createGithubClient } from "./clients";
import * as queries from "./queries";
import { IData, IRepositoryEdge } from "./types";

export const getRepoCount = async (token: string, name: string) => {
  const githubClient = createGithubClient(token);

  try {
    const data = await githubClient.request(queries.getRepoCount(name));
    
    if (data && data.user && data.user.repositories && data.user.repositories.totalCount) {
      return data.user.repositories.totalCount;
    }

    throw new Error("Received data does not contain the repo count");
  } catch (err) {
    throw err;
  }
}

export const getReposStats = async (token: string, name: string) => {
  const githubClient = createGithubClient(token);

  try {
    let check = 0;
    let repositories: IRepositoryEdge[] = [];
    let after = "null";
    while (true && check<100) {
      check++;
      const data: IData = await githubClient.request(queries.getReposStats(name, after));
      repositories = [...repositories, ...data.user.repositories.edges];
      const {cursor, position} = getLastCursor(data);
      if (position===99) {
        after = `"${cursor}"`;
      } else {
        break;
      }
    }
    return repositories;
  } catch (err) {
    console.log(err);
    throw err;
  }
}