import { Home, ArrowRightLeft, Send, Menu, User } from "lucide-react";
import "../style/MobileFooter.css";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

export default function MobileFooter() {
  return (
    <nav className="bottomNav">
      <NavItem icon={<Home size={20} strokeWidth={1} />} label="Home" to="/" />
      <NavItem icon={<ArrowRightLeft size={20} strokeWidth={1} />} label="Transactions" to="/transactionslist" />
      <NavItem icon={<Send size={20} strokeWidth={1} />} label="Payment" to="/payment" center />
      <NavItem icon={<User size={20} strokeWidth={1} />} label="TatraShare" to="/groups" />
      <NavItem icon={<Menu size={20} strokeWidth={1} />} label="More" to="/more" />
    </nav>
  );
}

interface NavItemProps {
  icon: ReactNode;
  label?: string;
  to: string;
  center?: boolean;
}

function NavItem({ icon, label, to, center }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `navItem ${isActive ? "active" : ""} ${center ? "center" : ""}`
      }
    >
      {icon}
      {label && <span>{label}</span>}
    </NavLink>
  );
}