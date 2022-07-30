import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it('/countries (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/countries')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(1);
      });
  });
  it('/holidays (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/holidays')
      .query({ countryCode: 'est', year: '2020' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(1);
      });
  });
  it('/holidays (GET) 400', () => {
    return request(app.getHttpServer())
      .get('/holidays')
      .query({ countryCode: 'est' })
      .expect(400)
      .expect('Content-Type', /json/);
  });
});
