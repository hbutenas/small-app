import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';

import axios from 'libs/axios';

type TData = {
  email: string;
  password: string;
};

async function register(data: TData) {
  const resp = await axios.post('/auth/register', data);
  if(resp.status !== 422){
    signIn("credentials", data)
  }
  return resp.data;
}

function useRegister() {
  return useMutation(register);
}

export default useRegister;
