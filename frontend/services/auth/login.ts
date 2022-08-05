import { useMutation } from '@tanstack/react-query';

import axios from 'libs/axios';

type TData = {
  email: string;
  password: string;
};

async function login(data: TData) {
  if(data !== undefined){
    const resp = await axios.post('/auth/login', data);
    return resp;
  }
  else{
    return null
  }
}

// Not being used anymore
function useLogin() {
  return useMutation(login);
}

export default login;
