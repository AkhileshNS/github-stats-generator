import { IData, IRepositoryEdge } from './types';

interface ILastCursor {
  cursor: string;
  position: number;
}

export const getLastCursor = (data: IData): ILastCursor => {
  const edges = data.user.repositories.edges;
  const cursor = edges[edges.length-1].cursor;
  return {
    cursor,
    position: edges.length - 1
  }
} 

interface IProcessedData {
  repoCount: number;
  totalSize: number;
  languages: {
    [key: string]: number;
  },
  tools: {
    [key: string]: number;
  }
}

function roundTo(n: number, digits: number) {
  if (digits === undefined) {
      digits = 0;
  }

  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  return Math.round(n) / multiplicator;
}

const filterOutForkedRepos = (repos: IRepositoryEdge[]) => 
  repos.filter(repo => !repo.node.isFork)

const filterOutReposWithNoLanguages = (repos: IRepositoryEdge[]) => 
  repos.filter(repo => repo.node.languages.edges.length>0);

const filterOutReposWithNoTools = (repos: IRepositoryEdge[]) => 
  repos.filter(repo => repo.node.repositoryTopics.nodes.length>0);

const getTotalSize = (repos: IRepositoryEdge[]) => 
  repos.reduce((running, currRepo) => 
    running + currRepo.node.languages.totalSize, 0);

const getLanguageStats = (repos: IRepositoryEdge[]) => {
  const languageSizes: {[key: string]: number} = {};
  repos.forEach(repo => 
    repo.node.languages.edges.forEach(language => {
      const name = language.node.name;
      const size = language.size;
      languageSizes[name] = (name in languageSizes ? languageSizes[name] : 0) + size/repo.node.languages.totalSize;
    })
  )
  const languages: {[key: string]: number} = {};
  for (let language in languageSizes) {
    languages[language] = roundTo((languageSizes[language]/repos.length)*100, 2);
  }
  return languages;
}

const getToolStats = (repos: IRepositoryEdge[]) => {
  const toolSizes: {[key: string]: number} = {};
  let totalToolCount = 0;
  repos.forEach(repo =>
    repo.node.repositoryTopics.nodes.forEach(tool => {
      const name = tool.topic.name;
      toolSizes[name] = (name in toolSizes ? toolSizes[name] : 0) + 1;
      totalToolCount++;
    }) 
  );
  const tools: {[key: string]: number} = {};
  for (let tool in toolSizes) {
    tools[tool] = roundTo((toolSizes[tool]/totalToolCount)*100, 2);
  }
  return tools;
}

export const processData = (repos: IRepositoryEdge[]): IProcessedData => {
  /* Step 1: Filter out all repositories that are forked */
  const filteredRepos = filterOutForkedRepos(repos);
  const repoCount = filteredRepos.length;
  /* Step 2: Reduce through filteredRepos to get totalSize */
  const totalSize = getTotalSize(filteredRepos);
  /* Step 3: Generate language stats basedon the totalSize */
  const filteredReposWithLanguages = filterOutReposWithNoLanguages(filteredRepos);
  const languages = getLanguageStats(filteredReposWithLanguages);
  const filteredReposWithTools = filterOutReposWithNoTools(filteredRepos);
  const tools = getToolStats(filteredReposWithTools);
  return {repoCount, totalSize, languages, tools}
}