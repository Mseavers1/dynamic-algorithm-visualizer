import React from "react";

type CardProps = {
    title: string;
    content: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, content }) => {

    const [isExpanded, setExpanded] = React.useState(true);

    const toggleCardBody = () => {
        setExpanded(!isExpanded);
    };

    return (
        <div className="bg-gray-100 rounded-lg shadow-lg z-10">
            <div
                className="bg-wku-red text-white p-4 rounded-t-lg cursor-pointer select-none"
                onClick={toggleCardBody}
            >
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            {isExpanded && (
                <div className="bg-gray-100 p-4 rounded-b-lg">
                    <p className="text-gray-700 mt-2">{content}</p>
                </div>
            )}
        </div>
    );
};

export default Card;
