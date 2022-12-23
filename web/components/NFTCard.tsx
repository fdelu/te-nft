import React from "react";
import styles from "../pages/styles.module.scss";
import { NFT } from "../types/NFT";
import { utils } from "ethers";
import {
    Card,
    CardTitle,
    CardSubtitle,
    CardBody,
    CardText,
    Button,
    Media,
} from "reactstrap";
import { Method } from "axios";

type NFTCardProps = {
    nft: NFT;
    i: number;
    shouldShowButton: boolean;
    buttonText?: string;
    onClickHandler?(nft: NFT): void;
};

export const NFTCard = ({ nft, i, shouldShowButton, buttonText, onClickHandler }: NFTCardProps) =>
    <Card key={i} className={styles.NFTCard}>
        <CardBody style={{ flex: "none" }}>
            <CardTitle tag="h5">{nft.name}</CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
                {utils.formatEther(nft.price)} ETH
            </CardSubtitle>
        </CardBody>
        <Media object src={nft.image} className={styles.agrandar} />
        <CardBody style={{ flex: "none" }}>
            <CardText>{nft.description}</CardText>
            {shouldShowButton && onClickHandler && <Button onClick={() => onClickHandler(nft)}>{buttonText}</Button>}
        </CardBody>
    </Card >