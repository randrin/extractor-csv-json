/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parser';

async function bootstrap() {
  const specialityFilter = 'Oculista'; // 👈 Change this to your desired speciality name
  const speciality_id = '681b0442ba2fa557807aa298'; // 👈 Change this to your desired speciality id
  const testNames = new Set();
  const filePath = join(process.cwd(), 'src', 'source', 'test_specialties.csv');

  const getRandomHexColor = () => {
    return (
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
    );
  };
  const getRandomDuration = (min = 10, max = 30) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row['Specialty'] && row['Test Name']) {
        if (row['Specialty'].trim() === specialityFilter) {
          testNames.add(row['Test Name'].trim());
        }
      }
    })
    .on('end', () => {
      const output = Array.from(testNames).map((name) => ({
        label: name,
        color: getRandomHexColor(),
        duration: getRandomDuration(),
        speciality_id: `${speciality_id}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      console.log(JSON.stringify(output, null, 2));

      // Optional: Save to file
      // fs.writeFileSync('filtered_tests.json', JSON.stringify(output, null, 2));
    });

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
