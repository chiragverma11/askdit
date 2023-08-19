"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface AuthLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const AuthLink: FC<AuthLinkProps> = ({
  href,
  className,
  children,
  ...props
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={{ pathname: href, query: { callbackUrl: pathname } }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AuthLink;
