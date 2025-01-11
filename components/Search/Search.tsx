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
  background-color: rgb(255, 255, 255);
  border: 1px solid #222222;
  border-radius: 8px;
  box-sizing: border-box;
  color: rgb(34, 34, 34);
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  padding: 10px 15px;
  width: 400px;
  max-width: 100%;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  text-align: left;
  user-select: text;

  &:focus {
    border-color: rgb(0, 0, 0);
    box-shadow: rgb(34, 34, 34) 0 0 0 2px;
  }

  &::placeholder {
    color: rgb(170, 170, 170);
  }

  &:disabled {
    border-color: rgb(221, 221, 221);
    color: rgb(221, 221, 221);
    background-color: rgb(247, 247, 247);
  }
`;
