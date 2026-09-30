/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Priority =
  | 'HIGH'
  | 'LOW'
  | 'MEDIUM';

export type TaskStatus =
  | 'DONE'
  | 'IN_PROGRESS'
  | 'TODO';

export type GetTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTasksQuery = { tasks: Array<{ id: string, title: string, description: string | null, status: TaskStatus, priority: Priority }> };


export const GetTasksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]} as unknown as DocumentNode<GetTasksQuery, GetTasksQueryVariables>;