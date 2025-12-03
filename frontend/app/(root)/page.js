import Certifications from "@/components/Home/Certifications";
import Collections from "@/components/Home/Collections";
import HomePageProducts from "@/components/Home/HomePageProducts";
import KeyProduct from "@/components/Home/KeyProduct";
import PromotionalBanners from "@/components/Home/PromotionalBanners";
import Testimonials from "@/components/Home/Testimonials";
import UserProductCard from "@/components/Products/UserProductCard";
export default function Home() {

  
  return (
    <div className="">
      {/* Section 1 */}
      <PromotionalBanners />

  
      <Collections />


      {/* Section 3
      <div>Reels</div> */}
        

      {/* Section 4 */}
      <KeyProduct />

      {/* Section 5 */}
      <div><HomePageProducts /></div>

      {/* Section 6 */}
      <div><Testimonials /></div>

      <Certifications />

    </div>
  )
}