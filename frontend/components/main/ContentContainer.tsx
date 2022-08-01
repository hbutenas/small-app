import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';

interface containerProps {
  children: any;
}

const ContentContainer = (props: containerProps) => {
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
};

export default ContentContainer;
