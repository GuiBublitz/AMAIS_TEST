import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'CPF must be in the format XXX.XXX.XXX-XX',
  })
  cpf: string;

  @IsString()
  data_nascimento: string;

  @IsString()
  sexo: string;

  @IsString()
  estado_civil: string;

  @IsString()
  escolaridade: string;

  @IsString()
  cursos_especializacoes: string;

  @IsString()
  experiencia_profissional: string;

  @IsNumber()
  pretencao_salarial: number;
}
