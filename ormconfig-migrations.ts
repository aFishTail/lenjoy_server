import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'lenjoy',
  entities: ['dist/**/*.entity{.ts,.js}'], // maybe you should also consider chage it to something like:  [__dirname + '/**/*.entity.ts', __dirname + '/src/**/*.entity.js']
  migrations: ['src/migration/*{.ts,.js}'],
  //   cli: {
  //     migrationsDir: 'src/migration',
  //   },
  synchronize: true,
};
