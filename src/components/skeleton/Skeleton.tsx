const Skeleton = () => {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <div
                style={{
                    boxShadow: "0 4px 12px 0 rgba(163, 148, 205, 0.34)",
                    background: "#fff",
                    borderRadius: "10px",
                    padding: "16px 24px 24px 24px",
                    width: "100%",
                    height: "326px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div
                    style={{
                        borderRadius: "5px",
                        background:
                            "linear-gradient(180deg, #998dd9 0%, #6554c0 51.4%, #403294 100% )",
                        width: "100%",
                        height: "141px",
                        display: "flex",
                        alignItems: "flex-end",
                    }}
                >
                    <div
                        style={{
                            borderRadius: "5px",
                            width: "87%",
                            height: "57px",
                            background: "#f3f1ff",
                            margin: " 0 0 8px 8px",
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "121px",
                        gap: "18px",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "4px",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: "5px",
                                    width: "85%",
                                    height: "40px",
                                    backgroundColor: "#eae6ff",
                                }}
                            />
                            <div
                                style={{
                                    borderRadius: "5px",
                                    width: "8%",
                                    height: "20px",
                                    backgroundColor: "#eae6ff",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "4px",
                            }}
                        >
                            <div
                                style={{
                                    borderRadius: "5px",
                                    width: "100%",
                                    height: "20px",
                                    backgroundColor: "#eae6ff",
                                }}
                            />
                            <div
                                style={{
                                    borderRadius: "5px",
                                    width: "100%",
                                    height: "20px",
                                    backgroundColor: "#eae6ff",
                                }}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                borderRadius: "5px",
                                width: "47%",
                                height: "17px",
                                backgroundColor: "#eae6ff",
                            }}
                        />
                        <div
                            style={{
                                borderRadius: "5px",
                                width: "18%",
                                height: "17px",
                                backgroundColor: "#eae6ff",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
