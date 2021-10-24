import { IData } from './types';

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