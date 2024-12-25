import React from "react";

function Christmas(props) {
    return (
        <div>
            <h1>{`크리스마스는 ${props.name}입니다.`}</h1>
            <h2>{`크리스마스는 ${props.numOfDate}입니다.`}</h2>
        </div>
    )
}

export default Christmas;
