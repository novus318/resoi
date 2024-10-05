import Container from "@/components/Container";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Herosection from "@/components/Herosection";
import Navbar from "@/components/Navbar";
import OrderSection from "@/components/OrderSection";
import StepSection from "@/components/StepSection";

export default function Home() {
  return (
 <>
 <Navbar/>
 <Container>
<Herosection/>
<StepSection/>
<FaqSection/>
<OrderSection/>
 </Container>
 <Footer/>
 </>
  );
}
