const BASE_URL = process.env.REACT_APP_PATH_URL_API;


export const getObjectTypes = async () => {
    const response = await fetch(`${BASE_URL}/object_type/`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных видов объектов');
    }
    return await response.json();
  };