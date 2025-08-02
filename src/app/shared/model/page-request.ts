import { HclPageEvent, HclSort} from "@hacon/hcl";

export interface PageRequest {
  pageNumber: number,
  pageSize: number,
  sort: {
    'direction': string
    'properties': string[]
  }
}

export function buildPageRequest(pageEvent: HclPageEvent, pageSort: HclSort): PageRequest {
  return {
    pageNumber: pageEvent.page - 1,
    pageSize: pageEvent.pageSize,
    sort: {
      direction: pageSort.direction?.toUpperCase() ?? 'ASC',
      properties: new Array(pageSort.sortBy ?? 'id')
    }
  };
}
