import ColorPalette from "@/components/color-palette/color-palette";
import { Container } from "@/components/container";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container>
        <div className="flex flex-col items-center container mx-auto p-8">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-700 max-w-80">
            Color Generator to Interfaces
          </h1>
          <p className="text-lg font-medium text-muted-foreground text-center max-w-96">
            Create custom color palettes for use in application and interfaces.
          </p>
        </div>
        <ColorPalette />
      </Container>
    </>
  );
}
