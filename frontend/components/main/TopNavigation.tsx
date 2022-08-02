import {
  SearchIcon,
  BellIcon,
  UserCircleIcon,
  HashtagIcon,
} from '@heroicons/react/solid';

const TopNavigation = () => {
  return (
    <div className="top-navigation ml-16">
      <Title />
      <Search />
      <BellIcon className="top-navigation-icon" />
      <UserCircleIcon className="top-navigation-icon" />
    </div>
  );
};

const Search = () => (
  <div className="search">
    <input className="search-input" type="text" placeholder="Search..." />
    <SearchIcon className="top-navigation-icon my-auto text-primary" />
  </div>
);

const Title = () => <h5 className="title-text pl-5">Small Application</h5>;

export default TopNavigation;
