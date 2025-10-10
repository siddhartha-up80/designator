interface BackgroundImageProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundImage({
  src,
  className = "",
  children,
}: BackgroundImageProps) {
  return (
    <div
      className={`${className} bg-cover bg-center bg-no-repeat`}
      style={
        { "--bg-image": `url("${src}")` } as React.CSSProperties & {
          "--bg-image": string;
        }
      }
    >
      <style jsx>{`
        div {
          background-image: var(--bg-image);
        }
      `}</style>
      {children}
    </div>
  );
}
