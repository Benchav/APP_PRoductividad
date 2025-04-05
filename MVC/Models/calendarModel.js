let selectedDate = null;

const calendarModel = {
  getSelectedDate: () => selectedDate,

  setSelectedDate: (date) => {
    selectedDate = date;
  },
};

export default calendarModel;