"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";

interface AuthLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: "/sign-in" | "/sign-up";
  paramsAsCallback?: boolean;
}

const AuthLink: FC<AuthLinkProps> = ({
  href,
  className,
  scroll = false,
  children,
  paramsAsCallback,
  ...props
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = paramsAsCallback
    ? searchParams.get("callbackUrl") ?? "/"
    : pathname;

  return (
    <Link
      href={{ pathname: href, query: { callbackUrl: callbackUrl } }}
      className={className}
      scroll={scroll}
      {...props}
    >
      {children}
    </Link>
  );
};

export default AuthLink;
