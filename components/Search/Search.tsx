import styled from 'styled-components';

type SearchProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export default function Search({ searchTerm, setSearchTerm }: SearchProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return <StyledSearchInput type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search tasks" />;
}

const StyledSearchInput = styled.input`
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;
