"use client";

import { useEffect, useState } from "react";
import namer from "color-namer";
import chroma from "chroma-js";

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { Lock } from "lucide-react";

// Função para determinar a posição na paleta com base na luminosidade
const determinePositionInScale = (l: number) => {
  if (l >= 90) return 50;
  if (l >= 80) return 100;
  if (l >= 70) return 200;
  if (l >= 60) return 300;
  if (l >= 50) return 400;
  if (l >= 40) return 500;
  if (l >= 30) return 600;
  if (l >= 20) return 700;
  if (l >= 10) return 800;
  return 900;
};

// Função para gerar a paleta de cores com chroma.js, incluindo o inputColor na escala
const generatePalette = (inputColor: string) => {
  const palette: { [key: string]: string } = {};

  // Gera uma escala usando chroma.js, interpolando cores ao redor do inputColor
  const scale = chroma
    .scale([
      chroma(inputColor).brighten(2),
      inputColor,
      chroma(inputColor).darken(2),
    ])
    .mode("lab") // Modo de interpolação suave
    .colors(10); // Gera 9 cores (para 100-900)

  // Mapear cada cor gerada para uma chave de 100 a 900
  const labels = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  labels.forEach((label, i) => {
    palette[label] = scale[i];
  });

  // Adiciona explicitamente o inputColor no nível 500
  palette[500] = chroma(inputColor).hex();

  return palette;
};

// Função para validar se a cor do input está na paleta
const validateInputColor = (
  inputColor: string,
  scale: { [key: string]: string }
): boolean => {
  const inputColorHex = chroma(inputColor).hex(); // Usa chroma.js para converter para HEX

  // Verifica se a cor de input está na escala
  return Object.values(scale).some(
    (color) => chroma(color).hex() === inputColorHex
  );
};

export default function ColorPalette() {
  const [inputColor, setInputColor] = useState<string>(""); // Cor inicial
  const [colorScale, setColorScale] = useState<{ [key: string]: string }>({});
  const [colorName, setColorName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);

  const { toast } = useToast();

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Função para gerar a escala de cores
  const generateColorScale = (color: string) => {
    try {
      const scale = generatePalette(color); // Gera a paleta de cores com chroma.js
      setColorScale(scale); // Atualiza a paleta

      // Obter o nome da cor usando color-namer
      const colorNames = namer(color).pantone[0].name; // Pega o primeiro nome da lista
      setColorName(colorNames); // Define o nome da cor no estado

      setError("");
    } catch (error) {
      setError("Cor inválida. Por favor, insira um valor HEX válido.");
    }
  };

  // Gera a escala inicial de cores ao montar o componente
  useEffect(() => {
    generateColorScale(inputColor);
  }, [inputColor]);

  // Função para lidar com a mudança do color picker
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputColor(newColor);
    generateColorScale(newColor); // Gera a nova escala de cores
  };

  // Função para copiar a cor ao clicar na paleta
  const handleCopyColor = (hexValue: string) => {
    navigator.clipboard.writeText(hexValue).then(() => {
      setCopiedColor(hexValue); // Define a cor copiada

      // Exibe o toast quando a cor for copiada
      toast({
        title: `${hexValue} copiado para a área de transferência!`,
        duration: 3000,
      });

      setTimeout(() => setCopiedColor(null), 2000); // Remove o aviso após 2 segundos
    });
  };

  useEffect(() => {
    // Gerar cor aleatória ao carregar a página
    const randomColor = chroma.random().hex();
    setInputColor(randomColor); // Define a cor inicial
    generateColorScale(randomColor); // Gera a escala de cores
  }, []);

  return (
    <div className="max-w-5xl px-6 pb-12 mx-auto space-y-8">
      <div className="flex justify-center items-center gap-2">
        <div className="relative flex justify-center items-center w-full sm:max-w-[446px]">
          <div className="absolute left-3">
            <div
              id="color-picker-wrapper"
              className={`rounded-full border-2 border-background p-2 transition-all duration-200 ${
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
                className="w-[28px] h-[28px] opacity-0 cursor-pointer"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <Input
            value={inputColor}
            onChange={handleColorChange}
            placeholder="Enter HEX, RGB, or HSL"
            className="font-semibold w-full h-[54px] pl-12 rounded-full shadow-2xl border-gray-100"
          />
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-4 w-full">
        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-gray-600">
          {colorName}
        </h4>
        <div className="grid grid-cols-1 w-full h-24 sm:grid-cols-9 gap-1">
          {Object.entries(colorScale).map(([key, color]) => {
            const textColor =
              Number(key) <= 400 ? colorScale["900"] : colorScale["50"];

            const hexValue = chroma(color).hex(); // Converter para HEX usando chroma.js

            // Comparar a cor HEX da paleta com o inputColor
            const isInputColor =
              hexValue.toLowerCase() === inputColor.toLowerCase();

            // Verificar se esta cor é a que foi copiada
            const isCopiedColor = hexValue === copiedColor;

            return (
              <div key={key} className="text-center">
                <div
                  className="w-full h-24 rounded-lg cursor-pointer relative"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(hexValue)}
                >
                  <div className="flex flex-col h-full justify-end items-center gap-1 pb-3">
                    {isInputColor && (
                      <div
                        className="relative flex items-center justify-center"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                      >
                        {!hovered && (
                          <Lock width={16} style={{ color: textColor }} />
                        )}
                        {/* Tooltip - "Locked" aparece quando hover */}
                        {hovered && (
                          <p
                            className="text-[11px] capitalize sm:text-[9.5px] md:text-[11px]"
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
                      className="text-[11px] uppercase sm:text-[9.5px] md:text-[11px]"
                      style={{ color: textColor }}
                    >
                      {`${hexValue}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
