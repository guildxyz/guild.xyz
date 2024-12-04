import { ChainIndicator } from "@/components/requirements/ChainIndicator";
import { RequirementLink } from "@/components/requirements/RequirementLink";
import { CHAINS, type SupportedChainID } from "@/config/chains";
import { GearSix, Warning } from "@phosphor-icons/react/dist/ssr";
import {
  Requirement,
  RequirementContent,
  RequirementFooter,
  RequirementImage,
} from "./Requirement";

import type { Rule } from "@/lib/schemas/rule";
import { shortenHex } from "@/lib/shortenHex";
import { Fragment } from "react";
import { Badge } from "../ui/Badge";
import { DataBlockWithCopy } from "./DataBlockWithCopy";

const PLACEHOLDER_REGEX = /\{\{([^{}]+)\}\}/g;
const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i;

const convertTemplateText = (templateText: string, requirement: Rule) =>
  templateText.replace(PLACEHOLDER_REGEX, (_match, rawKey) => {
    const key = rawKey.trim() as keyof typeof requirement.config &
      keyof typeof requirement.integration;

    const usableKeyValues = {
      ...requirement.config,
      ...requirement.integration,
    };

    return key in usableKeyValues ? usableKeyValues[key] : key;
  });

const isSupportedChain = (chainId?: number): chainId is SupportedChainID =>
  chainId ? !!CHAINS[chainId as SupportedChainID] : false;

const RequirementNode = ({
  node,
  requirement,
}: {
  node: Rule["ui"]["nodes"][number];
  requirement: Rule;
}) => {
  switch (node.type) {
    case "TEXT":
      return (
        <span key={node.id}>
          {convertTemplateText(node.value, requirement)}
        </span>
      );
    case "CHAIN_INDICATOR":
      // @ts-expect-error - TODO: create a map for chainId - chainName (uppercase) pairs
      return isSupportedChain(node.value) ? (
        <ChainIndicator key={node.id} chain={node.value} />
      ) : null;
    case "EXTERNAL_LINK":
      return (
        <RequirementLink
          key={node.id}
          href={convertTemplateText(node.href, requirement)}
        >
          {node.value}
        </RequirementLink>
      );
    default:
      return (
        <Badge>
          <Warning className="text-icon-warning" />
          <span>Unsupported node</span>
        </Badge>
      );
  }
};

export const RequirementDisplayComponent = ({
  requirement,
}: { requirement: Rule }) => {
  const headerNodes = requirement.ui.nodes.filter(
    (node) => node.position === "HEADER",
  );
  const footerNodes = requirement.ui.nodes.filter(
    (node) => node.position === "FOOTER",
  );

  if (requirement.ui.nodes?.length > 0) {
    return (
      <Requirement>
        <RequirementImage />
        <RequirementContent>
          <p>
            {headerNodes.map((node) => (
              <RequirementNode
                key={node.id}
                node={node}
                requirement={requirement}
              />
            ))}
          </p>
          {footerNodes?.length > 0 && (
            <RequirementFooter>
              {footerNodes.map((node) => (
                <RequirementNode
                  key={node.id}
                  node={node}
                  requirement={requirement}
                />
              ))}
            </RequirementFooter>
          )}
        </RequirementContent>
      </Requirement>
    );
  }

  const integrationConfigArray = Object.entries(requirement.config);

  return (
    <Requirement className="rounded-2xl border border-border bg-card-secondary p-5">
      <RequirementImage>
        <GearSix className="size-6" />
      </RequirementImage>
      <RequirementContent>
        <p>
          <span>{`${requirement.integration.displayName} (`}</span>
          {integrationConfigArray.map(([key, value], index) => (
            <Fragment key={key}>
              <span>{`${key}: `}</span>
              {typeof value === "string" && ADDRESS_REGEX.test(value) ? (
                <DataBlockWithCopy text={value}>
                  {shortenHex(value)}
                </DataBlockWithCopy>
              ) : (
                <span>
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </span>
              )}
              {index < integrationConfigArray.length - 1 && <span>{", "}</span>}
            </Fragment>
          ))}
          <span>)</span>
        </p>
        {typeof requirement.config.data !== "string" &&
          "chain" in requirement.config.data &&
          typeof requirement.config.data.chain === "number" &&
          isSupportedChain(requirement.config.data.chain) && (
            <RequirementFooter>
              <ChainIndicator chain={requirement.config.data.chain} />
            </RequirementFooter>
          )}
      </RequirementContent>
    </Requirement>
  );
};
