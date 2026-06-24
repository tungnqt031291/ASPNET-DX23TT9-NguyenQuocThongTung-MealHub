import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { PaginationResults } from '../_models/pagination';
import { PaginationParams } from '../_models/payloads/pagination-params';
import { getHttpOptions } from './http-headers-helper';

export function getPaginatedResults<T>(
  this: any,
  url: string,
  params: HttpParams,
  http: HttpClient
) {
  const paginatedResult: PaginationResults<T> = new PaginationResults<T>();

  return http
    .get<T>(url, {
      ...getHttpOptions(),
      observe: 'response',
      params,
    })
    .pipe(
      map((response) => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
}

function setDefaultParams(paginationParams: {
  offset: number;
  itemsPerPage: number;
}) {
  let params = new HttpParams();

  params = params.append('offset', paginationParams.offset);
  params = params.append('pageSize', paginationParams.itemsPerPage);
  return params;
}

export function getPaginationRecipesHeaders(recipeParams: {
  offset: number;
  itemsPerPage: number;
  mostRecent: boolean;
  category: string;
}) {
  let params = setDefaultParams(recipeParams);
  params = params.append('mostRecent', recipeParams.mostRecent);
  params = params.append('category', recipeParams.category);
  return params;
}

export function getPaginationMessagesHeaders(messageParams: {
  offset: number;
  itemsPerPage: number;
}) {
  let params = setDefaultParams(messageParams);
  return params;
}
