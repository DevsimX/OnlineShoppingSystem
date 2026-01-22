import Link from "next/link";

type PaginationProps = {
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  baseUrl?: string;
  queryParam?: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

export default function Pagination({
  hasNext,
  hasPrevious,
  currentPage,
  baseUrl,
  queryParam,
  onNext,
  onPrevious,
}: PaginationProps) {
  if (!hasNext && !hasPrevious) return null;

  const buildUrl = (page: number) => {
    if (!baseUrl) return "#";
    if (queryParam) {
      return `${baseUrl}?${queryParam}&page=${page}`;
    }
    return `${baseUrl}?page=${page}`;
  };

  const PaginationButton = ({ onClick, href, children, className = "" }: { onClick?: () => void; href?: string; children: React.ReactNode; className?: string }) => {
    const buttonClass = "flex items-center justify-center uppercase tracking-wide font-trade-gothic font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-pop-red-accent text-white hover:bg-pop-teal-mid border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full";
    
    if (onClick) {
      return (
        <button onClick={onClick} className={`${buttonClass} ${className}`}>
          {children}
        </button>
      );
    }
    
    return (
      <Link href={href || "#"} className={`${buttonClass} ${className}`}>
        {children}
      </Link>
    );
  };

  return (
    <div className="flex w-full items-center gap-6">
      <div className="flex gap-2">
        {hasPrevious && (
          <PaginationButton onClick={onPrevious} href={!onPrevious ? buildUrl(currentPage - 1) : undefined}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              className="h-5 w-5 mr-2 rotate-180"
            >
              <path
                d="M3.33337 10.5H16.6667M16.6667 10.5L11.6667 5.5M16.6667 10.5L11.6667 15.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </PaginationButton>
        )}
      </div>
      <div className="ml-auto">
        {hasNext && (
          <PaginationButton onClick={onNext} href={!onNext ? buildUrl(currentPage + 1) : undefined} className="ml-4">
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              className="h-5 w-5 ml-2"
            >
              <path
                d="M3.33337 10.5H16.6667M16.6667 10.5L11.6667 5.5M16.6667 10.5L11.6667 15.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PaginationButton>
        )}
      </div>
    </div>
  );
}
