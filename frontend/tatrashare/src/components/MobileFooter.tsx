import "../style/MobileFooter.css";
import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import HomeIcon from "../assets/icons/HomeIcon";
import TransactionIcon from "../assets/icons/TransactionIcon";
import SendIcon from "../assets/icons/SendIcon";
import GroupsIcon from "../assets/icons/GroupsIcon";
import MenuIcon from "../assets/icons/MenuIcon";

export default function MobileFooter() {
  return (
    <nav className="bottomNav">
      <NavItem icon={<HomeIcon />} label="Home" to="/" />
      <NavItem icon={<TransactionIcon />} label="Transactions" to="/transactionslist" />
      <NavItem icon={<SendIcon />} label="Payment" to="/payment" center />
      <NavItem icon={<GroupsIcon />} label="TatraShare" to="/groups" />
      <NavItem icon={<MenuIcon />} label="More" to="/more" />
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
      {label && <p>{label}</p>}
    </NavLink>
  );
}