import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator(): MatPaginatorIntl {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Filas por página:';
  customPaginatorIntl.nextPageLabel = 'Página siguiente';
  customPaginatorIntl.previousPageLabel = 'Página anterior';
  customPaginatorIntl.firstPageLabel = 'Primera página';
  customPaginatorIntl.lastPageLabel = 'Última página';

  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const cleanLength = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < cleanLength ? Math.min(startIndex + pageSize, cleanLength) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} de ${cleanLength}`;
  };

  return customPaginatorIntl;
}
