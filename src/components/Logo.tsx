import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "w-8 h-8", size = 32 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Ansar Tools Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
