import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import * as Tabs from '@radix-ui/react-tabs';
import {
  CreateSword,
  TransferSword,
} from "./Sword";

function App() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState<"create" | "transfer" | "swap">("create");

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{ borderBottom: "1px solid var(--gray-a2)" }}
      >
        <Box>
          <Heading>Sword DApp</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>

      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {currentAccount ? (
            <Tabs.Root
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            >
              <Tabs.List style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Tabs.Trigger value="create">Create Sword</Tabs.Trigger>
                <Tabs.Trigger value="transfer">Transfer Sword</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="create">
                <CreateSword onCreated={(swordId) => console.log("Created sword:", swordId)} />
              </Tabs.Content>

              <Tabs.Content value="transfer">
                <TransferSword />
              </Tabs.Content>
            </Tabs.Root>
          ) : (
            <Heading>Please connect your wallet</Heading>
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;
