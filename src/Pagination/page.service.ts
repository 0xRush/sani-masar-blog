import { FindOptionsWhere, Repository } from "typeorm";
import { GenericFilter } from "./generic-filter";
import { SortOrder } from "./sort-order.enum";

export class PageService {
  protected createOrderQuery(filter: GenericFilter) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;
      return order;
    }

    return order;
  }

  protected async paginate<T>(
    repository: Repository<T>,
    filter: GenericFilter,
    where: FindOptionsWhere<T>,
  ) {
    
    const page = Number.isInteger(filter.page) ? filter.page : 1;
    const pageSize = Number.isInteger(filter.pageSize) ? filter.pageSize : 3;

    const [data, totalItems] = await repository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (page - 1) * (pageSize + 1),
      take: pageSize,
      where: where,
    });

    const totalPages = Math.floor(totalItems / pageSize);

    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
  
}