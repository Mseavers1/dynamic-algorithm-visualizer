import React from "react";

type SubItemProps = {
    text: string;
    onClick: () => void;
};

type ListItemProps = {
    text: string;
    subItems?: SubItemProps[];
    onClick: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ text, subItems, onClick }) => {
    return (
        <li className="list-none">
            {/* Main Item */}
            <div
                onClick={onClick}
                className="cursor-pointer p-3 bg-gray-100 rounded hover:bg-gray-200 font-semibold text-gray-800 select-none"
            >
                {text}
            </div>

            {/* Sub-items */}
            {subItems && (
                <ul>
                    {subItems.map((subItem, index) => (
                        <li
                            key={index}
                            onClick={subItem.onClick}
                            className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-600 text-sm text-center font-normal"
                        >
                            {subItem.text}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
};

export default ListItem;
