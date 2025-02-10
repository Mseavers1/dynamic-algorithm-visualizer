import React, {useState} from "react";
import {useTransition} from "@react-spring/web";

export const MaxHeap = () => {

    const [values, setValues] = useState<(number | string)[]>([]);

    const insert = (value : string | number) => {
        setValues((prev) => [...prev, value]);
    }

    const nodeTransitions = useTransition(values, {
        keys: (item) => `${item}`,  // Ensure unique keys for each item
        from: { opacity: 0, transform: 'scale(0)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0)' },
    });

    const getNodePosition = (index: number) => {
        const x = 100 + index * 150;  // Example horizontal position
        const y = 100;  // All nodes aligned at the same vertical position
        return { x, y };
    };

    return (
        <svg width="500" height="500">
            <g>

            </g>
        </svg>
    )

}