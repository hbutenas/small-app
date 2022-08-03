import { useMutation } from '@tanstack/react-query';

import axios from 'libs/axios';

type TData = {
  email: string;
  password: string;
};

async function login(data: TData) {
  const resp = await axios.post('/auth/login', data);
  return resp.data;
}

function useLogin() {
  return useMutation(login);
}

export default useLogin;
