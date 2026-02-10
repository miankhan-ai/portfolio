import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSkills() {
  return useQuery({
    queryKey: [api.skills.list.path],
    queryFn: async () => {
      const res = await fetch(api.skills.list.path);
      if (!res.ok) throw new Error("Failed to fetch skills");
      const data = await res.json();
      return api.skills.list.responses[200].parse(data);
    },
  });
}
