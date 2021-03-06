/*
 * Copyright (c) 2022 Alexandr <re-knownout> knownout@hotmail.com
 * Licensed under the GNU Affero General Public License v3.0 License (AGPL-3.0)
 * https://github.com/re-knownout/lib
 */

import { InformationCircleIcon } from "@heroicons/react/solid";
import { Button } from "@knownout/interface";
import { classNames } from "@knownout/lib";
import React, { Fragment, memo } from "react";
import { createPortal } from "react-dom";
import { atom, useRecoilValue } from "recoil";

import "./PopupComponent.scss";

type TPopupButton = {
    /** Button text. */
    children: string;

    /** Button icon. */
    icon?: JSX.Element;

    /** Button onClick event (without state) */
    onClick? (target: HTMLButtonElement): void;
};

export interface IPopupState
{
    /** Popup shown state. */
    open: boolean;

    /** Popup title text (h1). */
    title: string;

    /** List of popup paragraphs. */
    content: (string | JSX.Element)[];

    /** Add an icon before popup title. */
    titleIcon?: JSX.Element;

    /** Class name for current popup */
    className?: string;

    /** Add a hint at bottom of the popup (before buttons). */
    hintContent?: string;

    /** Define buttons to render. */
    buttons: TPopupButton[];
}

/** Popup component state. */
export const popupComponentState = atom<IPopupState>({
    key: "PopoverComponentState",
    default: {
        open: false,

        title: String(),

        content: [],

        buttons: []
    }
});

/**
 * React component to create popups using recoil state.
 * @internal
 */
export default memo(() => {
    const { open, title, titleIcon, content, hintContent, buttons, className } = useRecoilValue(popupComponentState);

    const popoverClassName = classNames("popup-component", className, { open });
    const component = <div className={ popoverClassName }>
        <div className="popup-content-wrapper">
            <div className="popup-content-holder">
                <h1>{ titleIcon }{ title }</h1>
                <div className="content-holder">
                    { content.map((content, index) => {
                        const key = index + "_PTK";
                        if (typeof content === "string") return <p children={ content } key={ key } />;
                        else return <Fragment key={ key }>{ content }</Fragment>;
                    }) }
                </div>
                { hintContent && <span>{ <InformationCircleIcon /> } { hintContent }</span> }
            </div>

            <div className="popup-buttons-holder">
                { buttons.map((button, index) =>
                    <Button { ...button } key={ index + "_PBK" }>{ button.children }</Button>
                ) }
            </div>
        </div>
    </div>;

    // Create portal to avoid z-index usage.
    return createPortal(component, document.body);
});
