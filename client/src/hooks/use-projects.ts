import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { staticProjects } from "@/data/projects";

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.projects.list.path);
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        return api.projects.list.responses[200].parse(data);
      } catch {
        // Fallback to static data when API is unavailable (e.g. static hosting)
        return staticProjects;
      }
    },
    // Use static data as placeholder while fetching
    placeholderData: staticProjects,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: [api.projects.get.path, slug],
    queryFn: async () => {
      try {
        const url = buildUrl(api.projects.get.path, { slug });
        const res = await fetch(url);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        return api.projects.get.responses[200].parse(data);
      } catch {
        // Fallback to static data
        return staticProjects.find((p) => p.slug === slug) || null;
      }
    },
    enabled: !!slug,
  });
}
