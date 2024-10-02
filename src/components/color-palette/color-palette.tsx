"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { Lock } from "lucide-react";

// Função para converter Hex para HSL
const hexToHSL = (hex: string) => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((h) => h + h)
      .join("");
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const rPercent = r / 255;
  const gPercent = g / 255;
  const bPercent = b / 255;

  const max = Math.max(rPercent, gPercent, bPercent);
  const min = Math.min(rPercent, gPercent, bPercent);
  let h: number | undefined = 0;
  let s: number | undefined = 0;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rPercent:
        h = (gPercent - bPercent) / d + (gPercent < bPercent ? 6 : 0);
        break;
      case gPercent:
        h = (bPercent - rPercent) / d + 2;
        break;
      case bPercent:
        h = (rPercent - gPercent) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h, s, l };
};

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

// Função para gerar a paleta de cores com base no HSL
const generatePalette = (h: number, s: number, l: number) => {
  const palette: { [key: string]: string } = {};
  const steps = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5]; // Luminosidades para 50 a 950
  const labels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  for (let i = 0; i < steps.length; i++) {
    palette[labels[i]] = `hsl(${h}, ${s}%, ${steps[i]}%)`;
  }

  return palette;
};

// Função para converter HSL para Hex
const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
    );

  const r = f(0);
  const g = f(8);
  const b = f(4);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Função para inserir a cor informada na escala gerada
const insertInputColorInScale = (
  color: string,
  scale: { [key: string]: string },
  h: number,
  s: number,
  l: number
) => {
  const position = determinePositionInScale(l);
  scale[position] = `hsl(${h}, ${s}%, ${l}%)`;
  return scale;
};

// Função para gerar uma cor aleatória dentro da faixa de luminosidade da paleta
const generateRandomHSLColor = () => {
  const h = Math.floor(Math.random() * 360); // Tonalidade aleatória
  const s = Math.floor(Math.random() * (100 - 70 + 1)) + 70; // Saturação entre 70% e 100%
  const l = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5][
    Math.floor(Math.random() * 10)
  ]; // Luminosidades da escala

  return { h, s, l };
};

// Função para validar se a cor do input está na paleta
const validateInputColor = (
  inputColor: string,
  scale: { [key: string]: string }
): boolean => {
  const { h, s, l } = hexToHSL(inputColor); // Converte a cor de input para HSL
  const inputColorHex = hslToHex(h, s, l); // Converte HSL de volta para HEX para comparação

  // Verifica se a cor de input está na escala
  for (let key in scale) {
    const hslValues = scale[key]
      .match(/\d+/g)
      ?.map((value) => parseInt(value, 10)) as [number, number, number];
    const hexValue = hslToHex(hslValues[0], hslValues[1], hslValues[2]);

    // Se a cor do input está na escala, retorna true
    if (hexValue.toLowerCase() === inputColorHex.toLowerCase()) {
      return true;
    }
  }
  return false;
};

export default function ColorPalette() {
  const [inputColor, setInputColor] = useState<string>(""); // Cor inicial
  const [colorScale, setColorScale] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Função para gerar a escala de cores
  const generateColorScale = (color: string) => {
    try {
      const { h, s, l } = hexToHSL(color); // Converte Hex para HSL
      let scale = generatePalette(h, s, l); // Gera a paleta de cores com base em HSL

      // Insere a cor informada na escala de cores
      scale = insertInputColorInScale(color, scale, h, s, l);

      setColorScale(scale); // Atualiza a paleta
      setError("");
    } catch (error) {
      console.error("Cor inválida", error);
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

  useEffect(() => {
    // Gerar cor HSL aleatória ao carregar a página
    const randomHSL = generateRandomHSLColor();
    const initialColor = hslToHex(randomHSL.h, randomHSL.s, randomHSL.l);
    setInputColor(initialColor); // Atualiza a cor aleatória gerada como estado inicial
    generateColorScale(initialColor); // Gera a paleta com base nessa cor aleatória
  }, []);

  useEffect(() => {
    // Função para gerar uma cor válida e garantir que está na paleta
    const ensureValidColorInPalette = () => {
      let isValid = false;
      let randomColor = "";

      while (!isValid) {
        // Gera uma cor aleatória
        const randomHSL = generateRandomHSLColor();
        randomColor = hslToHex(randomHSL.h, randomHSL.s, randomHSL.l);

        // Gera a escala com base nessa cor
        const { h, s, l } = randomHSL;
        const scale = generatePalette(h, s, l);

        // Verifica se a cor aleatória está na paleta gerada
        isValid = validateInputColor(randomColor, scale);
        if (isValid) {
          setColorScale(scale); // Atualiza a paleta
        }
      }

      // Atualiza o estado com a cor válida
      setInputColor(randomColor);
    };

    // Executa a função ao carregar o componente
    ensureValidColorInPalette();
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
      <div className="flex w-full p-4">
        <div className="grid grid-cols-1 w-full h-24 sm:grid-cols-11 gap-1 mt-8">
          {Object.entries(colorScale).map(([key, color]) => {
            const textColor =
              Number(key) <= 400 ? colorScale["950"] : colorScale["50"];

            // Extrair os valores H, S, L da string HSL para converter para HEX
            const hslValues = color
              .match(/\d+/g)
              ?.map((value) => parseInt(value, 10)) as [number, number, number];
            const hexValue = hslToHex(hslValues[0], hslValues[1], hslValues[2]);

            // Comparar a cor HEX da paleta com o inputColor
            const isInputColor =
              hexValue.toLowerCase() === inputColor.toLowerCase();

            return (
              <div key={key} className="text-center">
                <div
                  className="w-full h-24 rounded-lg cursor-pointer relative"
                  style={{ backgroundColor: color }}
                >
                  <div className="flex flex-col h-full justify-end items-center gap-1 pb-3">
                    {isInputColor && (
                      <Lock width={16} style={{ color: textColor }} />
                    )}
                    <p
                      className="text-sm font-semibold"
                      style={{ color: textColor }}
                    >
                      {`${key}`}
                    </p>
                    {/* <p
                      className="text-xs uppercase"
                      style={{ color: textColor }}
                    >
                      {`${color}`}
                    </p> */}
                    <p
                      className="text-[11px] uppercase"
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
