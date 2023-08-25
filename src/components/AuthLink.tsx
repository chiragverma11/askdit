"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";

interface AuthLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  paramsAsCallback?: boolean;
}

const AuthLink: FC<AuthLinkProps> = ({
  href,
  className,
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
      {...props}
    >
      {children}
    </Link>
  );
};

export default AuthLink;
