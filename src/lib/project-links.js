export function projectPath(id) {
  return `/projects/${id}`;
}

export function visibleLinks(project) {
  const links = [...(project.links || [])];
  const github = String(project.github || "").trim();
  if (github && !links.some((link) => link.href === github)) {
    links.push({ label: "GitHub", href: github });
  }
  return links;
}
