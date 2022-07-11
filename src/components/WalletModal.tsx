import { useWeb3React } from "@web3-react/core";
import {
  Modal,
  UseModalProps,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Button,
  HStack,
  Text,
  Image,
  ModalContent,
} from "@chakra-ui/react";
import { SUPPORTED_WALLETS } from "../constants/wallet";

export default function WalletModal({ isOpen, onClose }: UseModalProps) {
  const { activate } = useWeb3React();
  function getOptions() {
    const option = SUPPORTED_WALLETS["METAMASK"];
    return (
      <VStack>
        <Button
          variant="outline"
          onClick={() => {
            activate(option.connector);
            onClose();
          }}
          w="100%"
        >
          <HStack w="100%" justifyContent="center">
            <Image
              src={option.iconURL}
              alt="Metamask Logo"
              width={25}
              height={25}
              borderRadius="3px"
            />
            <Text>Metamask</Text>
          </HStack>
        </Button>
      </VStack>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="300px">
        <ModalHeader>Select Wallet</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: "none",
          }}
        />
        <ModalBody paddingBottom="1.5rem">{getOptions()}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
