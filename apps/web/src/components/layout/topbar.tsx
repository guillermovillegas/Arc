import { CITY } from "@faineant/shared";

export function Topbar() {
  return (
    <div className="bg-bone-100 text-smoke-900 text-label uppercase tracking-[0.3em] font-medium px-4 py-2.5 flex items-center justify-center gap-4 text-center">
      <span>NOW IN {CITY.toUpperCase()}</span>
      <span className="w-1 h-1 rounded-full bg-smoke-900" aria-hidden />
      <span className="font-editorial italic font-normal text-[0.8125rem] tracking-normal normal-case">
        You don&apos;t have to leave the apartment.
      </span>
      <span className="w-1 h-1 rounded-full bg-smoke-900 hidden md:inline-block" aria-hidden />
      <span className="hidden md:inline">FREE 24-HR CANCELLATION</span>
    </div>
  );
}
