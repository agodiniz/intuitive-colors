"use client";

import { useEffect, useState } from "react";
import namer from "color-namer";
import chroma from "chroma-js";

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { ChevronsUpDown, Lock } from "lucide-react";
import { Button } from "../ui/button";

const generatePalette = (inputColor: string) => {
  const palette: { [key: string]: string } = {};

  const scale = chroma
    .scale([
      chroma(inputColor).brighten(2.5),
      inputColor,
      chroma(inputColor).darken(2),
    ])
    .mode("lab")
    .colors(11);

  const labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  labels.forEach((label, i) => {
    palette[label] = scale[i];
  });

  palette[500] = chroma(inputColor).hex();

  return palette;
};

const getColorInFormat = (color: string, format: string) => {
  switch (format) {
    case "rgb":
      return chroma(color).css(); // Retorna em formato RGB
    case "hsl":
      const hsl = chroma(color).hsl();
      return `hsl(${Math.round(hsl[0])}, ${Math.round(
        hsl[1] * 100
      )}%, ${Math.round(hsl[2] * 100)}%)`; // Retorna em formato HSL
    case "hex":
    default:
      return chroma(color).hex(); // Retorna em formato HEX
  }
};

export default function ColorPalette() {
  const [inputColor, setInputColor] = useState<string>(""); // Cor inicial
  const [colorScale, setColorScale] = useState<{ [key: string]: string }>({});
  const [colorName, setColorName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const [format, setFormat] = useState<string>("hex"); // Estado para controlar o formato

  const { toast } = useToast();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const generateColorScale = (color: string) => {
    try {
      const scale = generatePalette(color);
      setColorScale(scale);

      const colorNames = namer(color).pantone[0].name;
      setColorName(colorNames);

      setError("");
    } catch (error) {
      setError("Cor inválida. Por favor, insira um valor HEX válido.");
    }
  };

  useEffect(() => {
    generateColorScale(inputColor);
  }, [inputColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputColor(newColor);
    generateColorScale(newColor);
  };

  const handleCopyColor = (color: string) => {
    const formattedColor = getColorInFormat(color, format);
    navigator.clipboard.writeText(formattedColor).then(() => {
      setCopiedColor(formattedColor);
      toast({
        title: `${formattedColor} copied to clipboard!`,
        duration: 3000,
      });
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  useEffect(() => {
    const randomColor = chroma.random().hex();
    setInputColor(randomColor);
    generateColorScale(randomColor);
  }, []);

  const handleFormatChange = (value: string) => {
    setFormat(value); // Atualiza o formato
    setInputColor(getColorInFormat(inputColor, value)); // Converte a cor para o novo formato // Converte a cor para o novo formato
  };

  return (
    <div className="max-w-5xl px-6 pb-12 mx-auto space-y-8">
      <div className="flex justify-center items-center gap-2">
        <div className="relative flex justify-center items-center w-full sm:max-w-[446px]">
          <div className="absolute left-3">
            <div
              id="color-picker-wrapper"
              className={`rounded-full border-2 border-background cursor-pointer transition-all duration-200 ${
                isFocused ? "ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: inputColor,
                boxShadow: isFocused ? `0 0 0 2px ${inputColor}` : "none",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              tabIndex={0}
            >
              <input
                type="color"
                value={inputColor}
                onChange={handleColorChange}
                className="w-full h-full opacity-0 cursor-pointer"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* DropdownMenu para selecionar formato */}
          <div className="absolute right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-full">
                  {format.toUpperCase()}
                  <ChevronsUpDown width={16} height={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                <DropdownMenuLabel>Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={format}
                  onValueChange={handleFormatChange}
                >
                  <DropdownMenuRadioItem value="hex" className="cursor-pointer">
                    HEX
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rgb" className="cursor-pointer">
                    RGB
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="hsl" className="cursor-pointer">
                    HSL
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Input
            value={inputColor}
            onChange={handleColorChange}
            placeholder="Enter HEX, RGB, or HSL"
            className="font-semibold w-full h-[54px] pl-12 rounded-full shadow-2xl border-gray-100 hover:border-gray-200"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-gray-600">
          {colorName}
        </h4>
        <div className="grid grid-cols-1 w-full h-24 sm:grid-cols-11 gap-1">
          {Object.entries(colorScale).map(([key, color]) => {
            const textColor =
              Number(key) <= 500 ? colorScale["900"] : colorScale["50"];
            const hexValue = chroma(color).hex();

            const isInputColor =
              hexValue.toLowerCase() === inputColor.toLowerCase();
            const isCopiedColor = hexValue === copiedColor;

            return (
              <div key={key} className="text-center">
                <Button
                  className="w-full h-24 rounded-lg cursor-pointer relative shadow-none"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(hexValue)}
                >
                  <div className="flex flex-col h-full justify-end items-center gap-1">
                    {isInputColor && (
                      <div
                        className="relative flex items-center justify-center"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                      >
                        {!hovered && (
                          <Lock width={16} style={{ color: textColor }} />
                        )}
                        {hovered && (
                          <p
                            className="text-xs font-semibold capitalize"
                            style={{ color: textColor }}
                          >
                            Locked
                          </p>
                        )}
                      </div>
                    )}
                    <p
                      className="text-sm font-semibold"
                      style={{ color: textColor }}
                    >
                      {`${key}`}
                    </p>
                    <p
                      className="text-[11px] uppercase sm:text-[9.5px] md:text-[11px] md:w-[62px] md:truncate"
                      style={{ color: textColor }}
                    >
                      {getColorInFormat(hexValue, format)}
                    </p>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
