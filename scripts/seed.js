import { resetFromSeed } from '../src/services/task.service.js';

await resetFromSeed();
console.log('data/tasks.json, data/tasks.seed.json dosyasından yeniden oluşturuldu.');
