import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useLocationToCoordinates from "../hooks/useLocationToCoordinates";
import useWeatherData from "../hooks/useWeatherData";
import usePromptToLocation from "../hooks/usePromptToLocation";
import WeatherDescript from "./WeahterDescript";

const useApiRequests = (prompt) => {
  const [error, setError] = useState(null);
  const [promptData, setPromptData] = useState({});
  const [locationData, setLocationData] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [weatherDescription, setWeatherDescription] = useState(null);

  // Fetch location and weather data from API.
  useEffect(() => {
    const fetchData = async () => {
      if (!prompt) return; // return if prompt is null or undefined

      try {
        const promptDataRes = await usePromptToLocation(prompt);
        setPromptData(promptDataRes);

        const locationDataRes = await useLocationToCoordinates(
          promptDataRes.locationString
        );
        setLocationData(locationDataRes);

        const weatherDataRes = await useWeatherData(locationDataRes);
        setWeatherData(weatherDataRes);

        const weatherDescriptRes = await WeatherDescript(
          prompt,
          weatherDataRes
        );
        setWeatherDescription(weatherDescriptRes);
      } catch (error) {
        setError(error);
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [prompt]); // run effect when `prompt` changes

  return { error, promptData, locationData, weatherData, weatherDescription };
};

useApiRequests.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default useApiRequests;