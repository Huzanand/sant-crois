'use client';

import { useState, useEffect } from "react";

export const useWindowWidth = () => {
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);
        handleResize(); // Проверяем ширину при монтировании

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
};
