import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import classesServices from "../services/classes/classes";

function useClasses(params = {}) {
  const { user } = useAuth();

  const userId = user?._id ?? user?.userId;

  const query = useQuery({
    queryKey: ["classes", userId, params],

    queryFn: async () => {
      const response = await classesServices.getClasses(params);

      return response?.data ?? [];
    },

    enabled: Boolean(userId),
    staleTime: 0,
  });

  return {
    classes: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useClasses;
