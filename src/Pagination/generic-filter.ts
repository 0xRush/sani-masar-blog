import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { SortOrder } from './sort-order.enum';
import { Transform } from 'class-transformer';

export class GenericFilter {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    public page: number = 1;
  
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    public pageSize: number = 9;
  
    @IsOptional()
    @IsString()
    public orderBy?: string;
  
    @IsEnum(SortOrder)
    @IsOptional()
    public sortOrder?: SortOrder = SortOrder.DESC;

    @IsOptional()
    public searchString?: string;
  }