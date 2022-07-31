import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CountriesController } from './countries/controllers/countries.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Holidays API')
    .setDescription('Get all holidays for a country/year, check specific dates')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  // on startup - check if countries are in the database and if not, fetch them
  await app.get(CountriesController).getCountries();
}
bootstrap();
