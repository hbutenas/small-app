import {
  BeakerIcon,
  CogIcon,
  HomeIcon,
  ChartBarIcon,
  DesktopComputerIcon,
  ServerIcon,
  UserGroupIcon,
  ViewBoardsIcon,
  LogoutIcon
} from '@heroicons/react/outline';

import {signOut} from "next-auth/react"
import { MouseEventHandler } from 'react';

interface SideBarProps {
  icon: any;
  text?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>,
}

const Sidebar = () => {
  return (
    <div
      className="fixed top-0 left-0 flex h-screen w-16 flex-col
                  bg-white shadow-lg "
    >
      <SideBarIcon icon={<HomeIcon />} text={'Home'} />
      <Divider />
      <SideBarIcon icon={<DesktopComputerIcon />} text={'Dashboard'} />
      <SideBarIcon icon={<ViewBoardsIcon />} text={'Boards'} />
      <SideBarIcon icon={<ServerIcon />} text={'Servers'} />
      <SideBarIcon icon={<UserGroupIcon />} text={'Users'} />
      <SideBarIcon icon={<ChartBarIcon />} text={'Analytics'} />
      <Divider />
      <SideBarIcon icon={<CogIcon />} text={'Settings'} />
      <SideBarIcon icon={<LogoutIcon />} text={'Logout'} onClick={() => signOut()} />
    </div>
  );
};

const SideBarIcon = (props: SideBarProps) => (
  <a onClick={props.onClick !== undefined? props.onClick : () => {}}>
  <div className="sidebar-icon group">
    {props.icon}
    <span className="sidebar-tooltip group-hover:scale-100">{props.text}</span>
  </div>
  </a>
);

const Divider = () => <hr className="sidebar-hr" />;

const defaultObjects: SideBarProps = {
  icon: <BeakerIcon />,
  text: 'This is a tooltip',
};

SideBarIcon.defaultProps = defaultObjects;

export default Sidebar;
