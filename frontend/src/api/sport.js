const BASE_URL = process.env.REACT_APP_PATH_URL_API;


export const getSports = async () => {
    const response = await fetch(`${BASE_URL}/sport/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных спортов');
    }
    return await response.json();
  };