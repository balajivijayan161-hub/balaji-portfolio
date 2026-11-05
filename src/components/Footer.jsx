import { footer, profile, socials } from "../data/portfolio.js";
import { SocialLink } from "./SocialIcons.jsx";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-white">{profile.name}</p>
          <p className="mt-1 max-w-md text-sm text-muted">{footer.note}</p>
          <p className="mt-3 text-sm text-muted">
            © {year} {profile.name}
          </p>
        </div>
        <ul className="flex items-center gap-3">
          {socials.map((item) => (
            <li key={item.id}>
              <SocialLink {...item} />
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
