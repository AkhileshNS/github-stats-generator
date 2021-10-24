import {gql} from 'graphql-request';

export const getRepoCount = (name: string) => gql`
query {
  user(login: "${name}") {
    repositories {
      totalCount
    }
  }
}
`;

export const getReposStats = (
  name: string, 
  after: string = "null"
) => gql`
query { 
  user(login: "${name}") {
    repositories(first: 100, after: ${after}) {
      edges {
        cursor
        node {
          isFork
          repositoryTopics(first: 100) {
          	nodes {
            	topic {
              	name
            	}
          	}
        	}
          languages(first: 100) {
          	totalSize
          	edges {
            	node {
              	name
            	}
            	size
          	}
        	}
        }
      }
    }
  }
}
`;