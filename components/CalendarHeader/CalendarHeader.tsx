import styled from 'styled-components';

type CalendarHeaderProps = {
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  currentMonth: number;
};

export default function CalendarHeader({ year, currentMonth, setCurrentMonth, setCurrentYear }: CalendarHeaderProps) {
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

  return (
    <StyledCalendarHeader>
      <StyledCalendarButton onClick={handlePreviousMonth}>Previous Month</StyledCalendarButton>
      <h2>
        {new Date(year, currentMonth).toLocaleString('default', { month: 'long' })} {year}
      </h2>
      <StyledCalendarButton onClick={handleNextMonth}>Next Month</StyledCalendarButton>
    </StyledCalendarHeader>
  );
}

const StyledCalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    text-transform: capitalize;
  }
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
