import axios from 'axios';
import Constants from 'expo-constants';


const { TMDB_ACCESS_TOKEN } = Constants.expoConfig.extra;

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
  },
  
  params: {
    language: 'pt-BR'
  }
});

export default api;