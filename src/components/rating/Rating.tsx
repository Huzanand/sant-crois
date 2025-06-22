import styled from "./rating.module.css";

interface RatingProps {
    maxRating?: number;
    rating: number;
    ICon?: React.ComponentType<
        React.SVGProps<SVGSVGElement> & { fill?: string }
    >;
    isComplexity?: boolean;
}

const Rating: React.FC<RatingProps> = ({
    maxRating = 5,
    rating,
    ICon,
    isComplexity,
}) => {
    const doAdpatation = (value: number) => {
        if (isComplexity) {
            if (value === 0) return 5;
        } else {
            if (value === 0) return 1;
        }
        const roundedAndDivided = Math.ceil(Math.ceil(value * 10) / 2);
        return (roundedAndDivided - maxRating) * -1 + 1;
    };

    const renderRating = () => {
        const items = [];

        for (let i = 0; i < maxRating; i++) {
            const item = ICon ? (
                <ICon
                    key={i}
                    fill={doAdpatation(rating) >= i + 1 ? "#ff7aaa" : "#eae6ff"}
                />
            ) : (
                <div
                    key={i}
                    className={styled.item}
                    style={{
                        backgroundColor:
                            doAdpatation(rating) >= i + 1
                                ? "#ff7aaa"
                                : "#eae6ff",
                    }}
                />
            );

            items.push(item);
        }

        return items;
    };

    return <div className={styled.container}>{renderRating()}</div>;
};

export default Rating;
