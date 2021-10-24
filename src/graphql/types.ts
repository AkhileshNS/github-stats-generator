interface ILanguageEdge {
  node: {
    name: string;
  },
  size: number;
}

interface IRepositoryTopicNode {
  topic: {
    name: string;
  }
}

export interface IRepositoryEdge {
  cursor: string;
  node: {
    isFork: boolean,
    repositoryTopics: {
      nodes: IRepositoryTopicNode[]
    },
    languages: {
      totalSize: number;
      edges: ILanguageEdge[];
    }
  }
}

export interface IData {
  user: {
    repositories: {
      edges: IRepositoryEdge[],
    }
  }
}