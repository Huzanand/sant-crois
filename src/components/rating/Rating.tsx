import styled from "./rating.module.css";

interface RatingProps {
    maxRating?: number;
    rating: number;
    ICon?: React.ComponentType<
        React.SVGProps<SVGSVGElement> & { fill?: string }
    >;
}

const Rating: React.FC<RatingProps> = ({ maxRating = 5, rating, ICon }) => {
    const doAdpatationOfAcceptance = (acceptance: number) => {
        const roundedAndDivided = Math.ceil(Math.ceil(acceptance * 10) / 2);
        return (roundedAndDivided - maxRating) * -1 + 1;
    };

    const renderRating = () => {
        const items = [];

        for (let i = 0; i < maxRating; i++) {
            const item = ICon ? (
                <ICon
                    key={i}
                    fill={
                        doAdpatationOfAcceptance(rating) >= i + 1
                            ? "#ff7aaa"
                            : "#eae6ff"
                    }
                />
            ) : (
                <div
                    key={i}
                    className={styled.item}
                    style={{
                        backgroundColor:
                            doAdpatationOfAcceptance(rating) >= i + 1
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
