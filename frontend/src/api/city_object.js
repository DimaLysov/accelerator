const BASE_URL = process.env.REACT_APP_PATH_URL_API;


export const getCityObjects = async () => {
    const response = await fetch(`${BASE_URL}/city_object/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных городских объектов');
    }
    return await response.json();
  };