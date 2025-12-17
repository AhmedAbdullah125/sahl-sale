'use client';
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiConfig";
import { useQuery } from "@tanstack/react-query";
const fetchHome = async (lang) => {
  const token = localStorage.getItem("token");
  const headers = { "accept-language": lang, };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get(`${API_BASE_URL}/home`,
    { headers }
  );
  return response.data.data;
}

export const useGetHome = (lang) => {

  const query = useQuery({
    queryKey: ["home" + lang],
    queryFn: () => fetchHome(lang),
    staleTime: 1000 * 60, // 1 minute (adjust as you want)
    cacheTime: 1000 * 60 * 5,
  });

  return query;
};
