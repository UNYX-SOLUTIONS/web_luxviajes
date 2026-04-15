"use client";
"use client";

import Image from "next/image";
import { Button } from "../common/Button";
import { cn } from "@/utils/cn";
import { useState, useRef, useEffect } from "react";

interface LocationPin {
  id: string;
  name: string;
  label: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

interface PromotionsMapProps {
  className?: string;
  pins?: LocationPin[];
}

const DEFAULT_PINS: LocationPin[] = [
  {
    id: "panama",
    name: "Panamá",
    label: "P",
    top: "61.3%",
    left: "23.5%",
  },
  {
    id: "colombia",
    name: "Colombia",
    label: "C",
    top: "63%",
    left: "25%",
  },
  {
    id: "brasil",
    name: "Brasil",
    label: "B",
    top: "71%",
    left: "32%",
  },
  {
    id: "china",
    name: "China",
    label: "C",
    top: "45%",
    left: "77%",
  },
  {
    id: "test",
    name: "Test",
    label: "T",
    top: "20%",
    left: "90%",
  },
];

export function PromotionsMap({
  className,
  pins = DEFAULT_PINS,
}: PromotionsMapProps) {
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({
    top: 0,
    left: 0,
    transform: "translateY(-100%)",
  });
  const [zoom, setZoom] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [visibleMapWidth, setVisibleMapWidth] = useState(800);
  const [visibleMapHeight, setVisibleMapHeight] = useState(600);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const lastCursorPosRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef({ zoom: 100, panX: 0, panY: 0 });

  const handleZoomIn = () => {
    const cursorX = lastCursorPosRef.current.x;
    const cursorY = lastCursorPosRef.current.y;
    const {
      zoom: prevZoom,
      panX: currentPanX,
      panY: currentPanY,
    } = stateRef.current;

    // Obtener el punto del mapa que está bajo el cursor (en coordenadas del mapa sin escalar)
    const mapPointX = (cursorX - currentPanX) / (prevZoom / 100);
    const mapPointY = (cursorY - currentPanY) / (prevZoom / 100);

    const newZoom = Math.min(prevZoom + 20, 400);

    // Calcular el nuevo pan para que el mismo punto del mapa permanezca bajo el cursor
    const newPanX = cursorX - mapPointX * (newZoom / 100);
    const newPanY = cursorY - mapPointY * (newZoom / 100);

    stateRef.current = { zoom: newZoom, panX: newPanX, panY: newPanY };
    setZoom(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleZoomOut = () => {
    const cursorX = lastCursorPosRef.current.x;
    const cursorY = lastCursorPosRef.current.y;
    const {
      zoom: prevZoom,
      panX: currentPanX,
      panY: currentPanY,
    } = stateRef.current;

    // Obtener el punto del mapa que está bajo el cursor (en coordenadas del mapa sin escalar)
    const mapPointX = (cursorX - currentPanX) / (prevZoom / 100);
    const mapPointY = (cursorY - currentPanY) / (prevZoom / 100);

    const newZoom = Math.max(prevZoom - 20, 100);

    // Calcular el nuevo pan para que el mismo punto del mapa permanezca bajo el cursor
    const newPanX = cursorX - mapPointX * (newZoom / 100);
    const newPanY = cursorY - mapPointY * (newZoom / 100);

    stateRef.current = { zoom: newZoom, panX: newPanX, panY: newPanY };
    setZoom(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleResetZoom = () => {
    stateRef.current = { zoom: 100, panX: 0, panY: 0 };
    setZoom(100);
    setPanX(0);
    setPanY(0);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const { panX: currentPanX, panY: currentPanY } = stateRef.current;
    setDragStart({
      x: e.clientX - currentPanX,
      y: e.clientY - currentPanY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setCursorPos(pos);
      lastCursorPosRef.current = pos;
    }

    if (!isDragging) return;
    const newPanX = e.clientX - dragStart.x;
    const newPanY = e.clientY - dragStart.y;
    stateRef.current.panX = newPanX;
    stateRef.current.panY = newPanY;
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    stateRef.current = { zoom, panX, panY };
  }, [zoom, panX, panY]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -20 : 20;
      const rect = container.getBoundingClientRect();
      const mouseEvent = e as MouseEvent;
      const cursorX = mouseEvent.clientX - rect.left;
      const cursorY = mouseEvent.clientY - rect.top;

      const {
        zoom: prevZoom,
        panX: currentPanX,
        panY: currentPanY,
      } = stateRef.current;

      // Obtener el punto del mapa que está bajo el cursor (en coordenadas del mapa sin escalar)
      const mapPointX = (cursorX - currentPanX) / (prevZoom / 100);
      const mapPointY = (cursorY - currentPanY) / (prevZoom / 100);

      const newZoom = Math.min(Math.max(prevZoom + delta, 100), 400);

      // Calcular el nuevo pan para que el mismo punto del mapa permanezca bajo el cursor
      const newPanX = cursorX - mapPointX * (newZoom / 100);
      const newPanY = cursorY - mapPointY * (newZoom / 100);

      stateRef.current = { zoom: newZoom, panX: newPanX, panY: newPanY };
      setZoom(newZoom);
      setPanX(newPanX);
      setPanY(newPanY);
    };

    container.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheelEvent);
    };
  }, []);

  // Actualizar dimensiones del mapa cuando cambia el tamaño del contenedor
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setVisibleMapWidth(rect.width || 800);
      setVisibleMapHeight(rect.height || 600);
    };

