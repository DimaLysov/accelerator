const BASE_URL = process.env.REACT_APP_PATH_URL_API;


export const getEvents = async () => {
    const response = await fetch(`${BASE_URL}/event/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных городских событий');
    }
    return await response.json();
  };

export const getEventsByDate = async (date) => {
    const response = await fetch(`${BASE_URL}/event/by_date/?date=${date}`); // Пример даты: 08-10-2025
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных городских событий');
    }
    return await response.json();
  };