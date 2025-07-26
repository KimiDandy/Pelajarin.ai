// /components/shared/QueryStateHandler.tsx
import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface QueryStateHandlerProps<TData> {
  query: UseQueryResult<TData, Error>;
  children: (data: TData) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

export function QueryStateHandler<TData>({ 
  query, 
  children, 
  loadingComponent,
  errorComponent 
}: QueryStateHandlerProps<TData>) {
  if (query.isLoading) {
    return loadingComponent || <LoadingState />;
  }
  
  if (query.isError) {
    return errorComponent || <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }
  
  if (query.data) {
    return <>{children(query.data)}</>;
  }
  
  return null;
}
