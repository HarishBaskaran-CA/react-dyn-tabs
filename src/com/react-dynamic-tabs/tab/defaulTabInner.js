import React from "react";
const DefaulTabInner = function (props) {
    const { id, api } = props, userIconClass = api.getTabObj(id).iconClass
        , { icon: defaultIconClass } = api.getSetting();
    return (
        <a {...props.liInnerProps}>
            {
                userIconClass &&
                <span className={`${userIconClass} ${defaultIconClass}`}></span>
            }
            {props.children}
        </a>
    );
};
export default DefaulTabInner;