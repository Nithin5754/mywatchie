
url="https://api.unsplash.com/search/photos?query=watches&client_id=bxUf9gFsl10X1zfeO2ftVK9dhI9j3W5XABdJD8TZK0A"


const genericFunction = async (url) => {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return [data, null]
  } catch (error) {
    return [null, error]

  }
}



const fetchData = async () => {
  const [data, error] = await genericFunction(url)
  if (data) {
    console.log(data)
    return;
  }
  console.log(error);







}

fetchData()
