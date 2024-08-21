import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ type: 'date' })
  data_nascimento: string;

  @Column({ type: 'enum', enum: ['Masculino', 'Feminino', 'Outro'] })
  sexo: string;

  @Column({
    type: 'enum',
    enum: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'Outro'],
  })
  estado_civil: string;

  @Column()
  escolaridade: string;

  @Column({ type: 'text', nullable: true })
  cursos_especializacoes: string;

  @Column({ type: 'text', nullable: true })
  experiencia_profissional: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pretencao_salarial: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
