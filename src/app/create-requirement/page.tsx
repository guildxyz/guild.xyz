import { ChainIndicator } from "@/components/requirements/ChainIndicator";
import { DataBlock } from "@/components/requirements/DataBlock";
import { DataBlockWithCopy } from "@/components/requirements/DataBlockWithCopy";
import {
  Requirement,
  RequirementContent,
  RequirementFooter,
  RequirementImage,
} from "@/components/requirements/Requirement";
import { RequirementLink } from "@/components/requirements/RequirementLink";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { CHAINS, type SupportedChainID } from "@/config/chains";
import type {
  Configuration,
  Integration,
  RequirementDisplayComponentConfig,
  RequirementDisplayNodeConfig,
} from "@/lib/schemas/integrationBuilder";
import { shortenHex } from "@/lib/shortenHex";
import { GearSix } from "@phosphor-icons/react/dist/ssr";
import { Fragment } from "react";

const isSupportedChain = (chainId?: number): chainId is SupportedChainID =>
  chainId ? !!CHAINS[chainId as SupportedChainID] : false;

// These 2 objects will come from our backend
const TEMP_INTEGRATION = {
  id: "temp_integration_id",
  display_name: "ERC20 Token",
  identity_type: "address",
  incoming_data_config: {
    fields: [
      {
        name: "amount",
        type: "number",
        ops: [
          {
            op: "set",
          },
        ],
      },
    ],
  },
} satisfies Integration;

const TEMP_CONFIGURATION = {
  id: "temp_configuration_id",
  integration_id: "temp_integration_id",
  data: {
    chain: 1,
    address: "0xff04820c36759c9f5203021fe051239ad2dcca8a",
    amount: 1,
  },
} satisfies Configuration;
const _configurationData = Object.entries(TEMP_CONFIGURATION.data);
const configurationData = isSupportedChain(TEMP_CONFIGURATION.data.chain)
  ? _configurationData.filter(([key]) => key !== "chain")
  : _configurationData;

const ADDRESS_REGEX = /^0x[a-f0-9]{40}$/i;

// This is what the user will build on our UI
const customRequirementDisplayComponent = {
  configurationId: "temp_configuration_id",
  contentNodes: [
    {
      id: "contentNode1",
      type: "TEXT",
      value: "Hold at least {{amount}} ETH",
    },
  ],
  footerNodes: [
    {
      id: "footerNode1",
      type: "CHAIN_INDICATOR",
      value: TEMP_CONFIGURATION.data.chain,
    },
    {
      id: "footerNode2",
      type: "EXTERNAL_LINK",
      href: "https://etherscan.io/address/{{address}}",
      value: "View on explorer",
    },
  ],
} satisfies RequirementDisplayComponentConfig;

const PLACEHOLDER_REGEX = /\{\{([^{}]+)\}\}/g;
const convertTemplateText = (
  templateText: string,
  requirementConfiguration: Configuration,
) =>
  templateText.replace(PLACEHOLDER_REGEX, (_match, rawKey) => {
    const key = rawKey.trim();
    return key in requirementConfiguration.data
      ? requirementConfiguration.data[key]
      : key;
  });

const renderNode = (
  node: RequirementDisplayNodeConfig,
  requirementConfiguration: Configuration,
) => {
  switch (node.type) {
    case "TEXT":
      return (
        <span key={node.id}>
          {convertTemplateText(node.value, requirementConfiguration)}
        </span>
      );
    case "CHAIN_INDICATOR":
      return isSupportedChain(node.value) ? (
        <ChainIndicator key={node.id} chain={node.value} />
      ) : null;
    case "EXTERNAL_LINK":
      return (
        <RequirementLink
          key={node.id}
          href={convertTemplateText(node.href, requirementConfiguration)}
        >
          {node.value}
        </RequirementLink>
      );
    default:
      return null;
  }
};

const CreateRequirementPage = () => {
  return (
    <main className="container mx-auto max-w-md py-16">
      <Card className="grid gap-6 px-5 py-6 shadow-lg md:px-6">
        <div className="grid gap-2">
          <h1 className="text-center font-display font-extrabold text-2xl">
            Create requirement
          </h1>
          <p className="text-center text-foreground-secondary">
            Set up a custom requirement display component
          </p>
        </div>

        <div className="grid gap-1.5">
          <Label>Available content blocks:</Label>
          <div className="grid gap-1">
            <div className="flex items-center gap-1">
              <span>Data block:</span>
              <DataBlock>Example</DataBlock>
            </div>

            <div className="flex items-center gap-1">
              <span>Data block with copy:</span>
              <DataBlockWithCopy text="Example" />
            </div>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label>Available footer blocks:</Label>
          <div className="grid gap-1">
            <div className="flex items-center gap-1">
              <span>Chain indicator:</span>
              <ChainIndicator chain={1} />
            </div>

            <div className="flex items-center gap-1">
              <span>External link:</span>
              <RequirementLink href="#">View on explorer</RequirementLink>
            </div>
          </div>
        </div>

        <hr />

        <Requirement className="rounded-2xl border border-border bg-card-secondary p-5">
          <RequirementImage>
            <GearSix className="size-6" />
          </RequirementImage>
          <RequirementContent>
            <p>
              <span>{`${TEMP_INTEGRATION.display_name} (`}</span>
              {configurationData.map(([key, value], index) => (
                <Fragment key={key}>
                  <span>{`${key}: `}</span>
                  {typeof value === "string" && ADDRESS_REGEX.test(value) ? (
                    <DataBlockWithCopy text={value}>
                      {shortenHex(value)}
                    </DataBlockWithCopy>
                  ) : (
                    <span>{value}</span>
                  )}
                  {index < configurationData.length - 1 && <span>{", "}</span>}
                </Fragment>
              ))}
              <span>)</span>
            </p>
            {isSupportedChain(TEMP_CONFIGURATION.data.chain) && (
              <RequirementFooter>
                <ChainIndicator chain={TEMP_CONFIGURATION.data.chain} />
              </RequirementFooter>
            )}
          </RequirementContent>
        </Requirement>

        <Requirement className="rounded-2xl border border-border bg-card-secondary p-5">
          <RequirementImage />
          <RequirementContent>
            <p>
              {customRequirementDisplayComponent.contentNodes.map((node) =>
                renderNode(node, TEMP_CONFIGURATION),
              )}
            </p>
            {customRequirementDisplayComponent.footerNodes?.length > 0 && (
              <RequirementFooter>
                {customRequirementDisplayComponent.footerNodes.map((node) =>
                  renderNode(node, TEMP_CONFIGURATION),
                )}
              </RequirementFooter>
            )}
          </RequirementContent>
        </Requirement>
      </Card>
    </main>
  );
};

export default CreateRequirementPage;
