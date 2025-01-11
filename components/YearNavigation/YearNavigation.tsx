import styled from 'styled-components';

type YearNavigationProps = {
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
};

export default function YearNavigation({ setCurrentYear }: YearNavigationProps) {
  const handlePreviousYear = () => setCurrentYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setCurrentYear((prevYear) => prevYear + 1);

  return (
    <StyledYearNavigation>
      <StyledCalendarButton onClick={handlePreviousYear}>Prev Year</StyledCalendarButton>
      <StyledCalendarButton onClick={handleNextYear}>Next Year</StyledCalendarButton>
    </StyledYearNavigation>
  );
}

const StyledYearNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const StyledCalendarButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
`;
