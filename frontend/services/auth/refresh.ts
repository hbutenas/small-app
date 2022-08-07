import axios from 'libs/axios';



async function refresh(data: any) {
  if(data !== undefined){
    const resp = await axios.post('/auth/refresh', data);
    return resp;
  }
  else{
    return null
  }
}

export default refresh;