    // Actualizar al montar
    updateDimensions();

    // ResizeObserver para detectar cambios de tamaño
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Bloquear scroll cuando el dialog está abierto
  useEffect(() => {
    if (showPromoDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPromoDialog]);

  return (
    <section className={cn("bg-linear-to-b from-white to-gray-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
    <section className={cn("bg-linear-to-b from-white to-gray-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#500088]">
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#500088]">
            Top Promociones del Mes
          </h2>
          <p className="text-lg text-gray-600">
            Cada detalle es realizado por expertos para asegurar que tu única
            preocupación sea disfrutar del horizonte
          <p className="text-lg text-gray-600">
            Cada detalle es realizado por expertos para asegurar que tu única
            preocupación sea disfrutar del horizonte
          </p>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-auto">
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white rounded-lg shadow-lg p-2">
            <button
              onClick={handleZoomIn}
              className="px-3 py-2 rounded hover:bg-gray-100 font-semibold text-gray-700 transition-colors"
              title="Aumentar zoom"
            >
              +
            </button>
            <div className="px-3 py-2 text-gray-700 font-semibold min-w-[60px] text-center">
              {zoom}%
            </div>
            <button
              onClick={handleZoomOut}
              className="px-3 py-2 rounded hover:bg-gray-100 font-semibold text-gray-700 transition-colors"
              title="Disminuir zoom"
            >
              −
            </button>
            <div className="w-px bg-gray-300"></div>
            <button
              onClick={handleResetZoom}
              className="px-3 py-2 rounded hover:bg-gray-100 font-semibold text-gray-700 transition-colors text-xs"
              title="Restablecer zoom"
            >
              Restablecer
            </button>
          </div>

          {/* Map Image - Background */}
          <div
            ref={mapContainerRef}
            className="relative w-full h-auto overflow-hidden rounded-2xl cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
                transformOrigin: "0 0",
                transition: isDragging ? "none" : "transform 0.3s ease-in-out",
              }}
            >
              <Image
                src="/images/mapa.png"
                alt="Mapa de destinos"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                priority
                draggable="false"
              />
            </div>

            {/* Location Pins - Fixed Size */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              {pins.map((pin) => {
                const topPercent = pin.top ? parseFloat(pin.top) : 0;
                const leftPercent = pin.left ? parseFloat(pin.left) : 0;

                // Tamaño original del mapa (base)
                const baseMapWidth = 800;
                const baseMapHeight = 600;

                // Convertir porcentajes a píxeles en el mapa base (800x600)
                const pinLeftPxBase = (leftPercent / 100) * baseMapWidth;
                const pinTopPxBase = (topPercent / 100) * baseMapHeight;

                // Escalar al tamaño visible del mapa (usando estados)
                const scaleX = visibleMapWidth / baseMapWidth;
                const scaleY = visibleMapHeight / baseMapHeight;

                const pinLeftPxVisible = pinLeftPxBase * scaleX;
                const pinTopPxVisible = pinTopPxBase * scaleY;

                // Aplicar transformaciones de zoom y pan
                const screenLeft = pinLeftPxVisible * (zoom / 100) + panX;
                const screenTop = pinTopPxVisible * (zoom / 100) + panY;

                return (
                  <div
                    key={pin.id}
                    className="absolute z-10 pointer-events-auto"
                    style={{
                      top: `${screenTop}px`,
                      left: `${screenLeft}px`,
                      transform: "translateX(-50%)",
                      transition: isDragging ? "none" : "all 0.3s ease-in-out",
                    }}
                  >
                    <div
                      className="flex flex-col items-center cursor-pointer relative"
                      onClick={() => {
                        const mapRect =
                          mapContainerRef.current?.getBoundingClientRect();
                        const mapTop = mapRect?.top || 0;
                        const mapLeft = mapRect?.left || 0;

                        // Detectar si el pin está cerca de los límites del mapa visible (30%)
                        const threshold = 0.3;
                        const nearTop =
                          screenTop < visibleMapHeight * threshold;
                        const nearBottom =
                          screenTop > visibleMapHeight * (1 - threshold);
                        const nearRight =
                          screenLeft > visibleMapWidth * (1 - threshold);
                        const nearLeft =
                          screenLeft < visibleMapWidth * threshold;

                        let dialogTop = mapTop + screenTop - 40;
                        let dialogLeft = mapLeft + screenLeft + 20;
                        let transform = "translateY(-100%)";

                        // Si está cerca del top, mostrar debajo en lugar de arriba
                        if (nearTop) {
                          // SVG está 40px arriba, entonces pin está en screenTop + 40
                          dialogTop = mapTop + screenTop + 40;
                          transform = "translateY(0)";
                        }

                        // Si está cerca de la derecha, alinear a la izquierda
                        if (nearRight) {
                          dialogLeft = mapLeft + screenLeft - 20;
                        }

                        setDialogPosition({
                          top: dialogTop,
                          left: dialogLeft,
                          transform: transform,
                        });
                        setShowPromoDialog(true);
                      }}
                    >
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 hover:scale-125 transition-transform absolute bottom-full mb-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C7.03 2 3 6.03 3 11c0 6 9 13 9 13s9-7 9-13c0-4.97-4.03-9-9-9z"
                          fill="#9333EA"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <circle cx="12" cy="11" r="3" fill="white" />
                      </svg>
                      <div className="text-white text-xs md:text-sm font-semibold bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                        {pin.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promo Dialog */}
          {showPromoDialog && (
            <div
              className="fixed inset-0 z-50 p-4 bg-black/50 flex items-end justify-end"
              onClick={() => setShowPromoDialog(false)}
            >
              <div
                className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md animate-in absolute"
                style={{
                  top: `${dialogPosition.top}px`,
                  left: `${dialogPosition.left}px`,
                  transform: dialogPosition.transform,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Badge con imagen de fondo y botón */}
                <div className="relative h-70 w-50 overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 flex flex-col justify-end">
                  <button
                    onClick={() => setShowPromoDialog(false)}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    ✕
                  </button>

                  <Image
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop"
                    alt="Medellín Panamá"
                    fill
                    className="object-cover"
                  />
                  <div className="relative z-10 p-4 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center bg-white text-primary! !hover:bg-primary hover:text-white"
                    >
                      Ver más →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Text */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Haz clic en los pines para explorar más promociones</p>
        {/* Info Text */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Haz clic en los pines para explorar más promociones</p>
        </div>
      </div>
    </section>
  );
}
