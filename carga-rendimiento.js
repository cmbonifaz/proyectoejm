// docker run --rm -i --network host -v $(pwd):/scripts grafana/k6 run /scripts/carga-rendimiento.js

import http from 'k6/http';
import { sleep, check } from 'k6';

const USERS = 50;
const BASE_URL = 'http://localhost:3000/api';

export const options = {
  stages: [
    { duration: '5s', target: Math.floor(USERS * 0.2) },
    { duration: '15s', target: USERS },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<0.8'],
    http_req_failed: ['rate<0.01'],
  }
};

function randomString() {
  return Math.random().toString(36).substring(2, 8);
}

export default function () {
  // GET Routes
  const pacientesRes = http.get(`${BASE_URL}/pacientes`);
  const doctoresRes = http.get(`${BASE_URL}/doctores`);
  const medicamentosRes = http.get(`${BASE_URL}/medicamentos`);
  const especialidadesRes = http.get(`${BASE_URL}/especialidades`);

  check(pacientesRes, {
    'GET pacientes 200': (r) => r.status === 200,
    'GET pacientes < 800ms': (r) => r.timings.duration < 800,
    'GET pacientes JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
  });

  check(doctoresRes, {
    'GET doctores 200': (r) => r.status === 200,
    'GET doctores < 800ms': (r) => r.timings.duration < 800,
  });

  check(medicamentosRes, {
    'GET medicamentos 200': (r) => r.status === 200,
    'GET medicamentos < 800ms': (r) => r.timings.duration < 800,
  });

  check(especialidadesRes, {
    'GET especialidades 200': (r) => r.status === 200,
    'GET especialidades < 800ms': (r) => r.timings.duration < 800,
  });

  // POST

  // Paciente
  const pacientePayload = JSON.stringify({
    name: 'Juan',
    lastName: 'Perez',
    email: `juan.${randomString()}@mail.com`,
    gender: 'Masculino',
    illness: 'Gripe'
  });

  const pacienteRes = http.post(`${BASE_URL}/pacientes`, pacientePayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(pacienteRes, {
    'POST paciente 201': (r) => r.status === 201 || r.status === 200,
    'POST paciente < 800ms': (r) => r.timings.duration < 800,
  });

  // Doctor
  const doctorPayload = JSON.stringify({
    name: 'Ana',
    lastName: 'Lopez',
    specialty: 'Cardiología',
    phone: '0999999999',
    email: `ana.${randomString()}@mail.com`,
    licenseNumber: `LIC-${randomString()}`
  });

  const doctorRes = http.post(`${BASE_URL}/doctores`, doctorPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(doctorRes, {
    'POST doctor 201': (r) => r.status === 201 || r.status === 200,
    'POST doctor < 800ms': (r) => r.timings.duration < 800,
  });

  // Medicamento
  const medicamentoPayload = JSON.stringify({
    name: 'Paracetamol',
    description: 'Analgésico',
    price: 2.5,
    quantity: 100,
    category: 'Analgésicos',
    laboratory: 'Genfar'
  });

  const medicamentoRes = http.post(`${BASE_URL}/medicamentos`, medicamentoPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(medicamentoRes, {
    'POST medicamento 201': (r) => r.status === 201 || r.status === 200,
    'POST medicamento < 800ms': (r) => r.timings.duration < 800,
  });

  // Especialidad
  const especialidadPayload = JSON.stringify({
    name: `Traumatología-${randomString()}`
  });

  const especialidadRes = http.post(`${BASE_URL}/especialidades`, especialidadPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(especialidadRes, {
    'POST especialidad 201': (r) => r.status === 201 || r.status === 200,
    'POST especialidad < 800ms': (r) => r.timings.duration < 800,
  });


  sleep(1);
}
