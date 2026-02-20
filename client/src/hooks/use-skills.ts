import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { staticSkills } from "@/data/skills";

export function useSkills() {
  return useQuery({
    queryKey: [api.skills.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.skills.list.path);
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        return api.skills.list.responses[200].parse(data);
      } catch {
        // Fallback to static data when API is unavailable (e.g. static hosting)
        return staticSkills;
      }
    },
    // Use static data as placeholder while fetching
    placeholderData: staticSkills,
  });
}
