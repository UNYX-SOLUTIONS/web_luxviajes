import { IsNotEmpty, IsString, IsNumber, Min, Max, IsEmail, IsOptional, IsArray, ValidateNested, IsIn, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  givenName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  middleName?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  surname: string;

  @IsNotEmpty()
  @IsString()
  merchantCustomerId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  identificationDocId: string;

  @IsOptional()
  @IsString()
  identificationDocType?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  @MaxLength(25)
  phone: string;

  @IsOptional()
  @IsString()
  ip?: string;
}

class BillingDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  street1: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['EC', 'CL', 'US', 'AR', 'CO', 'PE', 'MX'])
  country: string;
}

class TaxesDto {
  @IsNumber()
  @Min(0)
  base0: number;

  @IsNumber()
  @Min(0)
  baseImp: number;

  @IsNumber()
  @Min(0)
  iva: number;
}

class ItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateCheckoutDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => BillingDto)
  billing: BillingDto;

  @ValidateNested()
  @Type(() => TaxesDto)
  taxes: TaxesDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items?: ItemDto[];

  @IsOptional()
  @IsString()
  @IsIn(['00', '02', '03'], { message: 'Tipo de crédito no habilitado' })
  creditType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(36)
  installments?: number;

  @IsOptional()
  shipping?: BillingDto;

  @IsOptional()
  createRegistration?: boolean;
}