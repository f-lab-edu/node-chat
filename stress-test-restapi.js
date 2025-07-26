import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const res = http.get('http://localhost:8000/chatrooms/list', {
    cookies: {
      SESSION: 'ZDFjNWYxMDctOWU0NC00M2RkLWFmMDMtMjA1M2MyYmUxMzU2',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('new Date: ', new Date());
  check(res, { 'status is 200': (res) => res.status === 200 });
  sleep(1);
}
