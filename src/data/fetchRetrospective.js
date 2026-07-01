export async function fetchRetrospective(linkno) {
    const url =
      `https://geoglows.ecmwf.int/api/v2/retrospectivedaily/${linkno}` +
      `?format=json&start_date=19400101`;
  
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  
    return await response.json();
  }