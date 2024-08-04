import {
  AlertCircle,
  AlignJustify,
  ArrowBigDown,
  ArrowBigUp,
  ArrowDownToLine,
  ArrowLeft,
  BadgeCheck,
  BadgeMinus,
  Ban,
  Bell,
  BookmarkMinus,
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Dot,
  ExternalLink,
  Flame,
  GalleryHorizontalEnd,
  Home,
  ImageIcon,
  Info,
  Link,
  Link2,
  Loader,
  LogOut,
  LucideProps,
  Maximize2,
  MessageSquare,
  MessageSquareText,
  MessagesSquare,
  Minimize2,
  Monitor,
  MoonStar,
  MoreHorizontal,
  PenSquare,
  Pencil,
  QrCode,
  Reply,
  Rows2,
  Rows3,
  Search,
  Settings,
  Sun,
  Trash,
  UploadCloud,
  User,
  X,
  XCircle,
} from "lucide-react";
import { FaBellSlash, FaPlus } from "react-icons/fa6";
import { RxGithubLogo } from "react-icons/rx";
import { TbShare3 } from "react-icons/tb";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      width="90.584mm"
      height="88.423mm"
      version="1.1"
      viewBox="0 0 90.584 88.423"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect
            x="30.785"
            y="133.68"
            width="32.572"
            height="30.421"
            ry="2.8217"
            fill="#e83b3b"
          />
        </clipPath>
      </defs>
      <g transform="translate(-83.933 -53.998)">
        <g
          transform="matrix(3.4442 0 0 3.4442 -33.005 -414.2)"
          clipPath="url(#a)"
        >
          <path
            d="m46.576 147.07-5.5783 12.681-7.0458-1.2e-4 8.5506-22.558z"
            fill="#ec3c3d"
            strokeWidth=".265"
          />
          <path
            d="m49.072 135.94 11.181 25.673-7.6781-1e-3 -10.072-24.416 0.48275-1.2525z"
            fill="#f9f8fd"
            strokeWidth=".26458"
          />
        </g>
      </g>
    </svg>
  ),
  logoWithText: (props: LucideProps) => (
    <svg
      width="90.711mm"
      height="27.04mm"
      version="1.1"
      viewBox="0 0 90.711 27.04"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect
            x="30.785"
            y="133.68"
            width="32.572"
            height="30.421"
            ry="2.8217"
            fill="#e83b3b"
          />
        </clipPath>
      </defs>
      <g transform="translate(-396.14 -130.2)">
        <g
          transform="matrix(.94931 0 0 1.0532 363.91 -12.977)"
          clipPath="url(#a)"
        >
          <path
            d="m46.576 147.07-5.5783 12.681-7.0458-1.2e-4 8.5506-22.558z"
            fill="#ec3c3d"
            strokeWidth=".265"
          />
          <path
            d="m49.072 135.94 11.181 25.673-7.6781-1e-3 -10.072-24.416 0.48275-1.2525z"
            fill="#f9f8fd"
            strokeWidth=".26458"
          />
        </g>
        <path
          d="m427.65 155.33c-1.2877 0-2.5038-0.23505-3.6485-0.70516-1.1242-0.49055-2.0542-1.165-2.79-2.0235l2.3914-2.4221c1.022 1.1446 2.3608 1.7169 4.0164 1.7169 1.3286 0 1.9928-0.36791 1.9928-1.1037 0-0.40879-0.18396-0.72561-0.55187-0.95044-0.34747-0.22483-0.80735-0.40879-1.3797-0.55187-0.57231-0.16351-1.1753-0.33725-1.8089-0.52121-0.63363-0.20439-1.2366-0.45989-1.8089-0.76648-0.55187-0.32703-1.0118-0.76648-1.3797-1.3184-0.34747-0.57231-0.52121-1.3081-0.52121-2.2075 0-1.4103 0.51099-2.5345 1.533-3.3725 1.022-0.85846 2.4119-1.2877 4.1697-1.2877 1.2264 0 2.3301 0.21461 3.3112 0.64384 1.0015 0.42923 1.8293 1.0731 2.4834 1.9315l-2.4221 2.4221c-0.44967-0.55187-0.96065-0.95044-1.533-1.1957-0.55187-0.24527-1.1548-0.36791-1.8089-0.36791-1.2264 0-1.8396 0.34747-1.8396 1.0424 0 0.36791 0.17374 0.65406 0.52121 0.85846 0.36791 0.20439 0.8278 0.38835 1.3797 0.55186 0.57231 0.14308 1.1753 0.31682 1.8089 0.52121 0.63363 0.18396 1.2264 0.44967 1.7782 0.79714 0.57231 0.32703 1.0322 0.78692 1.3797 1.3797 0.36791 0.57231 0.55186 1.3081 0.55186 2.2075 0 1.4716-0.52121 2.6265-1.5636 3.4645-1.0424 0.83802-2.463 1.257-4.2616 1.257zm8.5233-0.33725v-22.167h4.0164v14.165l5.396-6.8064h4.6296l-5.8253 7.0516 6.1319 7.7568h-4.9055l-5.4267-7.2049v7.2049zm21.523 0.30659c-1.3286 0-2.5141-0.33725-3.5565-1.0118-1.0424-0.69495-1.8702-1.6147-2.4834-2.7593-0.59275-1.165-0.88912-2.4732-0.88912-3.9244s0.29637-2.7593 0.88912-3.9244c0.61319-1.165 1.441-2.0848 2.4834-2.7593 1.0424-0.69494 2.2279-1.0424 3.5565-1.0424 0.94022 0 1.7782 0.16352 2.5141 0.49055 0.73582 0.32703 1.3592 0.77669 1.8702 1.349v-8.8912h3.9857v22.167h-3.9857v-1.5023c-0.51099 0.55187-1.1344 0.99132-1.8702 1.3184-0.73583 0.32703-1.5738 0.49054-2.5141 0.49054zm0.88912-3.7711c1.1037 0 1.9929-0.36791 2.6674-1.1037 0.67451-0.75627 1.0118-1.7272 1.0118-2.9126 0-1.165-0.33725-2.1155-1.0118-2.8513-0.6745-0.75627-1.5636-1.1344-2.6674-1.1344-1.1037 0-2.0031 0.37813-2.698 1.1344-0.6745 0.73582-1.0118 1.6965-1.0118 2.882 0 1.165 0.33725 2.1257 1.0118 2.882 0.69495 0.73582 1.5943 1.1037 2.698 1.1037zm11.007 3.4645v-14.808h4.047v14.808zm9.7803 0v-11.283h-3.4645v-3.5258h3.4645v-6.1625h4.0164v6.1625h3.4645v3.5258h-3.4645v11.283z"
          fill="#f9f8fd"
          strokeWidth=".32901"
          style={{ whiteSpace: "pre" }}
          aria-label="skdit"
        />
        <path
          d="m471.62 137.79c-0.65407 0-1.1957-0.21461-1.625-0.64384-0.42923-0.44967-0.64384-1.0015-0.64384-1.6556 0-0.63363 0.21461-1.1753 0.64384-1.625s0.97088-0.6745 1.625-0.6745c0.65406 0 1.1957 0.22483 1.6249 0.6745s0.64384 0.99132 0.64384 1.625c0 0.65406-0.21461 1.2059-0.64384 1.6556-0.42923 0.42923-0.97088 0.64384-1.6249 0.64384z"
          fill="#ec3c3d"
          strokeWidth=".32901"
          style={{ whiteSpace: "pre" }}
        />
      </g>
    </svg>
  ),
  logoWithDarkText: (props: LucideProps) => (
    <svg
      width="90.711mm"
      height="27.04mm"
      version="1.1"
      viewBox="0 0 90.711 27.04"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <clipPath id="a">
          <rect
            x="30.785"
            y="133.68"
            width="32.572"
            height="30.421"
            ry="2.8217"
            fill="#e83b3b"
          />
        </clipPath>
      </defs>
      <g transform="translate(-396.14 -130.2)">
        <g>
          <g
            transform="matrix(.94931 0 0 1.0532 363.91 -12.977)"
            clipPath="url(#a)"
          >
            <path
              d="m46.576 147.07-5.5783 12.681-7.0458-1.2e-4 8.5506-22.558z"
              fill="#ec3c3d"
              strokeWidth=".265"
            />
            <path
              d="m49.072 135.94 11.181 25.673-7.6781-1e-3 -10.072-24.416 0.48275-1.2525z"
              fill="#f9f8fd"
              strokeWidth=".26458"
            />
          </g>
          <path
            d="m427.65 155.33c-1.2877 0-2.5038-0.23505-3.6485-0.70516-1.1242-0.49055-2.0542-1.165-2.79-2.0235l2.3914-2.4221c1.022 1.1446 2.3608 1.7169 4.0164 1.7169 1.3286 0 1.9928-0.36791 1.9928-1.1037 0-0.40879-0.18396-0.72561-0.55187-0.95044-0.34747-0.22483-0.80735-0.40879-1.3797-0.55187-0.57231-0.16351-1.1753-0.33725-1.8089-0.52121-0.63363-0.20439-1.2366-0.45989-1.8089-0.76648-0.55187-0.32703-1.0118-0.76648-1.3797-1.3184-0.34747-0.57231-0.52121-1.3081-0.52121-2.2075 0-1.4103 0.51099-2.5345 1.533-3.3725 1.022-0.85846 2.4119-1.2877 4.1697-1.2877 1.2264 0 2.3301 0.21461 3.3112 0.64384 1.0015 0.42923 1.8293 1.0731 2.4834 1.9315l-2.4221 2.4221c-0.44967-0.55187-0.96065-0.95044-1.533-1.1957-0.55187-0.24527-1.1548-0.36791-1.8089-0.36791-1.2264 0-1.8396 0.34747-1.8396 1.0424 0 0.36791 0.17374 0.65406 0.52121 0.85846 0.36791 0.20439 0.8278 0.38835 1.3797 0.55186 0.57231 0.14308 1.1753 0.31682 1.8089 0.52121 0.63363 0.18396 1.2264 0.44967 1.7782 0.79714 0.57231 0.32703 1.0322 0.78692 1.3797 1.3797 0.36791 0.57231 0.55186 1.3081 0.55186 2.2075 0 1.4716-0.52121 2.6265-1.5636 3.4645-1.0424 0.83802-2.463 1.257-4.2616 1.257zm8.5233-0.33725v-22.167h4.0164v14.165l5.396-6.8064h4.6296l-5.8253 7.0516 6.1319 7.7568h-4.9055l-5.4267-7.2049v7.2049zm21.523 0.30659c-1.3286 0-2.5141-0.33725-3.5565-1.0118-1.0424-0.69495-1.8702-1.6147-2.4834-2.7593-0.59275-1.165-0.88912-2.4732-0.88912-3.9244s0.29637-2.7593 0.88912-3.9244c0.61319-1.165 1.441-2.0848 2.4834-2.7593 1.0424-0.69494 2.2279-1.0424 3.5565-1.0424 0.94022 0 1.7782 0.16352 2.5141 0.49055 0.73582 0.32703 1.3592 0.77669 1.8702 1.349v-8.8912h3.9857v22.167h-3.9857v-1.5023c-0.51099 0.55187-1.1344 0.99132-1.8702 1.3184-0.73583 0.32703-1.5738 0.49054-2.5141 0.49054zm0.88912-3.7711c1.1037 0 1.9929-0.36791 2.6674-1.1037 0.67451-0.75627 1.0118-1.7272 1.0118-2.9126 0-1.165-0.33725-2.1155-1.0118-2.8513-0.6745-0.75627-1.5636-1.1344-2.6674-1.1344-1.1037 0-2.0031 0.37813-2.698 1.1344-0.6745 0.73582-1.0118 1.6965-1.0118 2.882 0 1.165 0.33725 2.1257 1.0118 2.882 0.69495 0.73582 1.5943 1.1037 2.698 1.1037zm11.007 3.4645v-14.808h4.047v14.808zm9.7803 0v-11.283h-3.4645v-3.5258h3.4645v-6.1625h4.0164v6.1625h3.4645v3.5258h-3.4645v11.283z"
            // fill="#262626"
            fill="#333"
            strokeWidth=".32901"
            style={{ whiteSpace: "pre" }}
            aria-label="skdit"
          />
          <path
            d="m471.62 137.79c-0.65407 0-1.1957-0.21461-1.625-0.64384-0.42923-0.44967-0.64384-1.0015-0.64384-1.6556 0-0.63363 0.21461-1.1753 0.64384-1.625s0.97088-0.6745 1.625-0.6745c0.65406 0 1.1957 0.22483 1.6249 0.6745s0.64384 0.99132 0.64384 1.625c0 0.65406-0.21461 1.2059-0.64384 1.6556-0.42923 0.42923-0.97088 0.64384-1.6249 0.64384z"
            fill="#ec3c3d"
            strokeWidth=".32901"
            style={{ whiteSpace: "pre" }}
          />
        </g>
      </g>
    </svg>
  ),
  loader: Loader,
  github: RxGithubLogo,
  backArrow: ArrowLeft,
  settings: Settings,
  blocked: Ban,
  alignJustify: AlignJustify,
  dot: Dot,
  link: Link,
  externalLink: ExternalLink,
  imageIcon: ImageIcon,
  maximize: Maximize2,
  message: MessageSquare,
  minimize: Minimize2,
  moreHorizontal: MoreHorizontal,
  qrCode: QrCode,
  share: TbShare3,
  plus: FaPlus,
  flame: Flame,
  home: Home,
  penSquare: PenSquare,
  close: X,
  closeCircle: XCircle,
  downvote: ArrowBigDown,
  upvote: ArrowBigUp,
  edit: Pencil,
  chevronDown: ChevronDown,
  info: Info,
  link2: Link2,
  bookmarkPlus: BookmarkPlus,
  bookmarkMinus: BookmarkMinus,
  trash: Trash,
  messages: MessagesSquare,
  search: Search,
  notification: Bell,
  user: User,
  logout: LogOut,
  card: Rows2,
  compact: Rows3,
  uploadCloud: UploadCloud,
  dropFiles: ArrowDownToLine,
  check: Check,
  alertCircle: AlertCircle,
  galleryHorizontalEnd: GalleryHorizontalEnd,
  mark: BadgeCheck,
  unMark: BadgeMinus,
  acceptedAnswer: CircleCheckBig,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  system: Monitor,
  light: Sun,
  dark: MoonStar,
  noNotifications: FaBellSlash,
  comment: MessageSquareText,
  reply: Reply,
};
