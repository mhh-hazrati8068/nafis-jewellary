import HeroSection from "@/components/home/HeroSection";
import FeaturesRow from "@/components/home/FeaturesRow";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import PackagingShowcase from "@/components/home/PackagingShowcase";
import SocialCampaignSection from "@/components/home/SocialCampaignSection";
import BrandStory from "@/components/home/BrandStory";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesRow />
      <CategoryGrid />
      <ProductCarousel />
      <PackagingShowcase />
      <SocialCampaignSection />
      <BrandStory />
    </>
  );
}

