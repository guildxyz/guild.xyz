import { userOptions } from "@/lib/options";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => useQuery(userOptions());
