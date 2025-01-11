import styled from 'styled-components';

type NavigationProps = {
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  currentMonth: number;
};

export default function Navigation({ year, currentMonth, setCurrentMonth, setCurrentYear }: NavigationProps) {
  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = (prev + 1) % 12;
      return nextMonth;
    });

    setCurrentYear((prevYear) => {
      if (currentMonth === 11) {
        return prevYear + 1;
      }
      return prevYear;
    });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = (prev - 1 + 12) % 12;
      return prevMonth;
    });
    setCurrentYear((prevYear) => {
      if (currentMonth === 0) {
        return prevYear - 1;
      }
      return prevYear;
    });
  };

  const handlePreviousYear = () => setCurrentYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);

  return (
    <StyledNavigation>
      <StyledNavigationButtons onClick={handlePreviousYear}>&#60; &#60;</StyledNavigationButtons>
      <StyledNavigationButtons onClick={handlePreviousMonth}>&#60;</StyledNavigationButtons>
      <StyledHeading>
        {new Date(year, currentMonth).toLocaleString('default', { month: 'long' })} {year}
      </StyledHeading>
      <StyledNavigationButtons onClick={handleNextMonth}>&#62;</StyledNavigationButtons>
      <StyledNavigationButtons onClick={handleNextYear}>&#62; &#62;</StyledNavigationButtons>
    </StyledNavigation>
  );
}

const StyledHeading = styled.h2`
  font-size: 24px;
  font-weight: 600;
  text-transform: capitalize;
`;

const StyledNavigation = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledNavigationButtons = styled.button`
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(34, 34, 34);
  border-radius: 8px;
  box-sizing: border-box;
  color: rgb(34, 34, 34);
  cursor: pointer;
  display: inline-block;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 13px 30px;
  position: relative;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow 0.2s, -ms-transform 0.1s, -webkit-transform 0.1s, transform 0.1s;
  user-select: none;
  width: auto;

  &:focus-visible {
    box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
    transition: box-shadow 0.2s;
  }

  &:active {
    background-color: rgb(247, 247, 247);
    border-color: rgb(0, 0, 0);
    transform: scale(0.96);
  }

  &:disabled {
    border-color: rgb(221, 221, 221);
    color: rgb(221, 221, 221);
    cursor: not-allowed;
    opacity: 1;
  }
`;
