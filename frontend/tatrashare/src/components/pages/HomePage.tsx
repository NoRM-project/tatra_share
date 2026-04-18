import MobileHeader from "../MobileHeader";
import "../../style/HomePage.css"
import MobileFooter from "../MobileFooter";
import { Mail } from "lucide-react";
import Button from "../Button";
import ComponentsBlock from "../ComponentsBlock";

export default function HomePage() {
  return (
    <div>
      <MobileHeader
        left={<Mail color="#4da3ff" strokeWidth={1}/>}
        right={<Button hasBackground={false} text="Customize" />}
      />

      <section className="promo">
        <div className="promoCard">
          <span className="promoAmount">300 €</span>
          <p>Discover new <b>Investment</b> strategies and win up to EUR 300</p>
        </div>
      </section>

    
      <ComponentsBlock label="Accounts">
        <div className="accountCard">
          <div>
            <p className="label">Account balance</p>
            <h3>€12,540.20</h3>
          </div>
          <div className="chartMock" />
        </div>
      </ComponentsBlock>

      <ComponentsBlock label="Cards" button={<Button hasBackground={false} text="List of cards" />}>
        <div className="cardMock" />
        <p className="cardNumber">4400 **** **** 8888</p>
      </ComponentsBlock>

      <MobileFooter/>
    </div>
  );
}