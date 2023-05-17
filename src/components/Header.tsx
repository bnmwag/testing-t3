import { FC } from "react";

interface IHeaderProps {
  title: string;
  subtitle?: string;
}

const Header: FC<IHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="py-16">
      <h1 className="text-4xl font-normal tracking-tight">{title}</h1>
      <p className="mt-2 text-lg text-foreground/60">{subtitle}</p>
    </div>
  );
};

export default Header;
