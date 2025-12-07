const BASE_URL = process.env.REACT_APP_PATH_URL_API;


export const getEvents = async () => {
    const response = await fetch(`${BASE_URL}/event/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных городских событий');
    }
    return await response.json();
  };

export const getEventsByDate = async (start_date, end_date) => {
    const response = await fetch(`${BASE_URL}/event/by_date/?start=${start_date}&end=${end_date}`); // Пример даты: 08-10-2025
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных городских событий');
    }
    return await response.json();
  };

export const getProfessionalEvents = async () => {
    const response = await fetch(`${BASE_URL}/event/get_professional_events/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных профессиональных событий');
    }
    return await response.json();
  };

export const getСustomEvents = async () => {
    const response = await fetch(`${BASE_URL}/event/get_custom_event/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных пользовательских событий');
    }
    return await response.json();
  };