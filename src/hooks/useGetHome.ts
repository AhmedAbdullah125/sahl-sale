'use client';
import axios from "axios";
import { API_BASE_URL } from "@/lib/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { HomeData } from "@/types/home";

const fetchHome = async (lang: string): Promise<HomeData> => {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = { "accept-language": lang };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await axios.get(`${API_BASE_URL}/home`, { headers });
  return response.data.data;
}


export const useGetHome = (lang: string) => {

  const query = useQuery({
    queryKey: ["home" + lang],
    queryFn: () => fetchHome(lang),
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5,
  });

  return query;
};
