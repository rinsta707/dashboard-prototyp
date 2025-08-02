export interface Page {
    "content": [],
    "pageable": {
    "pageNumber": number,
      "pageSize": number,
      "sort": {
      "empty": boolean,
        "unsorted": boolean,
        "sorted": boolean
    },
    "offset": number,
      "unpaged": boolean,
      "paged": boolean
  },
    "last": boolean,
    "totalElements": number,
    "totalPages": number,
    "size": number,
    "number": number,
    "sort": {
    "empty": boolean,
      "unsorted": boolean,
      "sorted": boolean
  },
    "numberOfElements": 0,
    "first": boolean,
    "empty": boolean
}
