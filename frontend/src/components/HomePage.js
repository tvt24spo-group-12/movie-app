import PopularCarousel from "./popularCarousel";
import TrendingCarousel from "./trendingCarousel";
import UpcomingCarousel from "./upcomingCarousel";
import InTheaters from "./inTheaters";

export default function HomePage() {
  return (
    <>
      <InTheaters />
      <PopularCarousel />
      <TrendingCarousel />
      <UpcomingCarousel />
    </>
  );
}
