import {
  FaFacebook,
  FaLinkedinIn,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

export interface ShareData {
  text?: string;
  title?: string;
  url?: string;
}

interface IconProps {
  name: SocialIconListKeys;
  data: Required<ShareData>;
  onClick?: () => any;
}

const SocialIcon = ({ name, data, onClick }: IconProps) => {
  const { icon, bgColor, handleExternalLinkClick } = SocialIconList[name];

  const handleClick = () => {
    onClick && onClick();
    handleExternalLinkClick(
      encodeURIComponent(data.url),
      data.text,
      data.title,
    );
  };

  return (
    <button
      onClick={handleClick}
      aria-label={name}
      className="flex aspect-square h-12 w-12 items-center justify-center rounded-xl p-1 text-white"
      style={{ background: bgColor }}
    >
      {icon}
    </button>
  );
};

interface IconItem {
  icon: JSX.Element;
  handleExternalLinkClick: (
    link: string,
    text: string,
    title: string,
  ) => Window | null;
  bgColor: string;
}

const IconList = [
  "facebook",
  "x",
  "whatsapp",
  "reddit",
  "telegram",
  "linkedin",
  "mail",
] as const;

export type SocialIconListKeys = (typeof IconList)[number];

type IconListObject = {
  [key in SocialIconListKeys]: IconItem;
};

const externalOpen = (URL: string) => window.open(URL, "_blank", "noopener");

export const SocialIconList: IconListObject = {
  facebook: {
    icon: <FaFacebook className="h-8 w-8" />,
    bgColor: "#0076FB",
    handleExternalLinkClick: (l) =>
      externalOpen(`https://www.facebook.com/sharer/sharer.php?u=${l}`),
  },

  x: {
    icon: <FaXTwitter className="h-8 w-8" />,
    bgColor: "#000000",
    handleExternalLinkClick: (l, t) =>
      externalOpen(`https://twitter.com/intent/tweet?text=${t}&url=${l}`),
  },
  whatsapp: {
    icon: <FaWhatsapp className="h-9 w-9" />,
    bgColor: "#25D366",
    handleExternalLinkClick: (l, t) =>
      externalOpen(`https://api.whatsapp.com/send?text=${t} ${l}`),
  },
  reddit: {
    icon: <FaReddit className="h-8 w-8" />,
    bgColor: "#FF4500",
    handleExternalLinkClick: (l, t) =>
      externalOpen(`https://www.reddit.com/submit?url=${l}&title=${t}`),
  },
  telegram: {
    icon: (
      <FaTelegram className="h-9 w-9 rounded-full bg-white fill-[#0088CC]" />
    ),
    bgColor: "#ffffff",
    handleExternalLinkClick: (l, t) =>
      externalOpen(`https://telegram.me/share/msg?url=${l}&text=${t}`),
  },
  linkedin: {
    icon: <FaLinkedinIn className="h-7 w-7" />,
    bgColor: "#0073b1",
    handleExternalLinkClick: (l, t, ti) =>
      externalOpen(
        `https://www.linkedin.com/shareArticle?mini=true&url=${l}&title=${ti}&summary=${t}`,
      ),
  },
  mail: {
    icon: <IoMdMail className="h-8 w-8" />,
    bgColor: "#E53E3E",
    handleExternalLinkClick: (l, t) =>
      externalOpen(`mailto:?body=${l}&subject=${t}`),
  },
};

export default SocialIcon;
