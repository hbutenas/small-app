import { useMutation } from '@tanstack/react-query';

import axios from 'libs/axios';

type TData = {
  email: string;
  password: string;
};

async function register(data: TData) {
  const resp = await axios.post('/register', data);
  return resp.data;
}

function useRegister() {
  return useMutation(register);
}

export default useRegister;
