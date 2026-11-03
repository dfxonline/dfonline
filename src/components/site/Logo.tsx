import { Link } from "@tanstack/react-router";
import badge from "@/assets/logo-badge.png";
import footerLogo from "@/assets/logo-footer.png";

/** Logo do header: selo DF + "ONLINE" com a mesma altura de letra do "DF". */
export function HeaderLogo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="DF Online — página inicial">
      <img src={badge} alt="" width={364} height={190} className="h-11 w-auto md:h-14" />
      <span className="font-display text-[34px] font-medium leading-none tracking-tight text-brand md:text-[43px]">
        ONLINE
      </span>
    </Link>
  );
}

/** Logo do rodapé em PNG, com "ONLINE" branco. */
export function FooterLogo() {
  return (
    <Link to="/" aria-label="DF Online — página inicial">
      <img src={footerLogo} alt="DF Online" width={1014} height={191} className="h-12 w-auto" loading="lazy" />
    </Link>
  );
}
