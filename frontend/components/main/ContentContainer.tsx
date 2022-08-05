import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect } from 'react';

interface containerProps {
  children: any;
}

const ContentContainer = (props: containerProps) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'loading') {
      Router.push('/login');
    }
  }, [status]);



  if (status !== 'authenticated') {
    return (
      <div className="h-screen w-full text-center">
        <div className="lds-ripple m-80">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex">
        <Sidebar />
        <div className="content-container">
          <TopNavigation />
          <div style={{ height: 'calc(100vh - 4rem' }} className="pl-16">
            {props.children}
          </div>
        </div>
      </div>
    );
  }
};

export default ContentContainer;
