import ColorPalette from "@/components/color-palette/color-palette";
import Topbar from "@/components/topbar/topbar";

export default function Home() {
  return (
    <div className="">
      <Topbar />
      <div className="flex flex-col items-center container mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-700 max-w-80">
          Tailwind CSS Color Generator
        </h1>
        {/* <p className="text-lg font-medium text-muted-foreground text-center max-w-96">
          Press spacebar, enter a hexcode or change the HSL values to create a
          custom color scale
        </p> */}
        <p className="text-lg font-medium text-muted-foreground text-center max-w-96">
        Create custom color palettes for use in application Tailwind.
        </p>
      </div>
      <ColorPalette />
    </div>
  );
}
