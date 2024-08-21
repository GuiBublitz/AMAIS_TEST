import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsDateString()
  data_nascimento?: string;

  @IsOptional()
  @IsEnum(['Masculino', 'Feminino', 'Outro'])
  sexo?: string;

  @IsOptional()
  @IsEnum(['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'Outro'])
  estado_civil?: string;

  @IsOptional()
  @IsString()
  escolaridade?: string;

  @IsOptional()
  @IsString()
  cursos_especializacoes?: string;

  @IsOptional()
  @IsString()
  experiencia_profissional?: string;

  @IsOptional()
  @IsNumber()
  pretencao_salarial?: number;
}
