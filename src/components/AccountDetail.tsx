import {
  VStack,
  HStack,
  Button,
  Text,
  Tooltip,
  Box,
  Select,
  Input,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

export default function AccountDetail() {
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  return (
    <VStack justifyContent="center" alignItems="center" padding="10px 0">
      <HStack>
        <Text>{`Connection Status: `}</Text>
        {active ? (
          <CheckCircleIcon color="green" />
        ) : (
          <WarningIcon color="#cd5700" />
        )}
      </HStack>
      <Tooltip label={account} placement="right">
        <Text>{`Account: ${account}`}</Text>
      </Tooltip>
      <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
    </VStack>
  );
}
